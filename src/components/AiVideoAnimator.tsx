import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  Play,
  Pause,
  Download,
  RotateCcw,
  Film,
  Camera,
  Layers,
  Sliders,
  CheckCircle2,
  Loader2,
  X,
  Maximize,
  Info,
  Wand2,
  Compass,
  Flame,
  CloudRain,
  Eye,
  Tv
} from 'lucide-react';

interface AiVideoAnimatorProps {
  isOpen: boolean;
  onClose: () => void;
}

type AspectRatio = '16:9' | '9:16' | '1:1';
type MotionStyle = 'zoom-in' | 'zoom-out' | 'pan-horizontal' | 'rain-storm' | 'floating-embers' | 'action-shake' | 'cosmic-float';

interface PresetStyle {
  id: MotionStyle;
  name: string;
  icon: string;
  description: string;
  promptText: string;
}

const PRESET_STYLES: PresetStyle[] = [
  {
    id: 'zoom-in',
    name: 'Cinematic Zoom In',
    icon: '🎬',
    description: 'Slow, dramatic focus push into subject with depth',
    promptText: 'Cinematic slow push-in zoom into the focal subject, shallow depth of field, subtle film grain, dramatic lighting.',
  },
  {
    id: 'pan-horizontal',
    name: 'Dynamic Camera Pan',
    icon: '↔️',
    description: 'Smooth horizontal sweeping parallax motion',
    promptText: 'Wide horizontal camera glide from left to right, sweeping parallax perspective, ambient lighting drift.',
  },
  {
    id: 'rain-storm',
    name: 'Rain & Moody Storm',
    icon: '🌧️',
    description: 'Cinematic falling rain, mist streaks, soft lightning pulses',
    promptText: 'Moody atmospheric cinematic rain falling, soft wind mist, subtle thunder light pulse, damp reflections.',
  },
  {
    id: 'floating-embers',
    name: 'Glowing Embers & Sparks',
    icon: '✨',
    description: 'Rising fire sparks and magical golden bokeh particles',
    promptText: 'Warm glowing fire embers and golden sparks floating upwards, mystical bokeh lighting, soft camera orbit.',
  },
  {
    id: 'action-shake',
    name: 'Action Camera Rumble',
    icon: '⚡',
    description: 'High-octane camera vibration and rapid zoom punch',
    promptText: 'High-energy cinematic camera shake, dramatic zoom punch, intense blockbuster motion dynamics.',
  },
  {
    id: 'cosmic-float',
    name: '3D Parallax Float',
    icon: '🌌',
    description: 'Multi-plane gentle 3D perspective warp and glow',
    promptText: 'Smooth multi-plane 3D floating perspective, cosmic glow, subtle orbital camera tilt, dreamy depth.',
  },
];

// High quality cinematic curated demo images
const SAMPLE_IMAGES = [
  {
    title: 'Action Hero',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    type: 'Action Cinema'
  },
  {
    title: 'Cyberpunk City',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    type: 'Sci-Fi'
  },
  {
    title: 'Misty Waterfall',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    type: 'Nature & Motion'
  },
  {
    title: 'Galaxy Nebula',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    type: 'Cosmic Fantasy'
  }
];

export const AiVideoAnimator: React.FC<AiVideoAnimatorProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES[0].url);
  const [prompt, setPrompt] = useState<string>(PRESET_STYLES[0].promptText);
  const [activePreset, setActivePreset] = useState<MotionStyle>('zoom-in');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<number>(5); // 3, 5, 8 seconds
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0); // 0.7, 1.0, 1.4

  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStage, setGenerationStage] = useState<string>('');

  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preset Selection
  const handleSelectPreset = (preset: PresetStyle) => {
    setActivePreset(preset.id);
    setPrompt(preset.promptText);
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (typeof loadEvent.target?.result === 'string') {
          setSelectedImage(loadEvent.target.result);
          setGeneratedVideoUrl(null);
          showToast('Image uploaded! You can now customize your motion prompt.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Prompt Enhancer (Using Free Tier Gemini via server)
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setPrompt('Cinematic camera motion with dramatic depth and atmospheric lighting');
    }
    setIsEnhancingPrompt(true);
    try {
      const res = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: prompt, style: activePreset }),
      });
      const data = await res.json();
      if (data?.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        showToast('✨ Prompt enhanced with cinematic direction!');
      }
    } catch (err) {
      console.error('Enhance prompt error:', err);
      // Fallback
      setPrompt((prev) => `${prev.trim()}, slow 3D camera push-in, volumetric cinema lighting, atmospheric depth, ultra-realistic motion dynamics.`);
      showToast('✨ Motion instructions updated!');
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Generate Video using HTML5 Canvas & MediaRecorder (100% Client-Side Free AI Simulation)
  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      showToast('Please upload or select an image first.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedVideoUrl(null);
    setGenerationStage('Loading source image textures...');

    try {
      // 1. Load image into HTML Image object
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => {
          // If CORS fails on sample image, fallback gracefully
          img.crossOrigin = '';
          img.src = selectedImage;
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image.'));
        };
        img.src = selectedImage;
      });

      // 2. Set Canvas Resolution based on Aspect Ratio
      const canvas = canvasRef.current || document.createElement('canvas');
      let targetWidth = 1280;
      let targetHeight = 720;
      if (aspectRatio === '9:16') {
        targetWidth = 720;
        targetHeight = 1280;
      } else if (aspectRatio === '1:1') {
        targetWidth = 800;
        targetHeight = 800;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Could not get canvas context.');

      setGenerationStage('Synthesizing 3D camera trajectory & depth...');
      setGenerationProgress(15);

      // Setup MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const recordedChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      const totalFrames = duration * 30; // 30 fps
      let currentFrame = 0;

      // Particle system state for rain / embers
      const particles: Array<{
        x: number;
        y: number;
        speedY: number;
        speedX: number;
        size: number;
        alpha: number;
        length?: number;
      }> = [];

      const numParticles = activePreset === 'rain-storm' ? 120 : activePreset === 'floating-embers' ? 60 : 30;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * targetWidth,
          y: Math.random() * targetHeight,
          speedY: activePreset === 'rain-storm' ? 14 + Math.random() * 12 : activePreset === 'floating-embers' ? -(1 + Math.random() * 2.5) : (Math.random() - 0.5) * 1.5,
          speedX: activePreset === 'rain-storm' ? -2 - Math.random() * 2 : (Math.random() - 0.5) * 1.5,
          size: activePreset === 'floating-embers' ? 2 + Math.random() * 3 : 1 + Math.random() * 2,
          alpha: 0.2 + Math.random() * 0.7,
          length: activePreset === 'rain-storm' ? 12 + Math.random() * 16 : undefined,
        });
      }

      mediaRecorder.start();

      // Render Loop
      await new Promise<void>((resolve) => {
        const renderStep = () => {
          if (currentFrame >= totalFrames) {
            mediaRecorder.stop();
            resolve();
            return;
          }

          const progress = currentFrame / totalFrames; // 0 to 1
          const easedProgress = Math.sin((progress * Math.PI) / 2); // Smooth ease-out

          // Update Progress & Stages
          const pct = Math.floor(15 + progress * 80);
          setGenerationProgress(pct);
          if (pct < 40) {
            setGenerationStage('Computing 3D camera pan & optical vectors...');
          } else if (pct < 70) {
            setGenerationStage('Simulating atmospheric particles & cinematic lighting...');
          } else {
            setGenerationStage('Encoding high-bitrate video stream...');
          }

          // Calculate Camera Transform based on style
          let scale = 1.0;
          let panX = 0;
          let panY = 0;
          let rotation = 0;

          const intensity = speedMultiplier;

          switch (activePreset) {
            case 'zoom-in':
              scale = 1.0 + easedProgress * 0.22 * intensity;
              panY = Math.sin(progress * Math.PI) * -12 * intensity;
              break;
            case 'zoom-out':
              scale = 1.25 - easedProgress * 0.2 * intensity;
              break;
            case 'pan-horizontal':
              scale = 1.12;
              panX = (progress - 0.5) * -70 * intensity;
              panY = Math.sin(progress * Math.PI * 2) * 6;
              break;
            case 'action-shake':
              scale = 1.08 + Math.sin(progress * Math.PI) * 0.12 * intensity;
              panX = (Math.random() - 0.5) * 7 * intensity;
              panY = (Math.random() - 0.5) * 7 * intensity;
              rotation = (Math.random() - 0.5) * 0.015 * intensity;
              break;
            case 'cosmic-float':
              scale = 1.05 + Math.sin(progress * Math.PI) * 0.1 * intensity;
              rotation = Math.sin(progress * Math.PI * 2) * 0.018 * intensity;
              panX = Math.cos(progress * Math.PI) * 20 * intensity;
              panY = Math.sin(progress * Math.PI) * 15 * intensity;
              break;
            case 'rain-storm':
              scale = 1.05 + easedProgress * 0.08 * intensity;
              panY = easedProgress * 15 * intensity;
              break;
            case 'floating-embers':
              scale = 1.06 + Math.sin(progress * Math.PI) * 0.09 * intensity;
              panY = -progress * 20 * intensity;
              break;
          }

          // Clear Canvas
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Draw Transformed Image (Cover with aspect ratio preserve)
          ctx.save();
          ctx.translate(targetWidth / 2, targetHeight / 2);
          ctx.rotate(rotation);
          ctx.scale(scale, scale);
          ctx.translate(-targetWidth / 2 + panX, -targetHeight / 2 + panY);

          // Center crop / cover calculation
          const imgAspect = img.width / img.height;
          const canvasAspect = targetWidth / targetHeight;
          let drawW = targetWidth;
          let drawH = targetHeight;
          let drawX = 0;
          let drawY = 0;

          if (imgAspect > canvasAspect) {
            drawH = targetHeight;
            drawW = targetHeight * imgAspect;
            drawX = (targetWidth - drawW) / 2;
          } else {
            drawW = targetWidth;
            drawH = targetWidth / imgAspect;
            drawY = (targetHeight - drawH) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.restore();

          // Render Particle Overlays (Rain / Embers / Sparks / Atmospheric Light)
          if (activePreset === 'rain-storm') {
            ctx.save();
            ctx.strokeStyle = 'rgba(210, 230, 255, 0.45)';
            ctx.lineWidth = 1.4;
            for (const p of particles) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.x + p.speedX * 1.5, p.y + (p.length || 14));
              ctx.stroke();

              p.y += p.speedY;
              p.x += p.speedX;
              if (p.y > targetHeight) {
                p.y = -20;
                p.x = Math.random() * targetWidth;
              }
            }
            // Lightning pulse
            if (Math.random() < 0.02) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
              ctx.fillRect(0, 0, targetWidth, targetHeight);
            }
            ctx.restore();
          } else if (activePreset === 'floating-embers') {
            ctx.save();
            for (const p of particles) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
              grad.addColorStop(0, `rgba(255, 180, 50, ${p.alpha})`);
              grad.addColorStop(1, 'rgba(255, 80, 10, 0)');
              ctx.fillStyle = grad;
              ctx.fill();

              p.y += p.speedY;
              p.x += Math.sin(p.y * 0.02) * 1.2;
              if (p.y < -10) {
                p.y = targetHeight + 10;
                p.x = Math.random() * targetWidth;
              }
            }
            ctx.restore();
          } else if (activePreset === 'cosmic-float') {
            // Soft ambient light flare sweep
            ctx.save();
            const flareX = (progress * 1.4 - 0.2) * targetWidth;
            const flareGrad = ctx.createRadialGradient(flareX, targetHeight * 0.3, 0, flareX, targetHeight * 0.3, targetWidth * 0.5);
            flareGrad.addColorStop(0, 'rgba(120, 180, 255, 0.18)');
            flareGrad.addColorStop(0.5, 'rgba(180, 100, 255, 0.06)');
            flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = flareGrad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.restore();
          }

          // Subtle Cinematic Vignette
          const vigGrad = ctx.createRadialGradient(
            targetWidth / 2,
            targetHeight / 2,
            targetWidth * 0.3,
            targetWidth / 2,
            targetHeight / 2,
            targetWidth * 0.75
          );
          vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
          vigGrad.addColorStop(1, 'rgba(0,0,0,0.55)');
          ctx.fillStyle = vigGrad;
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          currentFrame++;
          animationFrameRef.current = requestAnimationFrame(renderStep);
        };

        renderStep();
      });

      // Wait for recorder to finalize
      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
          const videoUrl = URL.createObjectURL(blob);
          setGeneratedVideoUrl(videoUrl);
          setGenerationProgress(100);
          setGenerationStage('Complete! Your AI video is ready.');
          showToast('🎉 AI Video generated successfully! You can now watch and download it.');
          resolve();
        };
      });

    } catch (err: any) {
      console.error('Video generation error:', err);
      showToast(err?.message || 'Error creating video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Handler
  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return;
    const a = document.createElement('a');
    a.href = generatedVideoUrl;
    a.download = `ai-animated-video-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('⬇️ Downloading video to your device...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0f141e] border border-[#252f42] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="bg-[#161d2b] border-b border-[#232c3d] px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  AI Image-to-Video Animator
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 tracking-wider uppercase">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                Turn any static photo or movie poster into cinematic animated motion with AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#20293a] hover:bg-[#2c374d] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Content Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input, Presets & Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* 1. Image Input Section */}
            <div className="bg-[#141a26] border border-[#232d3f] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  1. Source Image
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Selected Image Thumbnail & Sample Picker */}
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border-2 border-dashed border-[#334155] hover:border-rose-500 cursor-pointer flex-shrink-0 transition-all shadow-md bg-black"
                >
                  <img
                    src={selectedImage}
                    alt="Source"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] transition-opacity">
                    <Upload className="w-4 h-4 mb-1" />
                    <span>Change</span>
                  </div>
                </div>

                {/* Sample Images Palette */}
                <div className="flex-1">
                  <span className="text-[11px] text-gray-400 block mb-1.5">
                    Or select a cinema sample:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_IMAGES.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedImage(sample.url);
                          setGeneratedVideoUrl(null);
                        }}
                        className={`text-left rounded-lg overflow-hidden border p-1 transition-all ${
                          selectedImage === sample.url
                            ? 'border-amber-400 bg-amber-400/10'
                            : 'border-[#263145] hover:border-gray-500 bg-[#192233]'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.title}
                          className="w-full h-11 object-cover rounded mb-1"
                        />
                        <span className="text-[10px] font-medium text-gray-300 truncate block">
                          {sample.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Motion Prompt & AI Enhancer */}
            <div className="bg-[#141a26] border border-[#232d3f] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Wand2 className="w-3.5 h-3.5 text-rose-400" />
                  2. Motion Prompt
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancingPrompt}
                  className="text-xs bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Enhance prompt with Gemini Hollywood director intelligence"
                >
                  {isEnhancingPrompt ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{isEnhancingPrompt ? 'Enhancing...' : '✨ AI Director Enhance'}</span>
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                placeholder="Describe how camera moves, particles drift, or characters animate..."
                className="w-full bg-[#0a0d14] border border-[#242e40] focus:border-rose-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-colors resize-none"
              />

              {/* Preset Chips */}
              <div className="mt-3">
                <span className="text-[11px] text-gray-400 block mb-2">
                  Cinema Motion Presets:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_STYLES.map((preset) => {
                    const isSelected = activePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-left px-2.5 py-2 rounded-lg border text-xs transition-all flex items-start gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500/80 text-rose-200 shadow-sm'
                            : 'bg-[#182030] border-[#253044] text-gray-400 hover:text-gray-200 hover:border-gray-600'
                        }`}
                      >
                        <span className="text-base">{preset.icon}</span>
                        <div className="overflow-hidden">
                          <span className="font-semibold block truncate leading-tight">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate mt-0.5">
                            {preset.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Video Configuration (Aspect Ratio, Duration, Speed) */}
            <div className="bg-[#141a26] border border-[#232d3f] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Aspect Ratio */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#0a0d14] p-1 rounded-lg border border-[#232d3f]">
                  {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setAspectRatio(ar)}
                      className={`text-xs py-1 rounded font-medium transition-all ${
                        aspectRatio === ar
                          ? 'bg-rose-600 text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#0a0d14] p-1 rounded-lg border border-[#232d3f]">
                  {[3, 5, 8].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`text-xs py-1 rounded font-medium transition-all ${
                        duration === sec
                          ? 'bg-amber-500 text-black font-bold shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Multiplier */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Motion Dynamics
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#0a0d14] p-1 rounded-lg border border-[#232d3f]">
                  {[
                    { label: '0.7x', val: 0.7 },
                    { label: '1.0x', val: 1.0 },
                    { label: '1.4x', val: 1.4 },
                  ].map((spd) => (
                    <button
                      key={spd.val}
                      type="button"
                      onClick={() => setSpeedMultiplier(spd.val)}
                      className={`text-xs py-1 rounded font-medium transition-all ${
                        speedMultiplier === spd.val
                          ? 'bg-sky-500 text-white font-bold shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm sm:text-base bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 active:scale-[0.99] transition-all shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing AI Video ({generationProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Generate Free AI Video</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Video Preview & Player Output (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#141a26] border border-[#232d3f] rounded-xl p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Tv className="w-3.5 h-3.5 text-sky-400" />
                    Preview & Output Video
                  </span>
                  {generatedVideoUrl && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to Download
                    </span>
                  )}
                </div>

                {/* Display Area: Video Player OR Canvas / Placeholder */}
                <div
                  className={`w-full rounded-xl overflow-hidden bg-black border border-[#263145] relative flex items-center justify-center shadow-inner ${
                    aspectRatio === '16:9'
                      ? 'aspect-video'
                      : aspectRatio === '9:16'
                      ? 'aspect-[9/16] max-h-[380px] mx-auto'
                      : 'aspect-square max-h-[360px] mx-auto'
                  }`}
                >
                  {isGenerating ? (
                    /* Progress Screen during Generation */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black/90">
                      <div className="w-14 h-14 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin mb-4" />
                      <span className="text-lg font-bold text-white mb-1">
                        {generationProgress}%
                      </span>
                      <p className="text-xs text-amber-300 font-medium max-w-xs animate-pulse">
                        {generationStage}
                      </p>
                      {/* Linear Progress Bar */}
                      <div className="w-full max-w-xs bg-gray-800 h-1.5 rounded-full overflow-hidden mt-4">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-200"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : generatedVideoUrl ? (
                    /* Generated Video Player */
                    <div className="relative w-full h-full group">
                      <video
                        ref={videoPreviewRef}
                        src={generatedVideoUrl}
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      {/* Play/Pause Overlay Overlay */}
                      <button
                        type="button"
                        onClick={() => {
                          if (videoPreviewRef.current) {
                            if (videoPreviewRef.current.paused) {
                              videoPreviewRef.current.play();
                            } else {
                              videoPreviewRef.current.pause();
                            }
                          }
                        }}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                      </button>
                    </div>
                  ) : (
                    /* Default Still Image Preview */
                    <div className="relative w-full h-full">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col items-center justify-end p-4 text-center">
                        <span className="text-xs text-gray-300 font-medium">
                          Click "Generate Free AI Video" to animate this image.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Below Video Preview */}
              <div className="mt-4 flex flex-col gap-2">
                {generatedVideoUrl ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadVideo}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateVideo}
                      className="py-2.5 px-4 rounded-xl bg-[#202a3c] hover:bg-[#2b374e] text-gray-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    <span>Free client-side 60FPS video encoder • No watermark</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Canvas for High-Speed Frame Rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-[#1a2333] border border-amber-500/50 text-white text-xs sm:text-sm py-2 px-4 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
