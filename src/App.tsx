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
  Hash,
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
  Grid,
  ArrowRight,
  Check,
  Edit2,
  RefreshCw,
  AlertCircle,
  Type,
  Video,
  Play,
  Pause
} from 'lucide-react';

export default function App() {
  type ReviewOutcome = 'safe' | 'risk';
  type ContentType = 'single' | 'multi' | 'video';

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
  const [fixStep, setFixStep] = useState(1);
  const [isAllFixed, setIsAllFixed] = useState(false);
  const [showPublishWarning, setShowPublishWarning] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<ReviewOutcome | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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

  const selectScenario = (nextType: ContentType, nextOutcome: ReviewOutcome) => {
    setContentType(nextType);
    setSelectedOutcome(nextOutcome);
    setReviewResult(null);
    setCurrentImageIndex(0);
    setIsPlaying(false);
  };

  const tools = [
    { id: 'edit', icon: <MonitorPlay size={26} strokeWidth={1.5} />, label: '编辑' },
    { id: 'template', icon: <Copy size={26} strokeWidth={1.5} />, label: '模板' },
    { id: 'text', icon: <span className="font-semibold text-[22px] leading-none">Aa</span>, label: '文本' },
    { id: 'sticker', icon: <Sticker size={26} strokeWidth={1.5} />, label: '贴纸' },
    { id: 'effects', icon: <Sparkles size={26} strokeWidth={1.5} />, label: '特效' },
    { id: 'filters', icon: <Aperture size={26} strokeWidth={1.5} />, label: '滤镜' },
    { id: 'voice', icon: <Mic size={26} strokeWidth={1.5} />, label: '声音', hiddenCollapsed: true },
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

  const startReview = () => {
    setIsReviewing(true);
    setShowReviewUI(true);
    setReviewProgress(0);
    setReviewResult(selectedOutcome ?? 'safe');
  };

  const handleBack = () => {
    setShowBackMenu(!showBackMenu);
  };

  const timeLeft = Math.ceil(6 * (1 - reviewProgress / 100));

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
  if (reviewProgress < 25) {
    currentStepText = "视觉画面分析中...";
    currentStepIcon = <Eye size={20} />;
  } else if (reviewProgress < 50) {
    currentStepText = "音频轨道检测中...";
    currentStepIcon = <Volume2 size={20} />;
  } else if (reviewProgress < 75) {
    currentStepText = "文本字幕审核中...";
    currentStepIcon = <FileText size={20} />;
  } else if (reviewProgress < 100) {
    currentStepText = "综合风险评估中...";
    currentStepIcon = <Hash size={20} />;
  } else {
    currentStepText = "审查完成，无违规风险";
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
            <button onClick={() => setCurrentView('editor')} className="active:scale-90 transition-transform">
              <ChevronLeft size={28} />
            </button>
            <div className="font-medium text-[15px]">
              {isAllFixed ? '✓ 全部修复完成' : `修复注意项 (${fixStep}/2)`}
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
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Video Preview Container */}
              <div className="flex-1 w-full flex items-center justify-center min-h-0 relative py-2">
                <div className="h-full aspect-[9/16] rounded-[20px] border-[1.5px] border-white/25 bg-black overflow-hidden relative mx-auto">
                  <video 
                    src={activeVideo} 
                    autoPlay={isPlaying} 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play/Pause Overlay */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {!isPlaying ? (
                      <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play size={28} className="text-white ml-1" fill="currentColor" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                        <Pause size={28} className="text-white" fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Warning Overlays */}
                  {!isAllFixed && fixStep === 1 && (
                    <>
                      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-white text-[17px] font-medium whitespace-nowrap drop-shadow-md z-20 pointer-events-none">
                        文案含敏感词
                      </div>
                      <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay pointer-events-none z-10" />
                    </>
                  )}
                  {!isAllFixed && fixStep === 2 && (
                    <>
                      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-white text-[17px] font-medium whitespace-nowrap drop-shadow-md z-20 pointer-events-none">
                        音乐版权受限
                      </div>
                      <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay pointer-events-none z-10" />
                    </>
                  )}
                </div>
              </div>

              {/* Playback Control Bar */}
              <div className="h-[40px] flex items-center px-4 justify-between shrink-0 relative">
                <span className="text-[14px] font-medium text-white/90">00:00/00:03</span>
                <div className="flex items-center gap-4">
                  <button className="active:scale-90 transition-transform">
                    <RefreshCw size={20} className="text-white" />
                  </button>
                  <button className="active:scale-90 transition-transform">
                    <Maximize2 size={20} className="text-white" />
                  </button>
                </div>
              </div>

              {/* 3-Track Timeline Area */}
              <div className="h-[130px] flex flex-col shrink-0 relative overflow-hidden bg-black">
                <style>{`
                  @keyframes moveTracks {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                  }
                `}</style>
                
                {/* Time markers */}
                <div className="h-6 flex items-center relative w-full text-white/50 text-[12px] font-medium">
                  <div className="absolute left-1/2 -translate-x-1/2">00:00</div>
                  <div className="absolute left-[75%] -translate-x-1/2">00:02</div>
                  <div className="absolute left-[100%] -translate-x-1/2">00:04</div>
                </div>

                {/* Time pointer (Fixed in center) */}
                <div className="absolute left-1/2 top-6 bottom-2 w-[2px] bg-white rounded-full z-20 shadow-[0_0_4px_rgba(0,0,0,0.5)] -translate-x-1/2 cursor-ew-resize" />

                {/* Tracks Container (Moves) */}
                <div 
                  className="flex flex-col gap-2 relative h-full w-[200%]"
                  style={{ 
                    animation: 'moveTracks 10s linear infinite',
                    animationPlayState: isPlaying ? 'running' : 'paused'
                  }}
                >
                  {/* Video Track */}
                  <div className="h-[56px] flex overflow-hidden relative ml-[25%] w-[50%]">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex-1 h-full border-r border-black/20 shrink-0 bg-gray-700 rounded-md overflow-hidden mx-[1px]">
                        <img src={activeSingleImage} className="w-full h-full object-cover opacity-80" />
                      </div>
                    ))}
                    {/* Problematic segment */}
                    {!isAllFixed && fixStep === 1 && (
                      <div 
                        className="absolute left-[20%] w-[30%] h-full bg-red-500/30 border-l-2 border-r-2 border-red-500 cursor-pointer"
                        onClick={() => setFixStep(1)}
                      />
                    )}
                  </div>

                  {/* Music Track */}
                  <div 
                    className={`h-[44px] rounded-lg relative flex items-center px-3 overflow-hidden ml-[25%] w-[50%] cursor-pointer transition-colors ${!isAllFixed && fixStep === 2 ? 'bg-amber-500' : 'bg-[#8B93FF]'}`}
                    onClick={() => setFixStep(2)}
                  >
                    <Music size={16} className="mr-2 shrink-0 text-black/60" />
                    <span className="text-[14px] font-medium text-black/70 truncate z-10">Lazy</span>
                    {/* Waveform */}
                    <div className="absolute inset-0 flex items-center gap-[3px] opacity-20 px-16 overflow-hidden pointer-events-none">
                      {[...Array(40)].map((_, i) => (
                        <div key={i} className="w-1.5 bg-black rounded-full" style={{ height: `${20 + Math.sin(i * 0.5) * 50 + Math.random() * 30}%` }} />
                      ))}
                    </div>
                    {!isAllFixed && fixStep === 2 && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/40 text-[10px] px-2 py-0.5 rounded-b-md text-white">
                        受限地区
                      </div>
                    )}
                  </div>

                  {/* Text Track */}
                  <div className="h-[44px] bg-[#F4A8E6] rounded-lg relative flex items-center px-3 overflow-hidden ml-[25%] w-[50%]">
                    <span className="text-[14px] font-medium text-black/70 truncate">新年快乐</span>
                    {!isAllFixed && fixStep === 1 && (
                      <div 
                        className="absolute left-[20%] w-[30%] h-full border-2 border-red-500 bg-red-500/20 flex items-center px-1 cursor-pointer"
                        onClick={() => setFixStep(1)}
                      >
                        <AlertCircle size={14} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hint Box (Video) */}
              <div className="px-4 py-2 shrink-0">
                {!isAllFixed && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle size={16} className="text-[#FE2C55] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[12px] text-white/90">
                        {fixStep === 1 ? '文案含敏感词：「减肥」类话题限制分发' : '音乐在部分地区版权受限'}
                      </p>
                    </div>
                    <button className="text-[10px] text-white/50 whitespace-nowrap flex items-center">
                      查看准则 <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Toolbar */}
              <div className="h-[65px] flex items-center justify-around px-2 shrink-0 border-t border-white/10">
                {!isAllFixed ? (
                  <button onClick={() => {
                    if (fixStep === 1) setFixStep(2);
                    else if (fixStep === 2) setShowMusicSelector(true);
                    else setIsAllFixed(true);
                  }} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
                    <Wand2 size={24} className="text-[#00f2fe]" />
                    <span className="text-[10px] text-[#00f2fe]">一键修复</span>
                  </button>
                ) : (
                  <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
                    <Edit2 size={24} className="text-white" />
                    <span className="text-[10px] text-white/80">编辑</span>
                  </button>
                )}
                <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
                  <Music size={24} className="text-white" />
                  <span className="text-[10px] text-white/80">音乐</span>
                </button>
                <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
                  <Type size={24} className="text-white" />
                  <span className="text-[10px] text-white/80">文本</span>
                </button>
                <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
                  <Wand2 size={24} className="text-white" />
                  <span className="text-[10px] text-white/80">特效</span>
                </button>
                <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
                  <Sparkles size={24} className="text-white" />
                  <span className="text-[10px] text-white/80">魔法</span>
                </button>
              </div>
            </div>
          ) : (
            // Image Layout (Single/Multi)
            <div className="flex-1 flex flex-col items-center pt-4 px-4 pb-8">
              {/* Media Viewport Container */}
              <div className="w-[60%] h-[45%] border border-white/20 rounded-2xl overflow-hidden bg-black flex items-center justify-center shrink-0">
                <img 
                  src={contentType === 'multi' ? multiImages[currentImageIndex] : activeSingleImage} 
                  className="w-full h-full object-contain"
                  alt="Media"
                />
              </div>

              {/* Bottom Tool Area */}
              <div className="w-full mt-6 flex flex-col gap-4 flex-1">
                {/* Hint Box */}
                {!isAllFixed && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle size={16} className="text-[#FE2C55] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[12px] text-white/90">
                        {fixStep === 1 ? '画面内容检测到可能违反「安全与礼貌」准则' : '文案含敏感词：「减肥」类话题限制分发'}
                      </p>
                    </div>
                    <button className="text-[10px] text-white/50 whitespace-nowrap flex items-center">
                      查看准则 <ChevronRight size={12} />
                    </button>
                  </div>
                )}

                {/* Thumbnails */}
                {contentType === 'multi' && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                    {multiImages.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 relative ${
                          idx === currentImageIndex ? 'border-2 border-white' : 'opacity-60'
                        } ${!isAllFixed && fixStep === 1 && idx === 0 ? 'border-2 border-[#FE2C55] opacity-100' : ''}`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                {contentType === 'single' && (
                  <div className="flex gap-2 py-1">
                    <div className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 relative border-2 ${!isAllFixed && fixStep === 1 ? 'border-[#FE2C55]' : 'border-white'}`}>
                      <img src={activeSingleImage} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Toolbars */}
                {!isAllFixed && (
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => {
                      if (fixStep === 1) setFixStep(2);
                      else setIsAllFixed(true);
                    }} className="flex-1 aspect-square bg-[#252525] rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                      <Wand2 size={24} className="text-[#00f2fe]" />
                      <span className="text-[11px] text-white/80">一键修复</span>
                    </button>
                    <button className="flex-1 aspect-square bg-[#252525] rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                      <Edit2 size={24} className="text-white/80" />
                      <span className="text-[11px] text-white/80">编辑</span>
                    </button>
                    <button className="flex-1 aspect-square bg-[#252525] rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                      <RefreshCw size={24} className="text-white/80" />
                      <span className="text-[11px] text-white/80">替换</span>
                    </button>
                    <button className="flex-1 aspect-square bg-[#252525] rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                      <Trash2 size={24} className="text-white/80" />
                      <span className="text-[11px] text-white/80">删除</span>
                    </button>
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
                      文案含敏感词：「减肥」类话题限制分发
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
        {/* Media Container with proper spacing */}
        <div className={`flex-1 flex items-center justify-center overflow-hidden ${contentType === 'multi' ? 'mt-[122px] mb-[166px]' : contentType === 'video' ? 'mt-[122px] mb-[136px]' : 'mt-[122px] mb-[136px]'}`}>
          {contentType === 'video' ? (
            <video 
              src={activeVideo} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-contain"
            />
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
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden rounded-[32px]">
            {/* Confetti Particles */}
            {[...Array(40)].map((_, i) => {
              const isCircle = i % 3 === 0;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10%',
                    width: isCircle ? '8px' : '6px',
                    height: isCircle ? '8px' : '16px',
                    borderRadius: isCircle ? '50%' : '2px',
                    backgroundColor: ['#FE2C55', '#00f2fe', '#00D27A', '#FFD700', '#FF9900', '#A200FF'][i % 6],
                    animation: `confettiFall ${1.5 + Math.random() * 2}s linear forwards`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              );
            })}
            
            {/* Success Card */}
            <div className="bg-black/45 backdrop-blur-sm border border-[#00D27A]/40 rounded-[28px] px-8 py-6 flex flex-col items-center shadow-[0_0_50px_rgba(0,210,122,0.2)] animate-celebrate-pop">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00D27A]/30 to-[#00D27A]/10 rounded-full flex items-center justify-center mb-4 shadow-inner border border-[#00D27A]/50">
                <Sparkles size={32} className="text-[#00D27A]" />
              </div>
              <h3 className="text-[20px] font-bold text-white mb-2 tracking-wide">审查通过</h3>
              <p className="text-[14px] text-white/80 font-medium">审查通过快去发布吧！🎉</p>
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

          <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 drop-shadow-md cursor-pointer active:scale-95 transition-transform">
            <Music size={14} className="mr-1.5" />
            <span className="text-[13px] font-semibold tracking-wide mr-2">STOLEN LOVE</span>
            <X size={14} className="opacity-80" />
          </div>

          <button className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-90 transition-transform">
            <Settings size={28} strokeWidth={2} />
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="absolute top-[100px] right-4 flex flex-col items-end z-10">
          <button className="flex flex-col items-center mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-90 transition-transform">
            <Share size={28} strokeWidth={2} />
          </button>

          <div className="w-4 h-[1px] bg-white/50 mb-5 drop-shadow-md" />
          
          <div className="flex flex-col items-end">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                className={`flex items-center justify-end cursor-pointer transition-all duration-300 overflow-hidden
                  ${!isExpanded && tool.hiddenCollapsed ? 'h-0 opacity-0 mb-0' : 'h-8 opacity-100 mb-5'}`}
              >
                <span 
                  className={`text-[13px] font-semibold mr-2 transition-all duration-300 whitespace-nowrap
                    ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none absolute right-10'}`}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {tool.label}
                </span>
                <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center w-8 h-8 shrink-0 hover:scale-110 active:scale-90 transition-transform">
                  {tool.icon}
                </div>
              </div>
            ))}
            
            <div 
              className="flex items-center justify-end cursor-pointer transition-all duration-300 h-8" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center w-8 h-8 hover:scale-110 active:scale-90 transition-transform">
                {isExpanded ? <ChevronUp size={28} strokeWidth={2} /> : <ChevronDown size={28} strokeWidth={2} />}
              </div>
            </div>
          </div>
        </div>

        {/* AI Review Row */}
        <div className={`absolute ${contentType === 'multi' ? 'bottom-[160px]' : 'bottom-[100px]'} inset-x-4 flex gap-3 items-center justify-end z-40 pointer-events-none transition-all duration-300`}>
          {/* AI Review On-Screen Feedback */}
          {showReviewUI && (
            <div className="flex-1 flex items-center h-[56px] animate-fade-in-right pointer-events-auto">
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
              <div className="w-full bg-black/60 backdrop-blur-xl rounded-2xl px-4 py-2.5 border border-white/10 shadow-2xl flex flex-col justify-center gap-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <div className={`${reviewProgress < 100 ? 'animate-pulse text-[#00f2fe]' : 'text-[#00D27A]'} scale-90 origin-left`}>
                      {currentStepIcon}
                    </div>
                    <span className="font-medium text-[13px] whitespace-nowrap">{currentStepText}</span>
                  </div>
                  <span className="text-[13px] font-mono text-white/90">{Math.floor(reviewProgress)}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00f2fe] to-[#FE2C55] transition-all duration-75 ease-linear rounded-full"
                    style={{ width: `${reviewProgress}%` }}
                  />
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
          <div className="absolute bottom-[90px] inset-x-0 flex justify-center items-end gap-3 z-30 pointer-events-auto">
            {/* Grid Icon */}
            <div className="w-10 h-10 rounded-[10px] bg-black/50 backdrop-blur-md flex items-center justify-center mb-1">
              <Grid size={20} className="text-white" />
            </div>
            
            {/* Thumbnails */}
            <div className="flex items-end gap-2">
              {multiImages.map((img, idx) => {
                const isActive = currentImageIndex === idx;
                return (
                  <div key={idx} className="relative flex flex-col items-center justify-end h-[64px]">
                    {isActive && (
                      <motion.div layoutId="active-chevron" className="absolute top-0">
                        <ChevronUp size={16} className="text-white drop-shadow-md" strokeWidth={4} />
                      </motion.div>
                    )}
                    <div 
                      onClick={() => handleThumbnailClick(idx)}
                      className={`rounded-[10px] overflow-hidden transition-all duration-300 cursor-pointer ${
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
            </div>

            {/* Plus Icon */}
            <div className="w-10 h-10 rounded-[10px] bg-black/50 backdrop-blur-md flex items-center justify-center mb-1">
              <Plus size={22} className="text-white" />
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-8 inset-x-4 flex space-x-3 z-10 h-[48px]">
          <button className="flex-1 flex items-center justify-center h-full bg-white text-black rounded-full px-1 font-semibold text-[14px] shadow-lg active:scale-95 transition-transform">
            <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] mr-1.5 shrink-0">
              <img src="https://i.pravatar.cc/150?img=47" alt="avatar" className="w-full h-full rounded-full border border-white object-cover" />
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
              className="relative bg-[#161823]/80 backdrop-blur-[20px] rounded-t-2xl px-5 pt-6 pb-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-[700] tracking-tight">AI 审查</h2>
                <button 
                  onClick={() => setShowAIPopup(false)}
                  className="p-1.5 active:opacity-70 transition-opacity"
                >
                  <X size={18} className="text-white/80" />
                </button>
              </div>

              <div className="flex flex-col mb-6">
                <div className="flex items-center gap-4 py-4 border-b border-white/10">
                  <div className="shrink-0">
                    <Eye size={24} strokeWidth={1.5} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold mb-0.5">视觉内容</h3>
                    <p className="text-[13px] text-white/60">检测画面中的违规元素</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-4 border-b border-white/10">
                  <div className="shrink-0">
                    <Volume2 size={24} strokeWidth={1.5} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold mb-0.5">音频轨道</h3>
                    <p className="text-[13px] text-white/60">识别版权限制与违规声音</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-4 border-b border-white/10">
                  <div className="shrink-0">
                    <FileText size={24} strokeWidth={1.5} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold mb-0.5">文字内容</h3>
                    <p className="text-[13px] text-white/60">扫描字幕与文案中的敏感词</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <p className="text-[13px] text-white/60 leading-relaxed">
                  审查可能需要几分钟。较长视频可先返回，存草稿后台检测。
                </p>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  声明：本功能帮助你在发布前主动发现常见风险，不代替平台的正式审核流程。平台审核以实际发布后的结果为准。
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowAIPopup(false);
                    startReview();
                  }}
                  className="w-full py-3.5 rounded-full font-semibold text-[15px] bg-[#FE2C55] text-white active:bg-[#FE2C55]/90 transition-colors"
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
              className="relative bg-[#161823]/95 backdrop-blur-[20px] rounded-t-2xl px-5 pt-4 pb-8 text-white shadow-2xl"
            >
              {/* Drag Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-[700] tracking-tight">发现注意项</h2>
                <button 
                  onClick={() => setShowRiskPopup(false)}
                  className="p-1.5 active:opacity-70 transition-opacity bg-white/10 rounded-full"
                >
                  <X size={16} className="text-white/80" />
                </button>
              </div>

              <p className="text-[14px] text-white/80 mb-6 leading-relaxed">
                发现2个注意项，建议修复后发布，以免影响分发
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-[#FE2C55]/20 flex items-center justify-center">
                      <Volume2 size={16} className="text-[#FE2C55]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold mb-1">音乐版权受区域限制</h3>
                    <p className="text-[12px] text-white/60 leading-relaxed">部分地区用户无法收听</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-[#FE2C55]/20 flex items-center justify-center">
                      <FileText size={16} className="text-[#FE2C55]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold mb-1">文案含敏感词</h3>
                    <p className="text-[12px] text-white/60 leading-relaxed">「减肥」类话题限制分发</p>
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
