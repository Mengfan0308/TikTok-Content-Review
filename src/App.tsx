import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Music, 
  X, 
  Settings, 
  Share, 
  MonitorPlay, 
  Copy, 
  Sticker, 
  Sparkles, 
  Aperture, 
  Mic, 
  Subtitles, 
  ChevronDown,
  ChevronUp,
  Eye,
  Volume2,
  FileText,
  CheckCircle2,
  Loader2,
  Trash2,
  Archive,
  Send,
  MapPin,
  Info,
  PlusSquare,
  Globe,
  Inbox,
  ArrowUpCircle,
  Plus,
  Lightbulb,
  Wand2,
  Maximize2,
  ChevronRight,
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Disc,
  User,
  Users,
  Home,
  Link,
  MessageSquare,
  Instagram,
  Mail,
  ArrowRight,
  Check,
  Edit2,
  AlertCircle,
  Type,
  Video,
  Play,
  Pause
} from 'lucide-react';
export default function App() {
  type ReviewOutcome = 'safe' | 'risk';
  type ContentType = 'single' | 'multi' | 'video';
  type ReviewCheckKey = 'visual' | 'audio' | 'text';
  type TimelineTrack = 'video' | 'music' | 'text' | null;
  type TimelineSnapshot = { track: TimelineTrack; step: number };
  type ActiveRiskHint = 'text' | 'music' | null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showReviewUI, setShowReviewUI] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [showBackMenu, setShowBackMenu] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewOutcome | null>(null);
  const [showRiskPopup, setShowRiskPopup] = useState(false);
  const [fixStep, setFixStep] = useState(0);
  const [isAllFixed, setIsAllFixed] = useState(false);
  const [showPublishWarning, setShowPublishWarning] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<ReviewOutcome | null>(null);
  const [reviewChecks, setReviewChecks] = useState<Record<ReviewCheckKey, boolean>>({
    visual: true,
    audio: true,
    text: true,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fixThumbnailOffsetX, setFixThumbnailOffsetX] = useState(0);
  const [editorThumbnailOffsetX, setEditorThumbnailOffsetX] = useState(0);
  const [isEditorVideoPlaying, setIsEditorVideoPlaying] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fixTimelineDuration, setFixTimelineDuration] = useState(3);
  const [selectedTimelineTrack, setSelectedTimelineTrack] = useState<TimelineTrack>(null);
  const [videoTrackFrames, setVideoTrackFrames] = useState<string[]>([]);
  const [videoFrameAspectRatio, setVideoFrameAspectRatio] = useState(16 / 9);
  const [musicWavePath, setMusicWavePath] = useState('');
  const [timelineHistory, setTimelineHistory] = useState<TimelineSnapshot[]>([]);
  const [timelineHistoryIndex, setTimelineHistoryIndex] = useState(-1);
  const [activeRiskHint, setActiveRiskHint] = useState<ActiveRiskHint>(null);
  const [hasTextRisk, setHasTextRisk] = useState(true);
  const [hasMusicRisk, setHasMusicRisk] = useState(true);
  const [isReplacingVideo, setIsReplacingVideo] = useState(false);
  const [fixedRiskVideo, setFixedRiskVideo] = useState<string | null>(null);
  const [manualTimelineShiftPx, setManualTimelineShiftPx] = useState(0);
  const [pendingFixSeekTime, setPendingFixSeekTime] = useState<number | null>(null);
  const [focusedTextSwitchTime, setFocusedTextSwitchTime] = useState(0);
  const [timelineAnimationCycle, setTimelineAnimationCycle] = useState(0);
  const [shouldStartFromSwitchPoint, setShouldStartFromSwitchPoint] = useState(false);
  const currentImageIndexRef = React.useRef(0);
  const editorVideoRef = React.useRef<HTMLVideoElement>(null);
  const fixVideoRef = React.useRef<HTMLVideoElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const fixScrollContainerRef = React.useRef<HTMLDivElement>(null);
  const fixThumbnailViewportRef = React.useRef<HTMLDivElement>(null);
  const fixThumbnailTrackRef = React.useRef<HTMLDivElement>(null);
  const editorThumbnailViewportRef = React.useRef<HTMLDivElement>(null);
  const editorThumbnailTrackRef = React.useRef<HTMLDivElement>(null);
  const timelineViewportRef = React.useRef<HTMLDivElement>(null);

  const reviewItems: Array<{ key: ReviewCheckKey; label: string; desc: string; statusText: string }> = [
    { key: 'visual', label: '视觉内容', desc: '检测画面中的违规元素', statusText: '视觉画面分析中...' },
    { key: 'audio', label: '音频轨道', desc: '识别版权限制与违规声音', statusText: '音频轨道检测中...' },
    { key: 'text', label: '文字内容', desc: '扫描字幕与文案中的敏感词', statusText: '文本字幕审核中...' },
  ];

  const enabledReviewItems = reviewItems.filter(item => reviewChecks[item.key]);

  const FlatChevronUpIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 16 12" className={`w-4 h-3 -scale-y-100 ${className}`} fill="none" aria-hidden="true">
      <path d="M2.5 8.5L8 5.5L13.5 8.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const SolidMusicNoteIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.25 3.25a1 1 0 0 0-1.25-.97l-7 2A1 1 0 0 0 7.25 5.24v8.02a3.25 3.25 0 1 0 1.5 2.74V9.14l5.5-1.57v3.69a3.25 3.25 0 1 0 1.5 2.74V4.25Z" />
    </svg>
  );

  const SolidTextIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 92 92" className={className} fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M85.375 2C87.9297 2 90 4.07088 90 6.625V21C90 24.3137 87.3135 27 84 27H81.5C78.1865 27 75.5 24.3137 75.5 21V18.5C75.5 17.3955 74.6045 16.5 73.5 16.5H55.25C54.1455 16.5 53.25 17.3955 53.25 18.5V73.5C53.25 74.6045 54.1455 75.5 55.25 75.5H63C66.3136 75.5 69 78.1864 69 81.5V84C69 87.3136 66.3136 90 63 90H29C25.6863 90 23 87.3135 23 84V81.5C23 78.1865 25.6863 75.5 29 75.5H36.75C37.8545 75.5 38.75 74.6045 38.75 73.5V18.5C38.75 17.3955 37.8545 16.5 36.75 16.5H18.5C17.3955 16.5 16.5 17.3955 16.5 18.5V21C16.5 24.3137 13.8137 27 10.5 27H8C4.68633 27 2 24.3137 2 21V8C2 4.68633 4.68633 2 8 2H85.375Z" fill="currentColor" stroke="currentColor" strokeWidth="4" />
    </svg>
  );

  const ExpandCornersIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M9 4H6a2 2 0 0 0-2 2v3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 4h3a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 15v3a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 14.5 4.5 19.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4.5 16.5v3h3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 9.5 19.5 4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16.5 4.5h3v3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const UndoCurvedIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M9 7H4v5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12l4.5-4.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7h5.5a5.5 5.5 0 0 1 0 11H11" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const RedoCurvedIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M15 7h5v5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12 15.5 7.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7H9.5a5.5 5.5 0 0 0 0 11H13" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const buildMirroredWavePath = (samples: number[]) => {
    if (samples.length < 2) return '';

    const width = 1000;
    const height = 100;
    const baseline = height / 2;
    const maxAmplitude = (height * 0.6) / 2; // waveform takes ~60% of track height
    const step = width / (samples.length - 1);

    let path = `M 0 ${baseline}`;
    for (let i = 0; i < samples.length; i += 1) {
      const x = i * step;
      const yTop = baseline - samples[i] * maxAmplitude;
      path += ` L ${x.toFixed(2)} ${yTop.toFixed(2)}`;
    }

    for (let i = samples.length - 1; i >= 0; i -= 1) {
      const x = i * step;
      const yBottom = baseline + samples[i] * maxAmplitude;
      path += ` L ${x.toFixed(2)} ${yBottom.toFixed(2)}`;
    }

    path += ' Z';
    return path;
  };

  const renderReviewIcon = (key: ReviewCheckKey, size = 20, strokeWidth = 1.8) => {
    if (key === 'visual') return <Eye size={size} strokeWidth={strokeWidth} className="text-white" />;
    if (key === 'audio') return <Volume2 size={size} strokeWidth={strokeWidth} className="text-white" />;
    return <FileText size={size} strokeWidth={strokeWidth} className="text-white" />;
  };

  const handleVideoVolumeReady = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.volume = 0.2;
    const duration = Number.isFinite(e.currentTarget.duration) && e.currentTarget.duration > 0
      ? e.currentTarget.duration
      : 3;
    setFixTimelineDuration(duration);

    if (pendingFixSeekTime !== null) {
      e.currentTarget.currentTime = Math.min(Math.max(pendingFixSeekTime, 0), duration);
      e.currentTarget.pause();
      setIsPlaying(false);
      setPendingFixSeekTime(null);
    }
  };

  const seekAndPauseFixVideo = (targetTime: number) => {
    const video = fixVideoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);

    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.min(Math.max(targetTime, 0), video.duration);
      return;
    }

    setPendingFixSeekTime(targetTime);
  };

  const toggleEditorVideoPlayback = () => {
    const video = editorVideoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsEditorVideoPlaying(true);
    } else {
      video.pause();
      setIsEditorVideoPlaying(false);
    }
  };

  const toggleFixVideoPlayback = () => {
    const video = fixVideoRef.current;
    if (!video) return;

    if (video.paused) {
      if (shouldStartFromSwitchPoint) {
        const safeDuration = Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : fixTimelineDuration;
        video.currentTime = Math.min(Math.max(focusedTextSwitchTime, 0), safeDuration);
        setShouldStartFromSwitchPoint(false);
      }

      const isAtEnd = Number.isFinite(video.duration) && video.duration > 0 && video.currentTime >= video.duration - 0.05;
      if (isAtEnd) {
        video.currentTime = 0;
        setManualTimelineShiftPx(0);
        setTimelineAnimationCycle(prev => prev + 1);
      }
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const applyTimelineSnapshot = (snapshot: TimelineSnapshot) => {
    setSelectedTimelineTrack(snapshot.track);
    setFixStep(snapshot.step);
  };

  const pushTimelineSnapshot = (snapshot: TimelineSnapshot) => {
    setTimelineHistory(prev => {
      const base = prev.slice(0, timelineHistoryIndex + 1);
      const last = base[base.length - 1];
      if (last && last.track === snapshot.track && last.step === snapshot.step) {
        return prev;
      }
      const next = [...base, snapshot];
      setTimelineHistoryIndex(next.length - 1);
      return next;
    });
  };

  const commitTimelineEdit = (track: TimelineTrack, step: number) => {
    const snapshot = { track, step };
    applyTimelineSnapshot(snapshot);
    pushTimelineSnapshot(snapshot);
  };

  const handleUndoTimeline = () => {
    if (timelineHistoryIndex <= 0) return;
    const nextIndex = timelineHistoryIndex - 1;
    const snapshot = timelineHistory[nextIndex];
    if (!snapshot) return;
    setTimelineHistoryIndex(nextIndex);
    applyTimelineSnapshot(snapshot);
  };

  const handleRedoTimeline = () => {
    if (timelineHistoryIndex >= timelineHistory.length - 1) return;
    const nextIndex = timelineHistoryIndex + 1;
    const snapshot = timelineHistory[nextIndex];
    if (!snapshot) return;
    setTimelineHistoryIndex(nextIndex);
    applyTimelineSnapshot(snapshot);
  };

  const handleOneClickFix = () => {
    if (contentType === 'video') {
      if (activeRiskHint === 'text' && hasTextRisk) {
        setIsReplacingVideo(true);
        window.setTimeout(() => {
          setPendingFixSeekTime(focusedTextSwitchTime);
          setFixedRiskVideo('/assets/content/risk/video/de_fixed.mp4');
          setIsReplacingVideo(false);
          setHasTextRisk(false);
          setShouldStartFromSwitchPoint(true);
          setActiveRiskHint(null);
          setSelectedTimelineTrack(null);
          setFixStep(1);
        }, 1000);
        return;
      }

      if (activeRiskHint === 'music' && hasMusicRisk) {
        setPendingFixSeekTime(0);
        setFixedRiskVideo('/assets/content/risk/video/de_music_fixed.mp4');
        setHasMusicRisk(false);
        setShouldStartFromSwitchPoint(false);
        setActiveRiskHint(null);
        setSelectedTimelineTrack(null);
        setManualTimelineShiftPx(0);
        setTimelineAnimationCycle(prev => prev + 1);
        setFixStep(2);
        setIsAllFixed(!hasTextRisk);
      }
      return;
    }

    if (fixStep === 1) {
      const nextTrack: TimelineTrack = contentType === 'video' ? 'music' : selectedTimelineTrack;
      commitTimelineEdit(nextTrack, 2);
      return;
    }
    setIsAllFixed(true);
  };

  const focusOnTextRiskSegment = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hasTextRisk) return;

    commitTimelineEdit('text', 1);
    setActiveRiskHint('text');

    const viewport = timelineViewportRef.current;
    if (!viewport) {
      seekAndPauseFixVideo(0);
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const segmentRect = event.currentTarget.getBoundingClientRect();
    const segmentLeftInViewport = segmentRect.left - viewportRect.left;
    const viewportCenterX = viewportRect.width / 2;
    const shiftPx = Math.max(0, segmentLeftInViewport - viewportCenterX);
    setManualTimelineShiftPx(shiftPx);

    // Keep text-switch seek point stable at ~2s for both risk and fixed videos.
    const switchTime = Math.min(fixTimelineDuration, 2);
    setFocusedTextSwitchTime(switchTime);

    seekAndPauseFixVideo(switchTime);
  };

  const getReviewItemProgress = (index: number) => {
    if (enabledReviewItems.length === 0) return 0;
    const segment = 100 / enabledReviewItems.length;
    const start = index * segment;
    const raw = ((reviewProgress - start) / segment) * 100;
    return Math.max(0, Math.min(100, raw));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  const handleFixThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    if (fixScrollContainerRef.current) {
      const width = fixScrollContainerRef.current.clientWidth;
      fixScrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  const defaultMultiImages = [
    "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop"
  ];

  const mediaLibrary: Record<ReviewOutcome, { single: string; multi: string[]; video: string }> = {
    safe: {
      single: '/assets/content/safe/single/a.jpg',
      multi: [
        '/assets/content/safe/multi/a.jpg',
        '/assets/content/safe/multi/b.jpg',
        '/assets/content/safe/multi/c.jpg'
      ],
      video: '/assets/content/safe/video/happy.mp4'
    },
    risk: {
      single: '/assets/content/risk/single/a.jpg',
      multi: [
        '/assets/content/risk/multi/a.jpg',
        '/assets/content/risk/multi/b.jpg',
        '/assets/content/risk/multi/c.jpg'
      ],
      video: '/assets/content/risk/video/de.mp4'
    }
  };

  const activeSingleImage = selectedOutcome ? mediaLibrary[selectedOutcome].single : defaultMultiImages[0];
  const multiImages = selectedOutcome ? mediaLibrary[selectedOutcome].multi : defaultMultiImages;
  const activeVideo = selectedOutcome ? mediaLibrary[selectedOutcome].video : "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const previewVideo = fixedRiskVideo ?? activeVideo;
  const totalRiskCount = 2;
  const fixedRiskCount = Number(!hasTextRisk) + Number(!hasMusicRisk);
  const isVideoHintVisible = (activeRiskHint === 'text' && hasTextRisk) || (activeRiskHint === 'music' && hasMusicRisk);
  const musicTrackTitle = hasMusicRisk ? 'Lazy' : 'Fuzzy feeling';
  const videoFrameWidth = Math.max(1, Math.round(52 * videoFrameAspectRatio));
  const videoFramesToRender = videoTrackFrames.length > 0
    ? videoTrackFrames
    : Array.from({ length: 12 }, () => activeSingleImage);

  useEffect(() => {
    currentImageIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

  useEffect(() => {
    if (contentType !== 'video' || currentView !== 'fix') return;
    const initial: TimelineSnapshot = { track: selectedTimelineTrack, step: fixStep };
    setTimelineHistory([initial]);
    setTimelineHistoryIndex(0);
  }, [contentType, currentView]);

  const selectScenario = (nextType: ContentType, nextOutcome: ReviewOutcome) => {
    setContentType(nextType);
    setSelectedOutcome(nextOutcome);
    setReviewResult(null);
    setCurrentImageIndex(0);
    setIsEditorVideoPlaying(true);
    setIsPlaying(false);
    setFixStep(0);
    setIsAllFixed(false);
    setActiveRiskHint(null);
    setHasTextRisk(true);
    setHasMusicRisk(true);
    setIsReplacingVideo(false);
    setFixedRiskVideo(null);
    setManualTimelineShiftPx(0);
    setFocusedTextSwitchTime(0);
    setTimelineAnimationCycle(0);
    setShouldStartFromSwitchPoint(false);
    setSelectedTimelineTrack(null);
    setTimelineHistory([]);
    setTimelineHistoryIndex(-1);
  };

  const tools = [
    { id: 'edit', icon: null, imageUrl: '/assets/icons/tools/edit.png', label: '编辑' },
    { id: 'template', icon: null, imageUrl: '/assets/icons/tools/template.png', label: '模板' },
    { id: 'text', icon: null, imageUrl: '/assets/icons/tools/text.png', label: '文本' },
    { id: 'sticker', icon: null, imageUrl: '/assets/icons/tools/sticker.png', label: '贴纸' },
    { id: 'effects', icon: null, imageUrl: '/assets/icons/tools/effects.png', label: '特效' },
    { id: 'filters', icon: null, imageUrl: '/assets/icons/tools/filters.png', label: '滤镜' },
    { id: 'voice', icon: null, imageUrl: '/assets/icons/tools/voice.png', label: '声音', hiddenCollapsed: true },
    { id: 'captions', icon: <Subtitles size={26} strokeWidth={1.5} />, label: '字幕', hiddenCollapsed: true },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReviewing) {
      const duration = 6000; // 6 seconds
      const stepTime = 50; // update every 50ms
      const totalSteps = duration / stepTime;

      interval = setInterval(() => {
        setReviewProgress(prev => {
          const next = prev + (100 / totalSteps);
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, stepTime);
    }
    return () => clearInterval(interval);
  }, [isReviewing]);

  useEffect(() => {
    if (reviewProgress >= 100 && isReviewing) {
      setIsReviewing(false);
      if (currentView === 'home') {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          setReviewProgress(0);
        }, 4000);
      } else {
        if (reviewResult === 'safe') {
          setShowSuccessCelebration(true);
          setTimeout(() => {
            setShowSuccessCelebration(false);
            setShowReviewUI(false);
            setReviewProgress(0);
          }, 3500);
        } else {
          setShowReviewUI(false);
          setShowRiskPopup(true);
          setReviewProgress(0);
        }
      }
    }
  }, [reviewProgress, isReviewing, currentView, reviewResult]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      const duration = 5000; // 5 seconds upload
      const stepTime = 50;
      const totalSteps = duration / stepTime;

      interval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + (100 / totalSteps);
          if (next >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setUploadComplete(true);
            return 100;
          }
          return next;
        });
      }, stepTime);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  useEffect(() => {
    if (contentType !== 'multi') return;
    if (currentView !== 'editor' && currentView !== 'fix') return;
    if (currentView === 'fix' && selectedOutcome === 'risk') return;
    if (multiImages.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentImageIndexRef.current + 1) % multiImages.length;
      const container = currentView === 'fix' ? fixScrollContainerRef.current : scrollContainerRef.current;
      if (container) {
        const width = container.clientWidth;
        container.scrollTo({
          left: width * nextIndex,
          behavior: 'smooth'
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [contentType, currentView, selectedOutcome, multiImages.length]);

  useEffect(() => {
    if (contentType !== 'multi' || currentView !== 'fix') return;

    if (selectedOutcome !== 'risk') {
      setFixThumbnailOffsetX(0);
      return;
    }

    const updateFixThumbnailOffset = () => {
      const viewport = fixThumbnailViewportRef.current;
      const track = fixThumbnailTrackRef.current;
      if (!viewport || !track) return;

      const activeThumb = track.querySelector(`[data-thumb-index="${currentImageIndex}"]`) as HTMLElement | null;
      if (!activeThumb) return;

      const trackRect = track.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      const thumbCenterInTrack = thumbRect.left - trackRect.left + thumbRect.width / 2;
      const targetOffset = viewport.clientWidth / 2 - thumbCenterInTrack;
      setFixThumbnailOffsetX(targetOffset);
    };

    const rafId = requestAnimationFrame(updateFixThumbnailOffset);
    window.addEventListener('resize', updateFixThumbnailOffset);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateFixThumbnailOffset);
    };
  }, [contentType, currentView, selectedOutcome, currentImageIndex, multiImages.length]);

  useEffect(() => {
    if (contentType !== 'multi' || currentView !== 'editor') return;

    const updateEditorThumbnailOffset = () => {
      const viewport = editorThumbnailViewportRef.current;
      const track = editorThumbnailTrackRef.current;
      if (!viewport || !track) return;

      const activeThumb = track.querySelector(`[data-thumb-index="${currentImageIndex}"]`) as HTMLElement | null;
      if (!activeThumb) return;

      const trackRect = track.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      const thumbCenterInTrack = thumbRect.left - trackRect.left + thumbRect.width / 2;
      const targetOffset = viewport.clientWidth / 2 - thumbCenterInTrack;
      setEditorThumbnailOffsetX(targetOffset);
    };

    const rafId = requestAnimationFrame(updateEditorThumbnailOffset);
    window.addEventListener('resize', updateEditorThumbnailOffset);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateEditorThumbnailOffset);
    };
  }, [contentType, currentView, currentImageIndex, multiImages.length]);

  useEffect(() => {
    if (contentType !== 'video' || currentView !== 'fix') return;

    let isCancelled = false;

    const sampleVideoFrames = async () => {
      const sampler = document.createElement('video');
      sampler.src = activeVideo;
      sampler.preload = 'auto';
      sampler.muted = true;
      sampler.playsInline = true;

      const waitForEvent = (eventName: 'loadedmetadata' | 'seeked' | 'error') =>
        new Promise<void>((resolve, reject) => {
          const onResolve = () => {
            cleanup();
            resolve();
          };
          const onReject = () => {
            cleanup();
            reject(new Error(`video ${eventName} failed`));
          };
          const cleanup = () => {
            sampler.removeEventListener(eventName, onResolve);
            sampler.removeEventListener('error', onReject);
          };

          sampler.addEventListener(eventName, onResolve, { once: true });
          sampler.addEventListener('error', onReject, { once: true });
        });

      try {
        await waitForEvent('loadedmetadata');

        const ratio = sampler.videoHeight > 0 ? sampler.videoWidth / sampler.videoHeight : 16 / 9;
        const duration = Number.isFinite(sampler.duration) && sampler.duration > 0 ? sampler.duration : 3;
        const interval = 0.5;

        const canvas = document.createElement('canvas');
        const canvasHeight = 112;
        const canvasWidth = Math.max(1, Math.round(canvasHeight * ratio));
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const timestamps: number[] = [];
        for (let t = 0; t < duration; t += interval) {
          timestamps.push(t);
        }
        if (timestamps.length === 0) {
          timestamps.push(0);
        }

        const frames: string[] = [];
        for (const time of timestamps) {
          sampler.currentTime = Math.min(time, Math.max(duration - 0.05, 0));
          await waitForEvent('seeked');
          ctx.drawImage(sampler, 0, 0, canvasWidth, canvasHeight);
          frames.push(canvas.toDataURL('image/jpeg', 0.82));
        }

        // Ensure enough frame tiles to tightly cover the visual track area.
        const minFrameCount = 12;
        const tiledFrames: string[] = [];
        while (tiledFrames.length < minFrameCount) {
          tiledFrames.push(frames[tiledFrames.length % frames.length]);
        }

        if (!isCancelled) {
          setVideoFrameAspectRatio(ratio);
          setVideoTrackFrames(tiledFrames);
        }
      } catch {
        if (!isCancelled) {
          const fallbackFrames = Array.from({ length: 12 }, () => activeSingleImage);
          setVideoFrameAspectRatio(16 / 9);
          setVideoTrackFrames(fallbackFrames);
        }
      }
    };

    void sampleVideoFrames();

    return () => {
      isCancelled = true;
    };
  }, [contentType, currentView, activeVideo, activeSingleImage]);

  useEffect(() => {
    if (contentType !== 'video' || currentView !== 'fix') return;

    let isCancelled = false;

    const smoothSeries = (input: number[], radius: number) => {
      return input.map((_, index) => {
        let sum = 0;
        let count = 0;
        for (let i = Math.max(0, index - radius); i <= Math.min(input.length - 1, index + radius); i += 1) {
          sum += input[i];
          count += 1;
        }
        return count > 0 ? sum / count : 0;
      });
    };

    const buildWaveFromAudio = async () => {
      try {
        const response = await fetch(activeVideo);
        const audioData = await response.arrayBuffer();
        const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextCtor) throw new Error('AudioContext unavailable');
        const audioContext = new AudioContextCtor();
        const decoded = await audioContext.decodeAudioData(audioData.slice(0));

        const channels = decoded.numberOfChannels;
        const sampleCount = decoded.length;
        const mixed = new Float32Array(sampleCount);

        for (let ch = 0; ch < channels; ch += 1) {
          const data = decoded.getChannelData(ch);
          for (let i = 0; i < sampleCount; i += 1) {
            mixed[i] += data[i] / channels;
          }
        }

        const bucketCount = 240;
        const bucketSize = Math.max(1, Math.floor(sampleCount / bucketCount));
        const envelope: number[] = [];

        for (let bucket = 0; bucket < bucketCount; bucket += 1) {
          const start = bucket * bucketSize;
          const end = Math.min(sampleCount, start + bucketSize);
          if (end <= start) {
            envelope.push(0);
            continue;
          }

          let sumSquares = 0;
          for (let i = start; i < end; i += 1) {
            const value = mixed[i];
            sumSquares += value * value;
          }

          const rms = Math.sqrt(sumSquares / (end - start));
          envelope.push(rms);
        }

        const peak = Math.max(...envelope, 0.0001);
        const normalized = envelope.map((value) => Math.pow(Math.min(1, value / peak), 0.75));
        const smoothed = smoothSeries(normalized, 2).map((value) => Math.max(0.06, Math.min(1, value)));
        const path = buildMirroredWavePath(smoothed);

        await audioContext.close();

        if (!isCancelled) {
          setMusicWavePath(path);
        }
      } catch {
        // fallback: still use smooth mirrored waveform if decode fails
        const fallback = Array.from({ length: 240 }, (_, i) => {
          const t = i / 239;
          const curve = 0.35 + 0.3 * Math.sin(t * Math.PI * 3.2) + 0.15 * Math.sin(t * Math.PI * 11.5);
          return Math.max(0.08, Math.min(0.9, curve));
        });
        const path = buildMirroredWavePath(smoothSeries(fallback, 3));
        if (!isCancelled) {
          setMusicWavePath(path);
        }
      }
    };

    void buildWaveFromAudio();

    return () => {
      isCancelled = true;
    };
  }, [contentType, currentView, activeVideo]);

  const startReview = () => {
    if (enabledReviewItems.length === 0) {
      return;
    }
    setIsReviewing(true);
    setShowReviewUI(true);
    setReviewProgress(0);
    setReviewResult(selectedOutcome ?? 'safe');
  };

  const toggleReviewCheck = (key: ReviewCheckKey) => {
    setReviewChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBack = () => {
    setShowBackMenu(!showBackMenu);
  };

  let currentStepText = "准备中...";
  let currentStepIcon = (
    <div className="flex items-center justify-center gap-[3px] h-[20px]">
      <div className="w-[11px] h-[11px] rounded-full bg-[#20D5EC] flex items-center justify-center shadow-[0_0_6px_rgba(32,213,236,0.8)]">
        <div className="w-[5px] h-[5px] rounded-full bg-[#333333]"></div>
      </div>
      <div className="w-[11px] h-[11px] rounded-full bg-[#FE2C55] flex items-center justify-center shadow-[0_0_6px_rgba(254,44,85,0.8)]">
        <div className="w-[5px] h-[5px] rounded-full bg-[#333333]"></div>
      </div>
    </div>
  );
  if (reviewProgress < 100 && enabledReviewItems.length > 0) {
    const segment = 100 / enabledReviewItems.length;
    const activeIndex = Math.min(enabledReviewItems.length - 1, Math.floor(reviewProgress / segment));
    const activeItem = enabledReviewItems[activeIndex];
    currentStepText = activeItem?.statusText ?? "综合风险评估中...";
    if (activeItem) {
      currentStepIcon = renderReviewIcon(activeItem.key, 20, 1.8);
    }
  } else if (reviewProgress >= 100) {
    currentStepText = "审查完成";
    currentStepIcon = <CheckCircle2 size={20} />;
  }

  if (currentView === 'publish') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="relative w-full sm:w-auto sm:h-[90vh] aspect-[1170/2532] bg-white text-black overflow-hidden font-sans shadow-2xl rounded-[40px] border-8 border-black flex flex-col">
          {/* Top Navigation */}
          <div className="flex items-center px-4 py-4">
            <button onClick={() => setCurrentView('editor')} className="p-2 -ml-2 active:opacity-50 transition-opacity">
              <ChevronLeft size={28} className="text-black" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scrollbar-hide">
            {/* Media Preview Row */}
            <div className="px-4 flex gap-3 mb-6">
              <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden relative bg-gray-100">
                <img src={activeSingleImage} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="w-[120px] h-[120px] rounded-2xl bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors cursor-pointer">
                <Plus size={32} className="text-gray-400" />
              </div>
            </div>

            {/* Title Input */}
            <div className="px-4 mb-4">
              <input 
                type="text" 
                placeholder="添加一个吸睛标题" 
                className="w-full text-lg font-bold placeholder-gray-400 border-b border-gray-100 pb-3 focus:outline-none bg-transparent"
              />
            </div>

            {/* Text Area */}
            <div className="px-4 mb-2">
              <textarea 
                placeholder="🎨 Character's backstory:" 
                className="w-full h-24 text-base placeholder-gray-400 resize-none focus:outline-none bg-transparent"
              />
            </div>

            {/* Bottom Text Toolbar */}
            <div className="px-4 flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-medium active:bg-gray-200 transition-colors">#</button>
                <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-medium active:bg-gray-200 transition-colors">@</button>
                <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors">
                  <Lightbulb size={18} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center active:bg-cyan-100 transition-colors">
                  <Wand2 size={18} className="text-cyan-400" />
                </button>
              </div>
              <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors">
                <Maximize2 size={18} />
              </button>
            </div>

            <div className="h-[1px] bg-gray-100 w-full mb-2" />

            {/* Options List */}
            <div className="flex flex-col">
              {/* Location */}
              <div className="px-4 py-3 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <MapPin size={22} className="text-gray-700" />
                  <span className="text-[15px] font-medium">位置</span>
                  <Info size={14} className="text-gray-400" />
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
              {/* Location Chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide w-full">
                <div className="w-[38px] shrink-0" />
                <div className="whitespace-nowrap px-3 py-1.5 bg-gray-100 rounded-md text-[13px] text-gray-600">Los Angeles Angels</div>
                <div className="whitespace-nowrap px-3 py-1.5 bg-gray-100 rounded-md text-[13px] text-gray-600">RCC🕌🤲🏼💗</div>
                <div className="whitespace-nowrap px-3 py-1.5 bg-gray-100 rounded-md text-[13px] text-gray-600">California Oaklan...</div>
                <div className="w-2 shrink-0" />
              </div>

              <div className="h-[1px] bg-gray-100 w-full ml-12" />

              {/* Add Link */}
              <div className="px-4 py-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <PlusSquare size={22} className="text-gray-700" />
                  <span className="text-[15px] font-medium">添加链接</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>

              <div className="h-[1px] bg-gray-100 w-full ml-12" />

              {/* Visibility */}
              <div className="px-4 py-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Globe size={22} className="text-gray-700" />
                  <span className="text-[15px] font-medium">所有人都可以查看这条发布内容</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>

              <div className="h-[1px] bg-gray-100 w-full ml-12" />

              {/* More Options */}
              <div className="px-4 py-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Settings size={22} className="text-gray-700" />
                  <span className="text-[15px] font-medium">更多选项</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>

              <div className="h-[1px] bg-gray-100 w-full ml-12" />

              {/* Share To */}
              <div className="px-4 py-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Share size={22} className="text-gray-700" />
                  <span className="text-[15px] font-medium">分享到</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 pb-8">
            <button className="flex-1 flex items-center justify-center gap-1 h-11 bg-gray-100 text-black rounded-full font-medium text-[15px] active:bg-gray-200 transition-colors">
              <Inbox size={18} />
              草稿
            </button>
            <button 
              onClick={() => {
                setCurrentView('friends');
                setUploadProgress(0);
                setIsUploading(true);
                setUploadComplete(false);
              }}
              className="flex-1 flex items-center justify-center gap-1 h-11 bg-[#FE2C55] text-white rounded-full font-medium text-[15px] active:scale-95 transition-transform"
            >
              <ArrowUpCircle size={18} />
              发布
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'friends') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="relative w-full sm:w-auto sm:h-[90vh] aspect-[1170/2532] bg-black text-white overflow-hidden font-sans shadow-2xl rounded-[40px] border-8 border-black flex flex-col">
          {/* Full Screen Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={uploadComplete ? activeSingleImage : (multiImages[1] ?? activeSingleImage)} 
              alt="Friends Content" 
              className="w-full h-full object-cover transition-all duration-500"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>

          {/* Video Published Card */}
          {uploadComplete && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-12 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 z-50 text-black"
            >
              <h3 className="text-[16px] font-medium mb-4">视频已发布！所有人可以查看。分享：</h3>
              <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                
                {/* Copy Link */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                    <Link size={24} className="text-white" />
                  </div>
                  <span className="text-[11px] text-gray-600">复制链接</span>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <span className="text-[11px] text-gray-600">WhatsApp</span>
                </div>

                {/* SMS */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="w-12 h-12 rounded-full bg-[#34C759] flex items-center justify-center">
                    <MessageSquare size={24} className="text-white" />
                  </div>
                  <span className="text-[11px] text-gray-600">短信</span>
                </div>

                {/* Instagram Direct */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584] flex items-center justify-center">
                    <Instagram size={24} className="text-white" />
                  </div>
                  <span className="text-[11px] text-gray-600 text-center leading-tight">Instagram<br/>Direct</span>
                </div>

                {/* WA Business */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="w-12 h-12 rounded-full bg-[#128C7E] flex items-center justify-center relative">
                    <MessageCircle size={24} className="text-white" />
                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5">
                      <Plus size={8} className="text-[#128C7E]" strokeWidth={4} />
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-600 text-center leading-tight">WA<br/>Business</span>
                </div>

                {/* Email */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="w-12 h-12 rounded-full bg-[#007AFF] flex items-center justify-center">
                    <Mail size={24} className="text-white" />
                  </div>
                  <span className="text-[11px] text-gray-600">电子邮件</span>
                </div>

              </div>
            </motion.div>
          )}

          {/* Top Navigation */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" className="w-8 h-8 rounded-full border border-white/20" />
              <div className="absolute -bottom-1 -right-1 bg-[#20D5EC] rounded-full p-0.5 border-2 border-black">
                <Plus size={10} className="text-white" />
              </div>
            </div>
            <span className="text-[17px] font-semibold tracking-wide">好友</span>
            <Search size={24} className="text-white" />
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 flex-1 flex pb-4">
            {/* Left Side - Upload Progress & Info */}
            <div className="flex-1 px-4 flex flex-col justify-between">
              <div className="pt-4">
                {isUploading && !uploadComplete && (
                  <div className="relative w-[72px] h-[96px] rounded-xl overflow-hidden shadow-lg border-2 border-white/80 mt-4">
                    <img 
                      src={activeSingleImage} 
                      alt="Uploading" 
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-white/30"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-white"
                            strokeWidth="3"
                            strokeDasharray={`${uploadProgress}, 100`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-bold text-white">{Math.round(uploadProgress)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Info */}
              <div className="flex items-center gap-2 text-white drop-shadow-md">
                <span className="font-semibold text-[15px]">{uploadComplete ? "Fifi" : "Lucy"}</span>
                <div className="flex items-center gap-1 text-white/90 text-[14px]">
                  <Aperture size={14} />
                  <span>动态照片 · {uploadComplete ? "1 秒前" : "23 分钟前"}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="w-16 flex flex-col items-center justify-end gap-6">
              <div className="relative mb-2">
                <img 
                  src={uploadComplete ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" : "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop"} 
                  alt="Creator" 
                  className="w-12 h-12 rounded-full border-2 border-white" 
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] rounded-full p-0.5">
                  <Plus size={12} className="text-white" />
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <Heart size={32} className="text-white drop-shadow-md" fill="currentColor" />
                <span className="text-[13px] font-medium drop-shadow-md text-white">0</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <MessageCircle size={32} className="text-white drop-shadow-md" fill="currentColor" />
                <span className="text-[13px] font-medium drop-shadow-md text-white">0</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <Bookmark size={32} className="text-white drop-shadow-md" fill="currentColor" />
                <span className="text-[13px] font-medium drop-shadow-md text-white">0</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <MoreHorizontal size={32} className="text-white drop-shadow-md" />
              </div>

              <div className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center animate-[spin_4s_linear_infinite] mt-2 border-[6px] border-[#1a1a1a]">
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" alt="Music" className="w-6 h-6 rounded-full" />
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="relative z-10 bg-black border-t border-white/10 px-2 py-2 flex items-center justify-between pb-8">
            <button className="flex-1 flex flex-col items-center gap-1 text-white/60 active:text-white transition-colors">
              <Home size={24} />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 text-white active:text-white transition-colors">
              <Users size={24} />
              <span className="text-[10px] font-medium">Friends</span>
            </button>
            
            {/* Create Button with Ghosting Effect */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-11 h-8 flex items-center justify-center active:scale-95 transition-transform">
                <div className="absolute inset-0 bg-[#20D5EC] rounded-xl translate-x-[-3px]" />
                <div className="absolute inset-0 bg-[#FE2C55] rounded-xl translate-x-[3px]" />
                <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center">
                  <Plus size={20} className="text-black stroke-[3]" />
                </div>
              </div>
            </div>

            <button className="flex-1 flex flex-col items-center gap-1 text-white/60 active:text-white transition-colors relative">
              <div className="relative">
                <Inbox size={24} />
                <div className="absolute -top-1 -right-2 bg-[#FE2C55] text-white text-[10px] font-bold px-1.5 rounded-full border border-black">9</div>
              </div>
              <span className="text-[10px] font-medium">Inbox</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 text-white/60 active:text-white transition-colors">
              <User size={24} />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down {
            animation: fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
        <div className="relative w-full sm:w-auto sm:h-[90vh] aspect-[1170/2532] bg-black text-white overflow-hidden font-sans shadow-2xl rounded-[40px] border-8 border-black flex flex-col">
          {/* Fake Home Screen */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <Archive size={48} className="text-white/20 mb-4" />
            <p className="text-white/50">已保存至草稿箱</p>
            <button 
              onClick={() => setCurrentView('editor')}
              className="mt-8 px-6 py-2 bg-white/10 rounded-full active:bg-white/20 transition-colors"
            >
              返回编辑
            </button>
          </div>

          {/* Push Notification */}
          {showNotification && (
            <div className="absolute top-12 inset-x-4 bg-[#252525]/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl animate-fade-in-down flex items-start gap-3 z-50">
              <div className="w-8 h-8 rounded-full bg-[#00D27A]/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-[#00D27A]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-medium text-white">AI 审查完成</h4>
                <p className="text-[12px] text-white/70 mt-0.5 leading-relaxed">审查通过快去发布吧！</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'publish') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="relative w-full sm:w-auto sm:h-[90vh] aspect-[1170/2532] bg-white text-black overflow-hidden font-sans shadow-2xl rounded-[40px] border-8 border-black flex flex-col">
          <div className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-gray-100">
            <button onClick={() => setCurrentView('fix')} className="active:scale-90 transition-transform">
              <ChevronLeft size={28} />
            </button>
            <div className="font-medium text-[17px]">发布</div>
            <div className="w-7"></div>
          </div>
          <div className="p-4 flex gap-4 border-b border-gray-100">
            <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
              {contentType === 'video' ? (
                <video src={activeVideo} className="w-full h-full object-cover" />
              ) : (
                <img src={contentType === 'multi' ? multiImages[0] : activeSingleImage} className="w-full h-full object-cover" />
              )}
            </div>
            <textarea 
              className="flex-1 resize-none outline-none text-[15px] placeholder:text-gray-400"
              placeholder="添加描述..."
            />
          </div>
          <div className="mt-auto p-4 border-t border-gray-100 flex gap-3">
            <button className="flex-1 py-3.5 bg-gray-100 rounded-sm font-medium text-[15px]">草稿</button>
            <button className="flex-1 py-3.5 bg-[#FE2C55] text-white rounded-sm font-medium text-[15px]">发布</button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'fix') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="relative w-full sm:w-auto sm:h-[90vh] aspect-[1170/2532] bg-black text-white overflow-hidden font-sans shadow-2xl rounded-[40px] border-8 border-black flex flex-col">
          {/* Top Bar (8%) */}
          <div className="h-[8%] flex items-center justify-between px-4 pt-8 z-30 shrink-0">
            <button onClick={() => setCurrentView('editor')} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 active:scale-95 transition-transform">
              <ChevronLeft size={28} />
            </button>
            <div className="font-medium text-[15px]">
              {isAllFixed ? '✓ 全部修复完成' : `修复注意项 (${fixedRiskCount}/${totalRiskCount})`}
            </div>
            <button 
              onClick={() => { 
                if (isAllFixed) {
                  setCurrentView('publish');
                } else {
                  setShowPublishWarning(true);
                }
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FE2C55] text-white active:scale-95 transition-transform"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Content based on contentType */}
          {contentType === 'video' ? (
            // Video Layout
            <div className="flex-1 flex flex-col items-center pt-2 px-4 pb-8 min-h-0">
              {/* Video Preview Container */}
              <div className={`${isAllFixed ? 'w-[86.25%] h-[69%]' : isVideoHintVisible ? 'w-[60%] h-[48%]' : 'w-[73.75%] h-[59%]'} border border-white/20 rounded-[22px] overflow-hidden bg-black flex items-center justify-center shrink-0 relative`}>
                <div className="w-full h-full overflow-hidden relative bg-black flex items-center justify-center">
                  <video 
                    ref={fixVideoRef}
                    src={previewVideo} 
                    autoPlay={isPlaying} 
                    playsInline
                    onLoadedMetadata={handleVideoVolumeReady}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full max-h-full h-auto object-contain object-center"
                  />
                  {isReplacingVideo && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-20">
                      <Loader2 size={30} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full mt-4 flex flex-col flex-1 min-h-0">
                <div className="mt-auto -translate-y-[16px]">
                  {/* Playback Control Bar */}
                  <div className="h-[40px] flex items-center px-0 justify-between shrink-0 relative">
                    <span className="text-[13px] font-medium text-white/90">00:00/00:04</span>
                    <button
                      onClick={toggleFixVideoPlayback}
                      className="absolute left-1/2 -translate-x-1/2 w-[18px] h-[18px] flex items-center justify-center active:scale-95 transition-transform"
                      aria-label={isPlaying ? '暂停' : '播放'}
                    >
                      {isPlaying ? (
                        <span className="flex items-center gap-[3px]">
                          <span className="block w-[4px] h-[18px] rounded-[2px] bg-white" />
                          <span className="block w-[4px] h-[18px] rounded-[2px] bg-white" />
                        </span>
                      ) : (
                        <svg viewBox="0 0 20 20" className="w-[20px] h-[20px] text-white" fill="currentColor" aria-hidden="true">
                          <path d="M3.2 3.6c0-1 1.1-1.6 2-1.1l12 7.1c0.9 0.5 0.9 1.8 0 2.4l-12 7.1c-0.9 0.5-2-0.1-2-1.1V3.6z" />
                        </svg>
                      )}
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleUndoTimeline}
                        disabled={timelineHistoryIndex <= 0}
                        className={`active:scale-90 transition-transform ${timelineHistoryIndex <= 0 ? 'opacity-40 cursor-not-allowed active:scale-100' : ''}`}
                        aria-label="撤回"
                      >
                        <UndoCurvedIcon className={`w-[20px] h-[20px] ${timelineHistoryIndex <= 0 ? 'text-white/40' : 'text-white'}`} />
                      </button>

                      <button
                        onClick={handleRedoTimeline}
                        disabled={timelineHistoryIndex >= timelineHistory.length - 1}
                        className={`active:scale-90 transition-transform ${timelineHistoryIndex >= timelineHistory.length - 1 ? 'opacity-40 cursor-not-allowed active:scale-100' : ''}`}
                        aria-label="取消撤回"
                      >
                        <RedoCurvedIcon className={`w-[20px] h-[20px] ${timelineHistoryIndex >= timelineHistory.length - 1 ? 'text-white/40' : 'text-white'}`} />
                      </button>

                      <button className="active:scale-90 transition-transform" aria-label="放大">
                        <ExpandCornersIcon className="w-[20px] h-[20px] text-white" />
                      </button>
                    </div>
                  </div>

                  {/* 3-Track Timeline Area */}
                  <div ref={timelineViewportRef} className="h-[154px] flex flex-col shrink-0 relative overflow-visible bg-black">
                <style>{`
                  @keyframes moveTracks {
                    from { transform: translateX(0); }
                    to { transform: translateX(calc(-33.333% - 80px)); }
                  }
                `}</style>
                
                {/* Time markers (sync with track movement) */}
                <div className="h-6 pt-1 relative w-full overflow-hidden text-white/50 text-[12px] font-medium z-40">
                  <div style={{ transform: `translateX(-${manualTimelineShiftPx}px)` }} className="h-full w-full">
                    <div
                      key={`time-markers-${timelineAnimationCycle}`}
                      className="h-full w-[200%] relative"
                      style={{
                        animation: `moveTracks ${fixTimelineDuration}s linear 1 both`,
                        animationPlayState: isPlaying ? 'running' : 'paused'
                      }}
                    >
                      <div className="absolute left-[25%] -translate-x-1/2">00:00</div>
                      <div className="absolute left-[37.5%] -translate-x-1/2">00:01</div>
                      <div className="absolute left-[50%] -translate-x-1/2">00:02</div>
                      <div className="absolute left-[62.5%] -translate-x-1/2">00:03</div>
                      <div className="absolute left-[75%] -translate-x-1/2">00:04</div>
                    </div>
                  </div>
                </div>

                {/* Time pointer (Fixed in center) */}
                <div className="absolute left-1/2 top-[32px] h-[140px] w-[2px] bg-white rounded-full z-20 shadow-[0_0_4px_rgba(0,0,0,0.5)] -translate-x-1/2 cursor-ew-resize" />

                {/* Tracks Container (Moves) */}
                <div style={{ transform: `translateX(-${manualTimelineShiftPx}px)` }} className="h-[calc(100%-6px)] translate-y-[16px]">
                <div 
                  key={`tracks-${timelineAnimationCycle}`}
                  className="flex flex-col gap-[6px] relative z-10 h-full w-[200%]"
                  style={{ 
                    animation: `moveTracks ${fixTimelineDuration}s linear 1 both`,
                    animationPlayState: isPlaying ? 'running' : 'paused'
                  }}
                >
                  {/* Video Track */}
                  <div
                    className="h-[52px] flex overflow-hidden relative ml-[25%] w-[calc(33.333%+80px)] rounded-[6px] cursor-pointer bg-[#111317]"
                    onClick={() => {
                      commitTimelineEdit('video', 1);
                    }}
                    style={{ boxShadow: selectedTimelineTrack === 'video' ? 'inset 0 0 0 1.5px rgba(255,255,255,0.95)' : 'none' }}
                  >
                    <div className="flex h-full w-max min-w-full">
                      {videoFramesToRender.map((frame, i) => {
                        const isFirst = i === 0;
                        const isLast = i === videoFramesToRender.length - 1;
                        return (
                          <div
                            key={`${frame}-${i}`}
                            className={`h-[52px] shrink-0 overflow-hidden ${isFirst ? 'rounded-l-[4px]' : ''} ${isLast ? 'rounded-r-[4px]' : ''}`}
                            style={{ width: `${videoFrameWidth}px` }}
                          >
                            <img src={frame} className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                    {selectedTimelineTrack === 'video' && (
                      <>
                        <div className="absolute left-1 top-0 bottom-0 w-1 bg-white rounded-[2px] z-20" />
                        <div className="absolute right-1 top-0 bottom-0 w-1 bg-white rounded-[2px] z-20" />
                      </>
                    )}

                  </div>

                  {/* Music Track */}
                  <div 
                    className={`h-[32px] rounded-lg relative overflow-hidden ml-[25%] w-[calc(33.333%+80px)] cursor-pointer transition-colors ${hasMusicRisk ? 'border-2 border-red-500' : 'border border-transparent'} ${!isAllFixed && fixStep === 2 ? 'bg-amber-500' : 'bg-[#8B93FF]'}`}
                    onClick={() => {
                      if (!hasMusicRisk) return;
                      commitTimelineEdit('music', 2);
                      setActiveRiskHint('music');
                    }}
                  >
                    {/* Mirrored audio waveform from sampled audio data */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
                        <path d={musicWavePath} fill="rgba(56, 93, 223, 0.55)" />
                      </svg>
                    </div>
                    
                    {hasMusicRisk && <div className="absolute inset-0 rounded-lg bg-red-500/20 pointer-events-none" />}

                    <div className="relative z-10 h-full flex items-center px-3 gap-2.5">
                      <SolidMusicNoteIcon className="w-5 h-5 text-black/65 shrink-0" />
                      <span className="text-[12px] font-medium text-black/70 truncate">{musicTrackTitle}</span>
                    </div>
                    {hasMusicRisk && activeRiskHint === 'music' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/40 text-[10px] px-2 py-0.5 rounded-b-md text-white">
                        受限地区
                      </div>
                    )}
                  </div>

                  {/* Text Track */}
                  <div
                    className="h-[32px] relative overflow-visible ml-[25%] w-[33.333%]"
                  >
                    <div
                      className="absolute top-0 left-0 h-full rounded-lg bg-[#F4A8E6] px-3 flex items-center gap-2.5"
                      style={{ width: '172px' }}
                    >
                      <SolidTextIcon className="w-3 h-3 text-black/65 shrink-0" />
                      <span className="text-[12px] font-medium text-black/70 truncate">I am a kitty</span>
                    </div>
                    <div
                      className={`absolute top-0 h-full rounded-lg bg-[#F4A8E6] px-3 flex items-center relative gap-2.5 ${hasTextRisk ? 'border-2 border-red-500 cursor-pointer' : 'border border-transparent'}`}
                      style={{ left: '174px', width: '126px' }}
                      onClick={focusOnTextRiskSegment}
                    >
                      {hasTextRisk && <div className="absolute inset-0 rounded-lg bg-red-500/20 pointer-events-none" />}
                      <SolidTextIcon className="w-3 h-3 text-black/65 shrink-0 relative z-10" />
                      <span className="text-[12px] font-medium text-black/70 truncate relative z-10">but I am depressed</span>
                    </div>
                  </div>
                </div>
                </div>
                  </div>
                </div>

                {/* Hint Box (Video) */}
                {!isAllFixed && isVideoHintVisible && (
                  <div className="mt-4 -mx-1 bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle size={16} className="text-[#FE2C55] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[12px] text-white/90">
                        {activeRiskHint === 'text' ? '视频中文字含[精神健康]类话题敏感词' : '音乐在部分地区版权受限'}
                      </p>
                    </div>
                    <button className="text-[10px] text-white/50 whitespace-nowrap flex items-center">
                      查看准则 <ChevronRight size={12} />
                    </button>
                  </div>
                )}

                {/* Bottom Toolbar */}
                {!isAllFixed && (
                  <div className="w-[calc(100%+16px)] -mx-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
                    <div className="min-w-max flex gap-1">
                      <button
                        onClick={handleOneClickFix}
                        className="w-[74px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform"
                      >
                        <Wand2 size={24} className="text-[#00f2fe]" />
                        <span className="text-[11px] text-[#00f2fe] font-medium">一键修复</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/edit.png" alt="编辑" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">编辑</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/voice.png" alt="音乐" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">音乐</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/text.png" alt="文本" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">文本</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/effects.png" alt="特效" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">特效</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/filters.png" alt="滤镜" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">滤镜</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <Subtitles size={24} className="text-white/85" />
                        <span className="text-[11px] text-white/85 font-medium">字幕</span>
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
          ) : (
            // Image Layout (Single/Multi)
            <div className="flex-1 flex flex-col items-center pt-4 px-4 pb-8">
              {/* Media Viewport Container */}
              <div className="w-[76%] h-[62%] border border-white/20 rounded-[22px] overflow-hidden bg-black flex items-center justify-center shrink-0">
                {contentType === 'multi' ? (
                  <div
                    ref={fixScrollContainerRef}
                    className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    onScroll={(e) => {
                      const scrollLeft = e.currentTarget.scrollLeft;
                      const width = e.currentTarget.clientWidth;
                      const index = Math.round(scrollLeft / width);
                      if (index !== currentImageIndex) {
                        setCurrentImageIndex(index);
                      }
                    }}
                  >
                    {multiImages.map((img, idx) => (
                      <div key={idx} className="min-w-full h-full flex items-center justify-center snap-center">
                        <img src={img} className="w-full h-full object-contain" alt={`Media ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={activeSingleImage}
                    className="w-full h-full object-contain"
                    alt="Media"
                  />
                )}
              </div>

              {/* Bottom Tool Area */}
              <div className="w-full mt-6 flex flex-col flex-1">
                {/* Thumbnail Preview (center aligned, no side icons) */}
                {contentType === 'multi' && (
                  <div ref={fixThumbnailViewportRef} className="w-full mt-auto overflow-hidden px-2">
                    <div
                      ref={fixThumbnailTrackRef}
                      className="w-max min-w-full flex items-end justify-center gap-[6px] transition-transform duration-300 ease-out"
                      style={{ transform: `translateX(${fixThumbnailOffsetX}px)` }}
                    >
                      {multiImages.map((img, idx) => {
                        const isActive = currentImageIndex === idx;
                        const isRiskImage = !isAllFixed && fixStep === 1 && idx === 0;
                        return (
                          <div key={idx} className="relative flex flex-col items-center justify-end h-[64px]">
                            {isActive && (
                              <motion.div layoutId="fix-active-chevron" className="absolute -top-[2px]">
                                <FlatChevronUpIcon className="text-white drop-shadow-md" />
                              </motion.div>
                            )}
                            <button
                              onClick={() => handleFixThumbnailClick(idx)}
                              data-thumb-index={idx}
                              className={`rounded-[12px] overflow-hidden transition-all duration-300 ${
                                isActive
                                  ? `w-12 h-12 border-[2px] ${isRiskImage ? 'border-[#FE2C55]' : 'border-white'}`
                                  : `w-10 h-10 border ${isRiskImage ? 'border-[#FE2C55] opacity-100' : 'border-transparent opacity-60'} mb-1`
                              }`}
                            >
                              <img src={img} className="w-full h-full object-cover" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {contentType === 'single' && (
                  <div className="w-full flex justify-center mt-auto">
                    <div className="flex items-end gap-[6px]">
                      <div className="relative flex flex-col items-center justify-end h-[64px]">
                        <motion.div layoutId="fix-active-chevron" className="absolute -top-[2px]">
                          <FlatChevronUpIcon className="text-white drop-shadow-md" />
                        </motion.div>
                        <div className={`w-12 h-12 rounded-[12px] overflow-hidden shrink-0 relative border-2 ${!isAllFixed && fixStep === 1 ? 'border-[#FE2C55]' : 'border-white'}`}>
                          <img src={activeSingleImage} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hint Box */}
                {!isAllFixed && (
                  <div className="mt-4 -mx-1 bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle size={16} className="text-[#FE2C55] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[12px] text-white/90">
                        {fixStep === 1 ? '画面内容检测到可能违反「安全与礼貌」准则' : '视频中文字含敏感词：「精神健康」类话题限制分发'}
                      </p>
                    </div>
                    <button className="text-[10px] text-white/50 whitespace-nowrap flex items-center">
                      查看准则 <ChevronRight size={12} />
                    </button>
                  </div>
                )}

                {/* Toolbars */}
                {!isAllFixed && (
                  <div className="w-[calc(100%+16px)] -mx-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
                    <div className="min-w-max flex gap-1">
                      <button
                        onClick={handleOneClickFix}
                        className="w-[74px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform"
                      >
                        <Wand2 size={24} className="text-[#00f2fe]" />
                        <span className="text-[11px] text-[#00f2fe] font-medium">一键修复</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/edit.png" alt="编辑" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">编辑</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/voice.png" alt="音乐" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">音乐</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/text.png" alt="文本" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">文本</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/effects.png" alt="特效" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">特效</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <img src="/assets/icons/tools/filters.png" alt="滤镜" className="w-6 h-6" />
                        <span className="text-[11px] text-white/85 font-medium">滤镜</span>
                      </button>

                      <button className="w-[68px] h-[74px] rounded-xl bg-[#17181D] flex flex-col items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform">
                        <Subtitles size={24} className="text-white/85" />
                        <span className="text-[11px] text-white/85 font-medium">字幕</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Music Selector Popup */}
          {showMusicSelector && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMusicSelector(false)}
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative h-[80%] bg-[#161823] rounded-t-2xl flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <button onClick={() => setShowMusicSelector(false)}>
                    <X size={24} className="text-white" />
                  </button>
                  <span className="font-medium text-[15px]">配乐</span>
                  <button onClick={() => {
                    setShowMusicSelector(false);
                    setIsAllFixed(true);
                  }}>
                    <Search size={24} className="text-white" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-white/10 rounded-full text-[13px] font-medium text-white">版权清晰</button>
                    <button className="px-4 py-1.5 bg-white/5 rounded-full text-[13px] font-medium text-white/50">热门</button>
                    <button className="px-4 py-1.5 bg-white/5 rounded-full text-[13px] font-medium text-white/50">收藏</button>
                  </div>

                  <div className="flex flex-col gap-4 mt-2">
                    {[
                      { name: "Summer Vibes", author: "DJ Chill", duration: "01:20" },
                      { name: "Happy Day", author: "Pop Star", duration: "00:45" },
                      { name: "Epic Journey", author: "Movie Score", duration: "02:10" },
                      { name: "Lofi Study", author: "Beats Maker", duration: "03:00" },
                      { name: "Dance All Night", author: "Club Mix", duration: "01:50" }
                    ].map((music, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center shrink-0 relative overflow-hidden">
                          <Music size={20} className="text-white/50" />
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-[15px] font-medium text-white truncate">{music.name}</h4>
                          <p className="text-[12px] text-white/50 truncate">{music.author} · {music.duration}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setShowMusicSelector(false);
                            setIsAllFixed(true);
                          }}
                          className="px-4 py-1.5 bg-[#FE2C55] text-white rounded-sm text-[13px] font-medium shrink-0"
                        >
                          使用
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          {/* Publish Warning Popup */}
          {showPublishWarning && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowPublishWarning(false)}
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative bg-[#161823] rounded-t-2xl px-5 pt-6 pb-8 text-white shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[20px] font-[700] tracking-tight">确认带风险发布？</h2>
                  <button 
                    onClick={() => setShowPublishWarning(false)}
                    className="p-1.5 active:opacity-70 transition-opacity bg-white/10 rounded-full"
                  >
                    <X size={16} className="text-white/80" />
                  </button>
                </div>

                <p className="text-[14px] text-white/80 mb-6 leading-relaxed">
                  你有 {fixStep === 1 ? 2 : 1} 项未修复的注意项：
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {fixStep === 1 && (
                    <div className="flex items-center gap-2 text-[14px] text-white/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                      视频中文字含敏感词：「精神健康」类话题限制分发
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[14px] text-white/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                    音乐在部分地区版权受限
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowPublishWarning(false);
                      setCurrentView('publish');
                    }}
                    className="flex-1 py-3.5 rounded-full font-semibold text-[15px] bg-white/10 text-white active:bg-white/20 transition-colors"
                  >
                    仍然发布
                  </button>
                  <button 
                    onClick={() => setShowPublishWarning(false)}
                    className="flex-1 py-3.5 rounded-full font-semibold text-[15px] bg-[#FE2C55] text-white active:bg-[#FE2C55]/90 transition-colors"
                  >
                    返回修复
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes confettiFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes ribbonBurst {
          0% {
            transform: translate(-50%, -50%) scale(0.2) rotate(0deg);
            opacity: 0;
          }
          18% {
            opacity: 0.85;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot));
            opacity: 0;
          }
        }
        @keyframes celebratePop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-celebrate-pop {
          animation: celebratePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      <div className="relative w-full sm:w-auto sm:h-[90vh] aspect-[1170/2532] bg-black text-white overflow-hidden font-sans shadow-2xl rounded-[40px] border-8 border-black flex flex-col">
        {/* Media Container: spacing and enlargement scaled from 1170x2532 baseline */}
        <div
          className="absolute inset-x-0 flex items-center justify-center overflow-hidden"
          style={{ top: '16.27%', bottom: '22.12%' }}
        >
          <div className="w-full h-[105.85%] flex items-center justify-center">
            {contentType === 'video' ? (
              <div className="relative w-full h-full cursor-pointer" onClick={toggleEditorVideoPlayback}>
                <video 
                  ref={editorVideoRef}
                  src={activeVideo} 
                  autoPlay={isEditorVideoPlaying}
                  loop 
                  playsInline
                  onPlay={() => setIsEditorVideoPlaying(true)}
                  onPause={() => setIsEditorVideoPlaying(false)}
                  onLoadedMetadata={handleVideoVolumeReady}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : contentType === 'multi' ? (
              <div 
                ref={scrollContainerRef}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                onScroll={(e) => {
                  const scrollLeft = e.currentTarget.scrollLeft;
                  const width = e.currentTarget.clientWidth;
                  const index = Math.round(scrollLeft / width);
                  if (index !== currentImageIndex) {
                    setCurrentImageIndex(index);
                  }
                }}
              >
                {multiImages.map((img, idx) => (
                  <div key={idx} className="min-w-full h-full flex items-center justify-center snap-center">
                    <img src={img} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            ) : contentType ? (
              <img 
                src={activeSingleImage} 
                alt="Content" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-black" />
            )}
          </div>
        </div>

        {/* Content Type Selector Overlay */}
        {contentType === null && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1A1A1A] rounded-2xl p-5 w-[260px] flex flex-col gap-3 shadow-2xl border border-white/10"
            >
              <h3 className="text-white font-semibold text-center mb-2 text-[16px]">选择上传场景</h3>
              <button 
                onClick={() => selectScenario('single', 'safe')}
                className="w-full py-3.5 bg-[#00D27A]/15 rounded-xl text-white font-medium text-[15px] active:bg-[#00D27A]/25 transition-colors"
              >
                无风险 - 单图
              </button>
              <button 
                onClick={() => selectScenario('multi', 'safe')}
                className="w-full py-3.5 bg-[#00D27A]/15 rounded-xl text-white font-medium text-[15px] active:bg-[#00D27A]/25 transition-colors"
              >
                无风险 - 多图
              </button>
              <button 
                onClick={() => selectScenario('video', 'safe')}
                className="w-full py-3.5 bg-[#00D27A]/15 rounded-xl text-white font-medium text-[15px] active:bg-[#00D27A]/25 transition-colors"
              >
                无风险 - 视频
              </button>
              <button 
                onClick={() => selectScenario('single', 'risk')}
                className="w-full py-3.5 bg-[#FE2C55]/15 rounded-xl text-white font-medium text-[15px] active:bg-[#FE2C55]/25 transition-colors"
              >
                有风险 - 单图
              </button>
              <button 
                onClick={() => selectScenario('multi', 'risk')}
                className="w-full py-3.5 bg-[#FE2C55]/15 rounded-xl text-white font-medium text-[15px] active:bg-[#FE2C55]/25 transition-colors"
              >
                有风险 - 多图
              </button>
              <button 
                onClick={() => selectScenario('video', 'risk')}
                className="w-full py-3.5 bg-[#FE2C55]/15 rounded-xl text-white font-medium text-[15px] active:bg-[#FE2C55]/25 transition-colors"
              >
                有风险 - 视频
              </button>
            </motion.div>
          </div>
        )}

        {/* AI Scanning Laser Effect */}
        {showReviewUI && reviewProgress < 100 && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[32px]">
            <div className="absolute w-full h-[3px] bg-gradient-to-r from-[#00f2fe] via-white to-[#FE2C55] shadow-[0_0_15px_3px_rgba(0,242,254,0.6),0_0_15px_3px_rgba(254,44,85,0.6)] animate-scan" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f2fe]/5 to-[#FE2C55]/5 mix-blend-overlay animate-pulse" />
          </div>
        )}

        {/* Success Celebration Overlay */}
        {showSuccessCelebration && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden rounded-[32px] bg-black/35">
            {/* Celebratory Ribbons */}
            {[...Array(16)].map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const distance = 84 + (i % 4) * 24;
              const tx = Math.cos(angle) * distance;
              const ty = Math.sin(angle) * distance;
              const rot = (i % 2 === 0 ? -1 : 1) * (18 + (i % 5) * 10);
              return (
                <div
                  key={`ribbon-${i}`}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: `${3 + (i % 2)}px`,
                    height: `${16 + (i % 3) * 4}px`,
                    borderRadius: '999px',
                    background: [
                      'linear-gradient(180deg,#00F2EA,#00C2FF)',
                      'linear-gradient(180deg,#FE2C55,#FF6A88)',
                      'linear-gradient(180deg,#FFD84D,#FFAE3D)',
                      'linear-gradient(180deg,#33E6B0,#00C9A7)'
                    ][i % 4],
                    '--tx': `calc(-50% + ${tx.toFixed(1)}px)`,
                    '--ty': `calc(-50% + ${ty.toFixed(1)}px)`,
                    '--rot': `${rot}deg`,
                    animation: `ribbonBurst ${0.72 + (i % 4) * 0.12}s cubic-bezier(0.2,0.8,0.2,1) forwards`,
                    animationDelay: `${(i % 6) * 0.04}s`,
                    opacity: 0,
                  } as React.CSSProperties}
                />
              );
            })}

            {/* Success Card */}
            <div className="w-[74%] max-w-[430px] bg-white rounded-[12px] px-8 pt-[28px] pb-6 flex flex-col items-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] animate-celebrate-pop">
              <div className="relative w-[72px] h-[52px] mb-6">
                <Sparkles size={34} strokeWidth={2.2} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2DD4DD]" />
                <Sparkles size={16} strokeWidth={2.3} className="absolute left-[4px] top-[4px] text-[#26BFF0]" />
                <Sparkles size={14} strokeWidth={2.3} className="absolute left-[14px] bottom-[2px] text-[#3AE6C8]" />
              </div>
              <h3 className="text-[16px] leading-[1.2] font-bold text-black mb-3 tracking-[0.2px]">审查通过</h3>
              <p className="text-[14px] leading-[1.45] text-[#7B7B84] font-medium text-center">内容通过审核，继续发布即可。</p>
            </div>
          </div>
        )}

        {/* Shadow Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent z-0 pointer-events-none" />
        
        {/* Right Sidebar Progressive Shadow */}
        <div 
          className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/30 to-transparent transition-opacity duration-300 pointer-events-none z-0 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
        />
        <div 
          className={`absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-black/70 via-black/30 to-transparent transition-opacity duration-300 pointer-events-none z-0 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Top Bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-12 pb-4 z-30">
          <div className="relative">
            <button 
              onClick={handleBack}
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-90 transition-transform"
            >
              <ChevronLeft size={32} strokeWidth={2} />
            </button>
            
            {/* Back Menu Popup */}
            {showBackMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowBackMenu(false)}
                />
                <div 
                  className="absolute top-full left-0 mt-2 w-[180px] bg-white rounded-[16px] shadow-xl z-50 overflow-hidden transform origin-top-left transition-all duration-200"
                  style={{ animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <style>{`
                    @keyframes popIn {
                      from { opacity: 0; transform: scale(0.95); }
                      to { opacity: 1; transform: scale(1); }
                    }
                  `}</style>
                  <button 
                    onClick={() => {
                      setShowBackMenu(false);
                      if (isReviewing) {
                        setIsReviewing(false);
                        setShowReviewUI(false);
                        setReviewProgress(0);
                      }
                      setCurrentView('home');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 text-[#FE2C55] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <Trash2 size={22} strokeWidth={1.5} />
                    <span className="text-[16px] font-medium">放弃</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowBackMenu(false);
                      if (isReviewing) {
                        setShowReviewUI(false);
                      }
                      setCurrentView('home');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 text-black hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <Archive size={22} strokeWidth={1.5} />
                    <span className="text-[16px] font-medium">保存草稿</span>
                  </button>
                  <button 
                    onClick={() => setShowBackMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-4 text-black hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <Send size={22} strokeWidth={1.5} />
                    <span className="text-[16px] font-medium">发送给好友</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={`flex items-center h-10 bg-[#1A1C22]/95 rounded-full pl-3.5 ${contentType === 'video' ? 'pr-3.5' : 'pr-2.5'} cursor-pointer active:scale-95 transition-transform`}>
            <Music size={16} strokeWidth={2.2} className="text-white mr-2" />
            <span className="text-[13px] font-[800] tracking-wide text-white">{contentType === 'video' ? '添加音乐' : 'STOLEN LOVE'}</span>
            {contentType !== 'video' && (
              <>
                <div className="w-px h-6 bg-white/18 mx-2.5" />
                <X size={19} strokeWidth={2.2} className="text-white/90" />
              </>
            )}
          </div>

          <button className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-90 transition-transform">
            <img 
              src="/assets/icons/tools/settings.png" 
              alt="Settings"
              className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="absolute top-[100px] right-4 flex flex-col items-end z-10">
          <button className="flex flex-col items-center mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-90 transition-transform">
            <img 
              src="/assets/icons/tools/share.png" 
              alt="Share"
                className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
          </button>

            <div className="w-4 h-[1px] bg-white/50 mb-4 drop-shadow-md" />
          
          <div className="flex flex-col items-end">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                className={`flex items-center justify-end cursor-pointer transition-all duration-300 overflow-hidden
                    ${!isExpanded && tool.hiddenCollapsed ? 'h-0 opacity-0 mb-0' : 'h-8 opacity-100 mb-4'}`}
              >
                <span 
                  className={`text-[13px] font-semibold mr-2 transition-all duration-300 whitespace-nowrap
                    ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none absolute right-10'}`}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {tool.label}
                </span>
                <div className="flex items-center justify-center w-7 h-7 shrink-0 hover:scale-110 active:scale-90 transition-transform">
                  {tool.imageUrl ? (
                    <img 
                      src={tool.imageUrl} 
                      alt={tool.label}
                      className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
                    />
                  ) : (
                    <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {tool.icon}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div 
              className="flex items-center justify-end cursor-pointer transition-all duration-300 h-8" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center w-7 h-7 hover:scale-110 active:scale-90 transition-transform">
                {isExpanded ? <ChevronUp size={28} strokeWidth={2} /> : <ChevronDown size={28} strokeWidth={2} />}
              </div>
            </div>
          </div>
        </div>

        {/* AI Review Row */}
        <div className={`absolute ${contentType === 'multi' ? 'bottom-[160px]' : 'bottom-[100px]'} inset-x-4 flex gap-3 items-center justify-end z-40 pointer-events-none transition-all duration-300`}>
          {/* AI Review On-Screen Feedback */}
          {showReviewUI && (
            <div className="flex-1 flex items-center min-h-[56px] animate-fade-in-right pointer-events-auto">
              <style>{`
                @keyframes fadeInRight {
                  from { opacity: 0; transform: translateX(10px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right {
                  animation: fadeInRight 0.3s ease-out forwards;
                }
              `}</style>
              
              {/* Real-time feedback compact card */}
              <div
                className="relative w-full rounded-2xl border border-white/10 shadow-2xl px-4 py-2.5 flex flex-col justify-center gap-2"
                style={{
                  backgroundColor: 'rgba(22, 24, 35, 0.8)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)'
                }}
              >
                  <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <div className={`${reviewProgress < 100 ? 'animate-pulse text-[#00f2fe]' : 'text-[#00D27A]'} scale-90 origin-left`}>
                      {currentStepIcon}
                    </div>
                    <span className="font-medium text-[13px] whitespace-nowrap">{currentStepText}</span>
                  </div>
                  <span className="text-[13px] font-mono text-white/90">{Math.floor(reviewProgress)}%</span>
                </div>

                {/* Progress Bars: only display enabled checks */}
                <div className="flex flex-col gap-1.5">
                  {enabledReviewItems.map((item, index) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <span className="w-8 text-[10px] text-white/70 leading-none">{item.label.slice(0, 2)}</span>
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00f2fe] to-[#FE2C55] transition-all duration-75 ease-linear rounded-full"
                          style={{ width: `${getReviewItemProgress(index)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Review Button */}
          <div className="w-[42px] shrink-0 flex justify-center pointer-events-auto">
            <button 
              onClick={() => {
                if (!isReviewing) {
                  setShowAIPopup(true);
                }
              }}
              className={`flex flex-col items-center justify-center transition-transform relative ${isReviewing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              <div className="flex items-center justify-center gap-1 mb-1 h-[28px] relative">
                <div className="w-[16px] h-[16px] rounded-full bg-[#20D5EC] flex items-center justify-center shadow-[0_0_8px_rgba(32,213,236,0.8)]">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#333333]"></div>
                </div>
                <div className="w-[16px] h-[16px] rounded-full bg-[#FE2C55] flex items-center justify-center shadow-[0_0_8px_rgba(254,44,85,0.8)]">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#333333]"></div>
                </div>
                {/* AI Tag */}
                <div className="absolute -top-1.5 -right-3.5 bg-gray-500/50 backdrop-blur-sm rounded-[4px] px-1 py-[2px] border border-white/10 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white leading-none tracking-wider">AI</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Multi-image indicator */}
        {contentType === 'multi' && (
          <div className="absolute bottom-[102px] inset-x-0 z-30 pointer-events-auto px-2">
            <div ref={editorThumbnailViewportRef} className="w-full overflow-hidden">
              <div
                ref={editorThumbnailTrackRef}
                className="w-max flex items-end justify-center gap-[6px] px-1 transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${editorThumbnailOffsetX}px)` }}
              >
                <div className="w-10 h-10 rounded-[12px] bg-[#1A1C22]/95 flex items-center justify-center mb-1 shrink-0">
                  <div className="grid grid-cols-2 gap-[2px]">
                    {[...Array(4)].map((_, i) => (
                      <span key={i} className="w-[5px] h-[5px] rounded-[1px] border border-white/95" />
                    ))}
                  </div>
                </div>

                {multiImages.map((img, idx) => {
                  const isActive = currentImageIndex === idx;
                  return (
                    <div key={idx} className="relative flex flex-col items-center justify-end h-[64px] shrink-0">
                      {isActive && (
                        <motion.div layoutId="active-chevron" className="absolute -top-[2px]">
                          <FlatChevronUpIcon className="text-white drop-shadow-md" />
                        </motion.div>
                      )}
                      <div
                        onClick={() => handleThumbnailClick(idx)}
                        data-thumb-index={idx}
                        className={`rounded-[12px] overflow-hidden transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'w-12 h-12 border-[2px] border-white'
                            : 'w-10 h-10 border border-transparent opacity-60 mb-1'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  );
                })}

                <div className="w-10 h-10 rounded-[12px] bg-[#1A1C22]/95 flex items-center justify-center mb-1 shrink-0">
                  <Plus size={22} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-8 inset-x-4 flex space-x-3 z-10 h-[48px]">
          <button className="flex-1 flex items-center justify-center h-full bg-white text-black rounded-full px-1 font-semibold text-[14px] shadow-lg active:scale-95 transition-transform">
            <div className="relative w-[30px] h-[30px] mr-1.5 shrink-0">
              <div className="absolute left-1/2 top-1/2 w-[30px] h-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe]" />
              <div className="absolute left-1/2 top-1/2 w-[24px] h-[24px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white" />
              <div className="absolute left-1/2 top-1/2 w-[20px] h-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=47" alt="avatar" className="w-full h-full object-cover object-center block" />
              </div>
            </div>
            <span className="tracking-tight">你的限时动态</span>
          </button>
          <button 
            onClick={() => {
              if (!isReviewing) {
                setCurrentView('publish');
              }
            }}
            className={`flex-1 flex items-center justify-center h-full rounded-full font-semibold text-[15px] shadow-lg tracking-wide transition-all ${
              isReviewing 
                ? 'bg-[#FE2C55]/50 text-white/70 cursor-not-allowed' 
                : 'bg-[#FE2C55] text-white active:scale-95'
            }`}
          >
            {isReviewing ? '审查中...' : '下一步'}
          </button>
        </div>

        {/* AI Review Popup */}
        {showAIPopup && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAIPopup(false)}
            />
            
            {/* Popup Content */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-[#161823]/80 backdrop-blur-[20px] rounded-t-2xl px-5 pt-4 pb-7 text-white shadow-2xl"
            >
              <div className="relative flex items-center justify-center mb-3">
                <h2 className="text-[18px] font-[700] tracking-tight">AI 审查</h2>
                <button 
                  onClick={() => setShowAIPopup(false)}
                  className="absolute right-0 p-1.5 active:opacity-70 transition-opacity"
                >
                  <X size={18} className="text-white/80" />
                </button>
              </div>

              <div className="h-[1px] bg-white/10 -mx-5 mb-4" />

              <div className="flex flex-col gap-4 mb-5">
                {reviewItems.map((item) => {
                  const enabled = reviewChecks[item.key];
                  return (
                    <div key={item.key} className="flex items-start gap-3 py-1">
                      <div className="shrink-0 mt-0.5">
                        {renderReviewIcon(item.key, 20, 1.8)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold mb-0.5 leading-none">{item.label}</h3>
                        <p className="text-[13px] text-white/60 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleReviewCheck(item.key)}
                        className={`relative w-9 h-5 p-[2px] rounded-full shrink-0 self-start mt-0.5 transition-colors ${enabled ? 'bg-[#2FD1E9]' : 'bg-white/25'}`}
                        aria-label={`${item.label}开关`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mb-5">
                <div className="flex items-start gap-2 text-[11px] text-white/40 leading-relaxed">
                  <Volume2 size={12} strokeWidth={2} className="text-white/50 shrink-0 mt-[2px]" />
                  <p>
                    声明：本功能帮助你在发布前主动发现常见风险，不代替平台的正式审核流程。平台审核以实际发布后的结果为准。
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    if (enabledReviewItems.length === 0) {
                      return;
                    }
                    setShowAIPopup(false);
                    startReview();
                  }}
                  className={`w-full py-3.5 rounded-full font-semibold text-[15px] transition-colors ${enabledReviewItems.length === 0 ? 'bg-[#FE2C55]/40 text-white/60 cursor-not-allowed' : 'bg-[#FE2C55] text-white active:bg-[#FE2C55]/90'}`}
                >
                  开始检测
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Risk Popup */}
        {showRiskPopup && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRiskPopup(false)}
            />
            
            {/* Popup Content */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-[#161823]/80 backdrop-blur-[20px] rounded-t-2xl px-5 pt-4 pb-7 text-white shadow-2xl"
            >
              <div className="relative flex items-center justify-center mb-3">
                <h2 className="text-[18px] font-[700] tracking-tight">发现风险项</h2>
                <button 
                  onClick={() => setShowRiskPopup(false)}
                  className="absolute right-0 p-1.5 active:opacity-70 transition-opacity"
                >
                  <X size={18} className="text-white/80" />
                </button>
              </div>

              <div className="h-[1px] bg-white/10 -mx-5 mb-4" />

              <div className="flex flex-col gap-4 mb-5">
                <div className="flex items-start gap-3 py-3 px-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-[#FE2C55]/20 flex items-center justify-center">
                      <Volume2 size={16} className="text-[#FE2C55]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold mb-0.5 leading-none">音乐版权受区域限制</h3>
                    <p className="text-[13px] text-white/60 leading-relaxed">部分地区用户无法收听</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-3 px-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-[#FE2C55]/20 flex items-center justify-center">
                      <FileText size={16} className="text-[#FE2C55]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold mb-0.5 leading-none">视频中文字含敏感词</h3>
                    <p className="text-[13px] text-white/60 leading-relaxed">「精神健康」类话题限制分发</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowRiskPopup(false);
                  setCurrentView('fix');
                  setFixStep(1);
                  setIsAllFixed(false);
                }}
                className="w-full py-3.5 rounded-full font-semibold text-[15px] bg-[#FE2C55] text-white active:bg-[#FE2C55]/90 transition-colors"
              >
                去修复
              </button>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
