import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Search,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ChevronLeft,
  Film,
  Sparkles,
  Clock,
  Eye,
  Calendar,
  AlertCircle,
  Loader2,
  Maximize
} from 'lucide-react';

export interface RealYouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  published: string;
  thumbnail: string;
  description: string;
}

export const DEFAULT_MOVIE_SEARCH_URL =
  'https://www.youtube.com/results?search_query=new+hindi+dubbed+full+movie+hollywood+bollywood+south+all+movie';

export const DEFAULT_MOVIE_SEARCH_QUERY =
  'new hindi dubbed full movie hollywood bollywood south all movie';

export const DEFAULT_FALLBACK_MOVIES: RealYouTubeVideo[] = [
  {
    id: 'tsh7sicm4n0',
    title: 'New South Action SILENT KILLER 2024 Hindi Dubbed Movie Full 4K | Vishnu Vishal, Reba Monica',
    channel: 'RDC Multiplex Official',
    duration: '2:07:12',
    views: '622,801 views',
    published: '2d ago',
    thumbnail: 'https://i.ytimg.com/vi/tsh7sicm4n0/hqdefault.jpg',
    description: 'Catch the blockbuster south action movie Silent Killer 2024 in Hindi Dubbed 4K Ultra HD.',
  },
  {
    id: 'R7aCOI4DuA0',
    title: 'A Aa Hindi Dubbed Full Movie New | Nithiin, Samantha, Anupama Parameshwaran | Trivikram',
    channel: 'Aditya Movies',
    duration: '2:15:30',
    views: '124M views',
    published: 'Super Hit',
    thumbnail: 'https://i.ytimg.com/vi/R7aCOI4DuA0/hqdefault.jpg',
    description: 'Samantha and Nithiin in romantic blockbuster A Aa Hindi Dubbed full movie.',
  },
  {
    id: '0NIKDmyV99Y',
    title: 'BRIGADIER Full Movie Hindi Dubbed | Vijay Deverakonda | Sreeleela | Latest South Indian Action Movie',
    channel: 'Movie Forever',
    duration: '2:18:45',
    views: '32M views',
    published: 'Blockbuster',
    thumbnail: 'https://i.ytimg.com/vi/0NIKDmyV99Y/hqdefault.jpg',
    description: 'Vijay Deverakonda high voltage action thriller Brigadier in full Hindi.',
  },
  {
    id: '2lUcxOl055Q',
    title: 'DJ - Duvvada Jagannadham (4K Ultra HD) | Allu Arjun, Pooja Hegde Action Hindi Dubbed',
    channel: 'Goldmines Dishoom',
    duration: '2:32:45',
    views: '340M views',
    published: 'Mega Blockbuster',
    thumbnail: 'https://i.ytimg.com/vi/2lUcxOl055Q/hqdefault.jpg',
    description: 'Allu Arjun stylish action comedy DJ in Hindi dubbed 4K ultra HD.',
  },
  {
    id: 'ULEQb_l-N08',
    title: 'K.G.F Full Movie Hindi Dubbed | Yash, Srinidhi Shetty, Ananth Nag, Ramachandra Raju',
    channel: 'Goldmines',
    duration: '2:36:10',
    views: '410M views',
    published: 'All Time Blockbuster',
    thumbnail: 'https://i.ytimg.com/vi/ULEQb_l-N08/hqdefault.jpg',
    description: 'Rocking Star Yash in mega sensation KGF Chapter 1 in full Hindi.',
  },
  {
    id: 'hiv5X9KZNXI',
    title: 'Sarrainodu (4K) | Allu Arjun, Rakul Preet Singh, Catherine Tresa Action Blockbuster Full Movie',
    channel: 'Goldmines',
    duration: '2:38:15',
    views: '495M views',
    published: 'Mega Blockbuster',
    thumbnail: 'https://i.ytimg.com/vi/hiv5X9KZNXI/hqdefault.jpg',
    description: 'Blockbuster action film Sarrainodu in Hindi Dubbed 4K Ultra HD.',
  },
  {
    id: 'oqcXT3tkZD0',
    title: 'Macharla Chunaav Kshetra (M.C.K) New Released Full Hindi Dubbed Movie | Nithiin, Krithi Shetty',
    channel: 'Aditya Movies',
    duration: '2:22:10',
    views: '48M views',
    published: 'Trending',
    thumbnail: 'https://i.ytimg.com/vi/oqcXT3tkZD0/hqdefault.jpg',
    description: 'Action thriller Macharla Chunaav Kshetra in Hindi dubbed.',
  },
  {
    id: 'm2cRK2_oaZ0',
    title: 'Vaathi (2023) Hindi Dubbed Full Movie | Starring Dhanush, Samyuktha Menon',
    channel: 'RG Entertainment',
    duration: '2:03:15',
    views: '54M views',
    published: 'Super Hit',
    thumbnail: 'https://i.ytimg.com/vi/m2cRK2_oaZ0/hqdefault.jpg',
    description: 'Dhanush in inspirational action drama Vaathi in Hindi dubbed.',
  },
  {
    id: 'UnlUm6B0djY',
    title: 'New Release South Action ANTONY 2023 Hindi Dubbed Movie 4K | Joju George, Kalyani Priyadarshan',
    channel: 'Ultra 4K Movies',
    duration: '2:08:30',
    views: '28M views',
    published: 'Action Hit',
    thumbnail: 'https://i.ytimg.com/vi/UnlUm6B0djY/hqdefault.jpg',
    description: 'Emotional high octane action movie Antony in Hindi dubbed 4K.',
  },
  {
    id: 'AeZOz-6TIzY',
    title: 'New Release South Action KARTHIKEYA 2 Hindi Dubbed Movie 4K | Nikhil Siddhartha, Anupama',
    channel: 'Ultra 4K Movies',
    duration: '2:12:20',
    views: '110M views',
    published: 'Pan India Hit',
    thumbnail: 'https://i.ytimg.com/vi/AeZOz-6TIzY/hqdefault.jpg',
    description: 'Mystery adventure blockbuster Karthikeya 2 in Hindi dubbed 4K.',
  },
  {
    id: 'ngElkyQ6Rhs',
    title: 'RRR (Hindi) Full Movie 4K Ultra HD | NTR, Ram Charan, Ajay Devgn, Alia Bhatt',
    channel: 'Pen Movies',
    duration: '3:01:40',
    views: '210M views',
    published: 'Oscar Winner',
    thumbnail: 'https://i.ytimg.com/vi/ngElkyQ6Rhs/hqdefault.jpg',
    description: 'SS Rajamouli mega film RRR starring Jr NTR and Ram Charan in full Hindi.',
  },
  {
    id: 'vqu4z34wENw',
    title: 'LEO (Hindi Dubbed) Full Action Movie | Thalapathy Vijay, Sanjay Dutt, Lokesh Kanagaraj',
    channel: 'Seven Screen Studio',
    duration: '2:44:20',
    views: '78M views',
    published: 'Super Hit',
    thumbnail: 'https://i.ytimg.com/vi/vqu4z34wENw/hqdefault.jpg',
    description: 'Thalapathy Vijay high-octane action thriller LEO full movie in Hindi.',
  },
  {
    id: 'Kc5aIIIsmqg',
    title: 'Vijay Sethupathi AAKHRI CHAAL (Action Blockbuster) Hindi Dubbed Full Movie | Arvind Swami',
    channel: 'Action Movies Digiplex',
    duration: '2:10:40',
    views: '18M views',
    published: 'Action Thriller',
    thumbnail: 'https://i.ytimg.com/vi/Kc5aIIIsmqg/hqdefault.jpg',
    description: 'Vijay Sethupathi and Arvind Swami in Aakhri Chaal full Hindi movie.',
  },
  {
    id: 'VDFys9V9poQ',
    title: 'Extra Ordinary Man Hindi Dubbed Full Movie 2025 | Nithiin, Sreeleela, Rajasekhar',
    channel: 'Aditya Movies',
    duration: '2:16:50',
    views: '38M views',
    published: 'Comedy Action',
    thumbnail: 'https://i.ytimg.com/vi/VDFys9V9poQ/hqdefault.jpg',
    description: 'Entertaining comedy action movie Extra Ordinary Man in Hindi dubbed.',
  },
  {
    id: 'vkuiI430d_0',
    title: 'The Super Khiladi 3 (Nenu Sailaja) Hindi Dubbed Full Movie | Ram Pothineni, Keerthy Suresh',
    channel: 'Goldmines',
    duration: '2:14:25',
    views: '280M views',
    published: 'Super Hit',
    thumbnail: 'https://i.ytimg.com/vi/vkuiI430d_0/hqdefault.jpg',
    description: 'Ram Pothineni and Keerthy Suresh in romantic hit The Super Khiladi 3 in Hindi.',
  },
  {
    id: 'Xojf144alBo',
    title: 'Uppena (Hindi) New Released Hindi Dubbed Full Movie | Panja Vaisshnav Tej, Vijay Sethupathi',
    channel: 'Goldmines',
    duration: '2:24:18',
    views: '95M views',
    published: 'Blockbuster',
    thumbnail: 'https://i.ytimg.com/vi/Xojf144alBo/hqdefault.jpg',
    description: 'National award winning blockbuster love story Uppena in Hindi.',
  },
  {
    id: '1odS6ynbWNo',
    title: 'World Famous Lover New Released Hindi Dubbed Movie | Vijay Deverakonda, Raashi Khanna',
    channel: 'Goldmines',
    duration: '2:17:50',
    views: '165M views',
    published: 'Super Hit',
    thumbnail: 'https://i.ytimg.com/vi/1odS6ynbWNo/hqdefault.jpg',
    description: 'Vijay Deverakonda and Raashi Khanna in World Famous Lover Hindi dubbed full movie.',
  },
];

export const QUICK_FILTERS = [
  { label: '🔥 All Movies', query: DEFAULT_MOVIE_SEARCH_QUERY },
  { label: '🎬 Hindi Dubbed', query: 'new hindi dubbed full movie hd' },
  { label: '💥 South Action', query: 'south indian full movie hindi dubbed blockbuster action' },
  { label: '🍿 Hollywood in Hindi', query: 'hollywood movie in hindi dubbed full movie' },
  { label: '🌟 Bollywood Hit', query: 'bollywood full movie hindi romantic comedy drama' },
  { label: '⚡ KGF & Action Hits', query: 'kgf south indian full movie hindi dubbed' },
  { label: '🎭 Hindi Comedy', query: 'hindi comedy full movie hd' }
];

const POPULAR_ACTORS = [
  // Bollywood Stars & Legends
  'Dharmendra', 'Jeetendra', 'Amitabh Bachchan', 'Mithun Chakraborty', 'Mithun',
  'Govinda', 'Sunny Deol', 'Bobby Deol', 'Salman Khan', 'Shah Rukh Khan', 'Shahrukh Khan',
  'Aamir Khan', 'Akshay Kumar', 'Ajay Devgn', 'Ajay Devgan', 'Hrithik Roshan', 'Ranbir Kapoor',
  'Ranveer Singh', 'Shahid Kapoor', 'John Abraham', 'Varun Dhawan', 'Sidharth Malhotra',
  'Tiger Shroff', 'Kartik Aaryan', 'Sunil Shetty', 'Suniel Shetty', 'Sanjay Dutt',
  'Jackie Shroff', 'Anil Kapoor', 'Saif Ali Khan', 'Zeenat Aman', 'Hema Malini', 'Rekha',
  'Sridevi', 'Madhuri Dixit', 'Kajol', 'Rani Mukerji', 'Kareena Kapoor', 'Katrina Kaif',
  'Deepika Padukone', 'Priyanka Chopra', 'Alia Bhatt', 'Shraddha Kapoor',
  // South Superstars (Tollywood, Kollywood, Sandalwood, Mollywood)
  'Allu Arjun', 'Prabhas', 'Mahesh Babu', 'Ram Charan', 'Jr NTR', 'NTR',
  'Vijay Deverakonda', 'Deverakonda', 'Nithiin', 'Ram Pothineni', 'Ravi Teja', 'Nani',
  'Naga Chaitanya', 'Kalyan Ram', 'Pawan Kalyan', 'Chiranjeevi', 'Balakrishna',
  'Nagarjuna', 'Venkatesh', 'Thalapathy Vijay', 'Vijay', 'Ajith Kumar', 'Ajith',
  'Suriya', 'Vikram', 'Dhanush', 'Sivakarthikeyan', 'Karthi', 'Vijay Sethupathi',
  'Silambarasan', 'Simbu', 'Arya', 'Jayam Ravi', 'Rajinikanth', 'Kamal Haasan',
  'Yash', 'Rishab Shetty', 'Rakshit Shetty', 'Kiccha Sudeep', 'Sudeep', 'Darshan',
  'Puneeth Rajkumar', 'Shiva Rajkumar', 'Upendra', 'Dulquer Salmaan', 'Fahadh Faasil',
  'Tovino Thomas', 'Prithviraj', 'Mammootty', 'Mohanlal', 'Joju George', 'Vishnu Vishal',
  'Bellamkonda Sreenivas', 'Nikhil Siddhartha', 'Panja Vaisshnav Tej', 'Sai Dharam Tej',
  // Hollywood Stars (in Hindi Dubbed)
  'Tom Cruise', 'Dwayne Johnson', 'The Rock', 'Vin Diesel', 'Jason Statham', 'Keanu Reeves',
  'Will Smith', 'Brad Pitt', 'Leonardo DiCaprio', 'Chris Hemsworth', 'Chris Evans',
  'Robert Downey Jr', 'Ryan Reynolds', 'Sylvester Stallone', 'Arnold Schwarzenegger',
  'Jackie Chan', 'Bruce Lee', 'Johnny Depp'
];

function extractActorFromTitle(title: string): string | null {
  if (!title) return null;
  for (const actor of POPULAR_ACTORS) {
    const regex = new RegExp('\\b' + actor + '\\b', 'i');
    if (regex.test(title)) {
      return actor;
    }
  }
  const match = title.match(/(?:Starring|featuring|[|\-–—])\s*([A-Za-z ]{3,22})/i);
  if (match) {
    const candidate = match[1].trim();
    if (candidate.length >= 3 && !/full movie|hindi dubbed|action|blockbuster|superhit|4k|ultra hd|movie|hd/i.test(candidate)) {
      return candidate;
    }
  }
  return null;
}

function extractBaseMovieTitle(title: string): string {
  if (!title) return '';
  let base = title.split(/[{([|\-–—:]/)[0].trim();
  base = base.replace(/new release|new movie|hindi dubbed|dubbed movie|full movie|hd movie|4k|ultra hd|superhit|blockbuster|south action|movie/gi, '').trim();
  return base.toLowerCase();
}

interface YouTubeMovieSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSubscription?: () => void;
}

export const YouTubeMovieSection: React.FC<YouTubeMovieSectionProps> = ({
  isOpen,
  onClose,
  onNavigateToSubscription,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>(DEFAULT_MOVIE_SEARCH_QUERY);
  const [videos, setVideos] = useState<RealYouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Live Typing & Infinite Scroll State
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [continuationToken, setContinuationToken] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [clientVersion, setClientVersion] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Selected video for the dedicated Player view (when clicked, player opens in this separate section)
  const [selectedVideo, setSelectedVideo] = useState<RealYouTubeVideo | null>(null);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isAutoNext, setIsAutoNext] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  const handleScreenTap = () => {
    if (showControls) {
      setShowControls(false);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    } else {
      resetControlsTimer();
    }
  };

  const togglePlayPause = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const next = !isVideoPlaying;
    setIsVideoPlaying(next);
    const iframe = document.getElementById('youtube-player-frame') as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: next ? 'playVideo' : 'pauseVideo',
          args: []
        }),
        '*'
      );
    }
    resetControlsTimer();
  };

  const handlePlayNextVideo = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!selectedVideo || videos.length === 0) return;
    const currentIndex = videos.findIndex((v) => v.id === selectedVideo.id);
    const nextIndex = (currentIndex + 1) % videos.length;
    setSelectedVideo(videos[nextIndex]);
    setIsVideoPlaying(true);
    resetControlsTimer();
  };

  // Auto-hide controls timer and listen for YouTube embed player events (ended / play / pause)
  useEffect(() => {
    if (selectedVideo) {
      setIsVideoPlaying(true);
      resetControlsTimer();
    }
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [selectedVideo]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'onStateChange') {
          // 1 = playing, 2 = paused, 0 = ended
          if (data.info === 1) {
            setIsVideoPlaying(true);
          } else if (data.info === 2) {
            setIsVideoPlaying(false);
          } else if (data.info === 0) {
            setIsVideoPlaying(false);
            if (isAutoNext) {
              handlePlayNextVideo();
            }
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isAutoNext, selectedVideo, videos]);

  // Synchronize Fullscreen state with Device Orientation and YouTube Embed events
  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = document.fullscreenElement || (document as any).webkitFullscreenElement;
      const isFs = Boolean(fsEl);
      setIsPlayerFullscreen(isFs);
      if (isFs) {
        const box = document.getElementById('cinema-player-box');
        if (box && fsEl && fsEl !== box) {
          try {
            if (box.requestFullscreen) {
              box.requestFullscreen().catch(() => {});
            } else if ((box as any).webkitRequestFullscreen) {
              (box as any).webkitRequestFullscreen();
            }
          } catch {}
        }
        if ((window as any).AndroidStartApp?.setVideoFullscreen) {
          (window as any).AndroidStartApp.setVideoFullscreen(true);
        } else if ((window as any).Android?.setVideoFullscreen) {
          (window as any).Android.setVideoFullscreen(true);
        } else if ((window as any).AndroidStartApp?.requestLandscapeFullscreen) {
          (window as any).AndroidStartApp.requestLandscapeFullscreen();
        } else if ((window as any).Android?.requestLandscapeFullscreen) {
          (window as any).Android.requestLandscapeFullscreen();
        }
      } else {
        if ((window as any).AndroidStartApp?.setVideoFullscreen) {
          (window as any).AndroidStartApp.setVideoFullscreen(false);
        } else if ((window as any).Android?.setVideoFullscreen) {
          (window as any).Android.setVideoFullscreen(false);
        } else if ((window as any).AndroidStartApp?.requestPortraitOrientation) {
          (window as any).AndroidStartApp.requestPortraitOrientation();
        } else if ((window as any).Android?.requestPortraitOrientation) {
          (window as any).Android.requestPortraitOrientation();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const togglePlayerFullscreen = () => {
    const box = document.getElementById('cinema-player-box');
    const isCurrentlyFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement || isPlayerFullscreen);

    if (!isCurrentlyFs) {
      setIsPlayerFullscreen(true);
      if (box) {
        if (box.requestFullscreen) {
          box.requestFullscreen().catch(() => {});
        } else if ((box as any).webkitRequestFullscreen) {
          (box as any).webkitRequestFullscreen();
        }
      }
      if ((window as any).AndroidStartApp?.setVideoFullscreen) {
        (window as any).AndroidStartApp.setVideoFullscreen(true);
      } else if ((window as any).Android?.setVideoFullscreen) {
        (window as any).Android.setVideoFullscreen(true);
      } else if ((window as any).AndroidStartApp?.requestLandscapeFullscreen) {
        (window as any).AndroidStartApp.requestLandscapeFullscreen();
      } else if ((window as any).Android?.requestLandscapeFullscreen) {
        (window as any).Android.requestLandscapeFullscreen();
      }
    } else {
      setIsPlayerFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitFullscreenElement && (document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      if ((window as any).AndroidStartApp?.setVideoFullscreen) {
        (window as any).AndroidStartApp.setVideoFullscreen(false);
      } else if ((window as any).Android?.setVideoFullscreen) {
        (window as any).Android.setVideoFullscreen(false);
      } else if ((window as any).AndroidStartApp?.requestPortraitOrientation) {
        (window as any).AndroidStartApp.requestPortraitOrientation();
      } else if ((window as any).Android?.requestPortraitOrientation) {
        (window as any).Android.requestPortraitOrientation();
      }
    }
  };

  // Subscription Alert Modal & Verification State (matching sub.jpg)
  const [showSubAlert, setShowSubAlert] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Check subscription status from Firebase Realtime Database
  useEffect(() => {
    const checkSub = async () => {
      try {
        const deviceId = typeof window !== 'undefined' ? localStorage.getItem('device_id') : null;
        if (!deviceId) return;
        const res = await fetch('https://myapps-4a8eb-default-rtdb.firebaseio.com/subscriptions.json');
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;
        const now = Date.now();
        for (const k in data) {
          const item = data[k];
          if (item && item.device_id === deviceId && now < item.expireAt) {
            setIsSubscribed(true);
            break;
          }
        }
      } catch {}
    };
    checkSub();
  }, []);

  // Dedicated Actor/Channel Recommendations State
  const [recommendedVideos, setRecommendedVideos] = useState<RealYouTubeVideo[]>([]);
  const [recTitle, setRecTitle] = useState<string>('More Movies');
  const [recLoading, setRecLoading] = useState<boolean>(false);

  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  // Whenever selectedVideo changes, guarantee scroll position is instantly reset to the very top
  useEffect(() => {
    if (selectedVideo) {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
      playerContainerRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [selectedVideo]);

  // Fetch smart actor or channel recommendations (excluding duplicate uploads of same movie)
  useEffect(() => {
    if (!selectedVideo) return;

    const actor = extractActorFromTitle(selectedVideo.title);
    const baseName = extractBaseMovieTitle(selectedVideo.title);
    const channel = (selectedVideo.channel || '').trim();

    let targetQuery = '';
    if (actor) {
      targetQuery = `${actor} blockbuster hindi dubbed full movie`;
      setRecTitle(`More Movies starring ${actor}`);
    } else if (channel) {
      targetQuery = `${channel} full movie hindi`;
      setRecTitle(`More Movies from ${channel}`);
    } else {
      targetQuery = 'new hindi dubbed full movie';
      setRecTitle('More Blockbuster Movies');
    }

    setRecLoading(true);

    const runFetch = async () => {
      let results: RealYouTubeVideo[] = [];
      try {
        const res = await fetch(`/api/youtube/search?query=${encodeURIComponent(targetQuery)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.videos)) {
          results = data.videos;
        }
      } catch {}

      if (results.length < 3 && channel) {
        setRecTitle(`More Movies from ${channel}`);
        try {
          const res = await fetch(`/api/youtube/search?query=${encodeURIComponent(channel + ' full movie hindi')}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
            results = data.videos;
          }
        } catch {}
      }

      // Filter out:
      // 1. Current video by ID
      // 2. Any duplicate upload of the SAME movie
      let filtered = results.filter((v) => {
        if (v.id === selectedVideo.id) return false;
        if (baseName && baseName.length >= 3) {
          if (v.title.toLowerCase().includes(baseName)) return false;
        }
        return true;
      });

      // Backfill from general feed if needed (still excluding baseName duplicates)
      if (filtered.length < 4 && videos.length > 0) {
        const seen = new Set(filtered.map((f) => f.id));
        seen.add(selectedVideo.id);
        for (const v of videos) {
          if (!seen.has(v.id)) {
            if (baseName && baseName.length >= 3 && v.title.toLowerCase().includes(baseName)) {
              continue;
            }
            seen.add(v.id);
            filtered.push(v);
            if (filtered.length >= 10) break;
          }
        }
      }

      setRecommendedVideos(filtered);
      setRecLoading(false);
    };

    runFetch();
  }, [selectedVideo]);

  // Internal Auto Next Video listener: detects when current video finishes and advances automatically
  useEffect(() => {
    if (!selectedVideo || videos.length <= 1) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (!data || typeof data !== 'object') return;

        const isEnded =
          (data.event === 'onStateChange' && data.info === 0) ||
          (data.event === 'infoDelivery' && data.info && data.info.playerState === 0) ||
          (data.info && data.info.playerState === 0);

        if (isEnded) {
          const currentIndex = videos.findIndex((v) => v.id === selectedVideo.id);
          const nextIndex = (currentIndex + 1) % videos.length;
          setSelectedVideo(videos[nextIndex]);
          if (mainScrollRef.current) {
            mainScrollRef.current.scrollTop = 0;
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [selectedVideo, videos]);

  // Fetch real YouTube videos from server proxy
  const loadVideos = async (queryToSearch: string) => {
    setIsLoading(true);
    setFetchError(null);
    setContinuationToken(null);

    try {
      const res = await fetch(`/api/youtube/search?query=${encodeURIComponent(queryToSearch)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
        setVideos(data.videos);
        setActiveQuery(queryToSearch);
        setContinuationToken(data.continuationToken || null);
        setApiKey(data.apiKey || null);
        setClientVersion(data.clientVersion || null);
        setHasMore(Boolean(data.continuationToken));
      } else {
        // Fallback to rich curated movies if server returns empty
        const qClean = queryToSearch.toLowerCase();
        const words = qClean.split(/\s+/).filter((w) => w.length > 2);
        const matched = DEFAULT_FALLBACK_MOVIES.filter((m) => {
          const t = (m.title + ' ' + m.channel).toLowerCase();
          return words.length === 0 || words.some((w) => t.includes(w));
        });
        setVideos(matched.length > 0 ? matched : DEFAULT_FALLBACK_MOVIES);
        setActiveQuery(queryToSearch);
        setHasMore(false);
      }
    } catch (err: any) {
      console.warn('Network issue fetching YouTube search, using fallback:', err);
      const qClean = queryToSearch.toLowerCase();
      const words = qClean.split(/\s+/).filter((w) => w.length > 2);
      const matched = DEFAULT_FALLBACK_MOVIES.filter((m) => {
        const t = (m.title + ' ' + m.channel).toLowerCase();
        return words.length === 0 || words.some((w) => t.includes(w));
      });
      setVideos(matched.length > 0 ? matched : DEFAULT_FALLBACK_MOVIES);
      setActiveQuery(queryToSearch);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Load more videos automatically as user scrolls down (Infinite Scroll)
  const loadMoreVideos = async () => {
    if (isLoadingMore || !continuationToken || !hasMore || selectedVideo) return;
    setIsLoadingMore(true);

    try {
      const params = new URLSearchParams({ token: continuationToken });
      if (apiKey) params.append('apiKey', apiKey);
      if (clientVersion) params.append('clientVersion', clientVersion);

      const res = await fetch(`/api/youtube/more?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
        setVideos((prev) => {
          const seen = new Set(prev.map((v) => v.id));
          const uniqueNew = data.videos.filter((v: RealYouTubeVideo) => !seen.has(v.id));
          return [...prev, ...uniqueNew];
        });
        setContinuationToken(data.nextToken || null);
        setHasMore(Boolean(data.nextToken));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more movies:', err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Whenever modal opens, load initial default movies while keeping search bar input clean (value="")
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedVideo(null);
      loadVideos(DEFAULT_MOVIE_SEARCH_QUERY);
    }
  }, [isOpen]);

  // LIVE SEARCH: Auto-fetch as user types with a responsive 350ms debounce
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = searchQuery.trim();
    const targetQuery = trimmed || DEFAULT_MOVIE_SEARCH_QUERY;

    if (targetQuery !== activeQuery) {
      setIsTyping(Boolean(trimmed));
    }

    const timer = setTimeout(() => {
      if (targetQuery !== activeQuery) {
        loadVideos(targetQuery);
      } else {
        setIsTyping(false);
      }
    }, 380);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, activeQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim() || DEFAULT_MOVIE_SEARCH_QUERY;
    loadVideos(query);
    setSelectedVideo(null);
  };

  const handleResetToDefault = () => {
    setSearchQuery('');
    setSelectedVideo(null);
    loadVideos(DEFAULT_MOVIE_SEARCH_QUERY);
  };

  const handleSelectVideo = (video: RealYouTubeVideo) => {
    if (isSubscribed) {
      setSelectedVideo(video);
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
    } else {
      setShowSubAlert(true);
    }
  };

  const handleSubscribeNow = () => {
    setShowSubAlert(false);
    if (onNavigateToSubscription) {
      onNavigateToSubscription();
      return;
    }
    if (typeof window !== 'undefined') {
      const anyWin = window as any;
      if (anyWin.openSubscriptionPage && typeof anyWin.openSubscriptionPage === 'function') {
        anyWin.openSubscriptionPage();
      } else if (anyWin.AndroidStartApp && typeof anyWin.AndroidStartApp.openSubscriptionPage === 'function') {
        anyWin.AndroidStartApp.openSubscriptionPage();
      } else if (anyWin.Android && typeof anyWin.Android.openSubscriptionPage === 'function') {
        anyWin.Android.openSubscriptionPage();
      } else {
        onClose();
      }
    }
  };

  const handleBackToPosts = () => {
    setSelectedVideo(null);
  };

  // Infinite Scroll Handler: checks when user reaches within 500px of bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (selectedVideo || isLoading || isLoadingMore || !hasMore || !continuationToken) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      loadMoreVideos();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="youtube-movie-section-modal"
      className="fixed inset-0 z-[100000] bg-[#0f0f0f] text-slate-100 flex flex-col overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Application Header (Clean Full-Width Live Search) */}
      <header className="h-14 sm:h-16 bg-[#0f0f0f] border-b border-[#272727] flex items-center gap-2 sm:gap-4 px-3 sm:px-6 shrink-0 z-30 shadow-md">
        {/* Left: Close / Back to App Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#222222] hover:bg-[#333333] active:scale-95 text-slate-200 hover:text-white rounded-full text-xs sm:text-sm font-semibold border border-[#383838] transition-all cursor-pointer shrink-0 shadow-xs"
          title="Back to Movie WebView App"
        >
          <X className="w-4 h-4 text-red-500" />
          <span className="hidden sm:inline">Close</span>
        </button>

        {/* Center/Full-Width: Large Live Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 w-full relative flex items-center"
        >
          <div className="w-full h-10 sm:h-11 flex items-center bg-[#141414] hover:bg-[#181818] border border-[#303030] focus-within:border-red-500 focus-within:bg-[#161616] focus-within:shadow-[0_0_15px_rgba(239,68,68,0.2)] rounded-full overflow-hidden shadow-inner pl-4 pr-1.5 transition-all">
            {isTyping || isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mr-2.5 shrink-0 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2.5 shrink-0 pointer-events-none" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search YouTube full movies... Live search as you type"
              className="w-full bg-transparent py-2 text-xs sm:text-sm md:text-base text-white placeholder-slate-400 outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white text-base sm:text-lg px-2.5 py-1 cursor-pointer font-bold transition-colors"
                title="Clear Search"
              >
                ×
              </button>
            )}
            <button
              type="submit"
              className="px-4 sm:px-6 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-full transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              Search
            </button>
          </div>
        </form>
      </header>

      {/* Subheader: Real-Time Live Search System & Instant Filter Bar */}
      <div className="bg-[#181818] border-b border-[#282828] px-3 sm:px-6 py-2 flex items-center justify-between gap-3 shrink-0 overflow-x-auto no-scrollbar">
        {/* Left: Live search status indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${
                isTyping || isLoading ? 'animate-ping' : 'animate-pulse'
              }`}
            />
            {isTyping ? 'Live Typing...' : isLoading ? 'Searching...' : 'Live Search Active'}
          </span>

          <span className="text-slate-300 text-xs font-medium hidden md:inline">
            {isLoading
              ? 'Loading live YouTube movie results...'
              : `${videos.length} Movies Loaded • Scroll down for infinite posts`}
          </span>
        </div>

        {/* Right: Quick live filter chips */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-0.5">
          {QUICK_FILTERS.map((filter) => {
            const isSelected = searchQuery.trim().toLowerCase() === filter.query.toLowerCase();
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => {
                  setSelectedVideo(null);
                  setSearchQuery(filter.query);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 shadow-sm'
                    : 'bg-[#222222] hover:bg-[#2e2e2e] text-slate-300 hover:text-white border-[#383838]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body View with Infinite Scroll */}
      <div
        ref={mainScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-[#0f0f0f]"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: DEDICATED PLAYER VIEW (Opens when user clicks on any post)     */}
        {/* ========================================================================= */}
        {selectedVideo ? (
          <div ref={playerContainerRef} className="w-full flex flex-col bg-[#0f0f0f] animate-in fade-in duration-200">
            {/* Player Control Bar: Back button + Fullscreen + Open in YouTube button */}
            <div className="bg-[#181818] border-b border-[#282828] px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-md">
              <button
                type="button"
                onClick={handleBackToPosts}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-[#252525] hover:bg-[#333333] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-full border border-[#3a3a3a] transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 text-red-500" />
                <span>← Back to All Movies</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlayerFullscreen}
                  className="flex items-center justify-center p-2 bg-[#1e293b] hover:bg-[#334155] active:scale-95 text-sky-400 font-bold rounded-full border border-sky-500/30 transition-all cursor-pointer shadow-sm"
                  title={isPlayerFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cinema Video Player Container */}
            <div className={`max-w-5xl mx-auto w-full flex flex-col gap-4 ${isPlayerFullscreen ? 'p-0 m-0' : 'px-2 sm:px-6 pt-3 pb-6'}`}>
              {/* Fullscreen Responsive Cinema Player Box */}
              <div
                id="cinema-player-box"
                className={
                  isPlayerFullscreen
                    ? "fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen h-[100dvh] z-[9999999] bg-black m-0 p-0 overflow-hidden flex items-center justify-center"
                    : "w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-[#272727] relative group select-none flex items-center justify-center"
                }
              >
                {/* Cinema Stage - Fills container perfectly with zero shift */}
                <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
                {/* Official YouTube Embed with fs=0 to remove YouTube's native fullscreen button */}
                <iframe
                  key={selectedVideo.id}
                  id="youtube-player-frame"
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&playsinline=1&rel=0&enablejsapi=1&fs=0&origin=${encodeURIComponent(typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'https://hdskay.blogspot.com')}&widget_referrer=${encodeURIComponent(typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'https://hdskay.blogspot.com')}`}
                  title={selectedVideo.title}
                  className="w-full h-full absolute inset-0 m-auto border-none block"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={(e) => {
                    try {
                      (e.target as HTMLIFrameElement)?.contentWindow?.postMessage(
                        JSON.stringify({ event: 'listening' }),
                        '*'
                      );
                    } catch {}
                  }}
                />

                {/* UNTOUCH SHIELD 1: TOP-LEFT AREA (Avatar, Title, Channel Name, Speaker Icon) */}
                <div
                  className="absolute top-0 left-0 w-[calc(100%-92px)] sm:w-[calc(100%-105px)] [&:fullscreen]:w-[calc(100%-130px)] [&:-webkit-full-screen]:w-[calc(100%-130px)] h-[50px] sm:h-[56px] [&:fullscreen]:h-[58px] [&:-webkit-full-screen]:h-[58px] z-30 [&:fullscreen]:z-[999999] [&:-webkit-full-screen]:z-[999999] pointer-events-auto cursor-default select-none bg-transparent"
                  title="Untouch Protected Area"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                />

                {/* Interactive Touch Area: Tapping video screen brings up the bottom controls (auto-hides after 5s) */}
                <div
                  className="absolute inset-0 z-20 cursor-pointer"
                  onClick={handleScreenTap}
                  onTouchStart={resetControlsTimer}
                  onMouseMove={resetControlsTimer}
                />

                {/* SLIDE-UP BOTTOM CONTROL LAYOUT: Play/Pause, Auto Next, and Landscape Fullscreen button */}
                <div
                  className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-out transform ${
                    showControls
                      ? 'translate-y-0 opacity-100 pointer-events-auto'
                      : 'translate-y-full opacity-0 pointer-events-none'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    resetControlsTimer();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    resetControlsTimer();
                  }}
                >
                  <div className="bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-8 pb-3 px-3 sm:px-6 flex items-center justify-between gap-2 backdrop-blur-xs select-none">
                    {/* Left: Play/Pause + Next Video */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={togglePlayPause}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-full shadow-lg transition-all cursor-pointer border border-red-500/50"
                        title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {isVideoPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-white" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Play</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handlePlayNextVideo}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#333333] active:scale-95 text-slate-200 hover:text-white font-semibold text-xs rounded-full border border-[#3d3d3d] transition-all cursor-pointer shadow-sm"
                        title="Play Next Movie"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Next</span>
                      </button>
                    </div>

                    {/* Center: Auto Next Toggle Button */}
                    <div className="flex items-center shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAutoNext(!isAutoNext);
                          resetControlsTimer();
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer border shadow-sm whitespace-nowrap shrink-0 ${
                          isAutoNext
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400/50'
                            : 'bg-[#252525] hover:bg-[#333333] text-slate-400 border-[#3d3d3d]'
                        }`}
                        title="Toggle Auto Next Movie"
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isAutoNext ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                        <span className="whitespace-nowrap">Auto Next: {isAutoNext ? 'ON' : 'OFF'}</span>
                      </button>
                    </div>

                    {/* Right: Fullscreen icon only (without Landscape text) */}
                    <div className="flex items-center shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayerFullscreen();
                        }}
                        className="flex items-center justify-center p-2 sm:px-2.5 sm:py-2 bg-[#1e293b] hover:bg-[#334155] active:scale-95 text-sky-400 font-bold rounded-full border border-sky-500/30 transition-all cursor-pointer shadow-sm shrink-0"
                        title={isPlayerFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-maximize w-4 h-4"
                          aria-hidden="true"
                        >
                          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Exit Button during Fullscreen Mode */}
                {isPlayerFullscreen && (
                  <button
                    type="button"
                    onClick={togglePlayerFullscreen}
                    className="absolute top-4 right-4 z-50 bg-black/85 hover:bg-black text-white border border-white/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl transition-all cursor-pointer text-xs font-semibold backdrop-blur-md"
                    title="Exit Fullscreen / Return to Portrait"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                    <span>Portrait</span>
                  </button>
                )}
                </div>
              </div>

              {/* Video Title & Channel Meta Info */}
              <div className="bg-[#181818] border border-[#272727] rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-lg">
                <h1 className="text-base sm:text-xl font-bold text-white leading-snug">
                  {selectedVideo.title}
                </h1>

                {/* Channel & Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2a2a2a]">
                  <div className="flex items-center gap-3">
                    {/* Channel Avatar Pill */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                      {selectedVideo.channel.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">
                        {selectedVideo.channel}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Official YouTube Video Channel
                      </span>
                    </div>
                  </div>

                  {/* Views & Duration Pills */}
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    {selectedVideo.duration && (
                      <span className="px-2.5 py-1 bg-[#252525] rounded-lg font-mono text-[11px] border border-[#333333] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {selectedVideo.duration}
                      </span>
                    )}
                    {selectedVideo.views && (
                      <span className="px-2.5 py-1 bg-[#252525] rounded-lg text-[11px] border border-[#333333] flex items-center gap-1">
                        <Eye className="w-3 h-3 text-sky-400" />
                        {selectedVideo.views}
                      </span>
                    )}
                    {selectedVideo.published && (
                      <span className="px-2.5 py-1 bg-[#252525] rounded-lg text-[11px] border border-[#333333] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        {selectedVideo.published}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Up Next / More Movies from Search */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center justify-between border-b border-[#272727] pb-2">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-red-500" />
                    <h2 className="text-sm font-bold text-white">
                      {recTitle}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">Click any movie to play next</span>
                </div>

                {recLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-3 bg-[#181818] p-2 rounded-xl border border-[#272727] animate-pulse">
                        <div className="w-36 aspect-video bg-[#262626] rounded-lg shrink-0"></div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="h-3.5 bg-[#262626] rounded w-5/6"></div>
                          <div className="h-2.5 bg-[#262626] rounded w-1/2"></div>
                          <div className="h-2 bg-[#262626] rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {(recommendedVideos.length > 0 ? recommendedVideos : videos.filter((v) => v.id !== selectedVideo.id))
                      .slice(0, 9)
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectVideo(item)}
                          className="flex gap-3 bg-[#181818] hover:bg-[#222222] border border-[#272727] hover:border-[#383838] p-2 rounded-xl cursor-pointer transition-all group"
                        >
                        <div className="relative w-36 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {item.duration && (
                            <span className="absolute bottom-1 right-1 bg-black/85 text-white font-mono text-[9px] px-1 py-0.2 rounded">
                              {item.duration}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Play className="w-6 h-6 fill-white text-white" />
                          </div>
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0 pr-1">
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                            {item.title}
                          </h4>
                          <div className="text-[10px] text-slate-400 truncate">
                            {item.channel}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {item.views} {item.published ? `• ${item.published}` : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* SECTION 2: REAL YOUTUBE POSTS FEED (Home list of real YouTube videos)     */
          /* ========================================================================= */
          <div className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 flex flex-col gap-4">
            {/* Header info row */}
            <div className="flex items-center justify-between border-b border-[#272727] pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-red-500" />
                  <span>Unlimited Movie</span>
                </h2>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex flex-col gap-2.5 animate-pulse">
                    <div className="w-full aspect-video bg-[#222222] rounded-xl" />
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#272727] shrink-0" />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="w-3/4 h-3.5 bg-[#272727] rounded" />
                        <div className="w-1/2 h-3 bg-[#222222] rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && fetchError && (
              <div className="bg-[#1a1414] border border-red-900/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center my-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                  Unable to load YouTube search results
                </h3>
                <p className="text-xs text-slate-400 max-w-md mb-4">{fetchError}</p>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {/* Real Video Posts Grid (YouTube standard feed) */}
            {!isLoading && !fetchError && videos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className="flex flex-col gap-2.5 group cursor-pointer bg-[#141414] hover:bg-[#1a1a1a] p-2 sm:p-2.5 rounded-2xl border border-transparent hover:border-[#2e2e2e] transition-all duration-200"
                  >
                    {/* 16:9 Thumbnail with Duration Badge */}
                    <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-md">
                      <img
                        src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.dataset.triedMq) {
                            target.dataset.triedMq = '1';
                            target.src = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
                          } else if (!target.dataset.triedDefault) {
                            target.dataset.triedDefault = '1';
                            target.src = `https://i.ytimg.com/vi/${video.id}/default.jpg`;
                          }
                        }}
                      />

                      {/* YouTube Style Duration Pill on bottom-right */}
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-xs text-white text-[11px] font-mono px-1.5 py-0.5 rounded font-bold border border-white/10">
                          {video.duration}
                        </span>
                      )}

                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center pl-0.5 shadow-2xl scale-95 group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white" />
                        </div>
                      </div>
                    </div>

                    {/* Video Details: Channel Avatar + Title + Views */}
                    <div className="flex gap-3 px-1">
                      {/* Channel avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shrink-0 mt-0.5">
                        {video.channel.slice(0, 1).toUpperCase()}
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        {/* Title (bold, 2-line clamp like YouTube) */}
                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                          {video.title}
                        </h3>

                        {/* Channel Name */}
                        <div className="text-[11px] text-slate-400 truncate mt-1">
                          {video.channel}
                        </div>

                        {/* Views & Published Time */}
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          {video.views && <span>{video.views}</span>}
                          {video.views && video.published && <span>•</span>}
                          {video.published && <span>{video.published}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading More Spinner on Scroll */}
                {isLoadingMore && (
                  <div className="col-span-full py-8 flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-slate-300">
                      Loading more movies as you scroll... ({videos.length} loaded)
                    </span>
                  </div>
                )}

                {/* Scroll Down Hint when more movies are available */}
                {!isLoading && !isLoadingMore && hasMore && (
                  <div className="col-span-full py-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Scroll down to automatically load more movies</span>
                  </div>
                )}

                {/* End of results message */}
                {!isLoading && !isLoadingMore && !hasMore && videos.length > 0 && (
                  <div className="col-span-full py-6 text-center text-xs text-slate-500">
                    All {videos.length} movies loaded for this search.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subscription Alert Modal (Exact replica of sub.jpg) */}
      {showSubAlert && (
        <div
          className="fixed inset-0 z-[100010] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowSubAlert(false)}
        >
          <div
            className="bg-[#12141a] border border-[#232733] rounded-[22px] max-w-[320px] w-full p-6 sm:p-7 text-center shadow-2xl shadow-black/90 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red/Crimson Squircle Badge with Question Mark */}
            <div className="w-[58px] h-[58px] bg-[#e11d48] rounded-[17px] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#e11d48]/40">
              <span className="text-white text-3xl font-black font-sans leading-none">?</span>
            </div>

            {/* Title */}
            <h3 className="text-white text-xl sm:text-[21px] font-bold mb-2 tracking-tight">
              Subscription Alert!
            </h3>

            {/* Description */}
            <p className="text-slate-400 text-[13.5px] leading-relaxed mb-6 px-1">
              Please subscribe a plan to view our paid items
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowSubAlert(false)}
                className="flex-1 py-3 px-3 bg-[#20242e] hover:bg-[#2a313e] active:scale-95 text-white font-semibold text-sm rounded-[11px] transition-all cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubscribeNow}
                className="flex-1 py-3 px-3 bg-[#e11d48] hover:bg-[#be123c] active:scale-95 text-white font-bold text-sm rounded-[11px] shadow-lg shadow-[#e11d48]/35 transition-all cursor-pointer border-none whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
