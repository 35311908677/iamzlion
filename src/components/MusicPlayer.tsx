import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX,
  SkipForward, SkipBack, Disc3, Heart,
  List, Shuffle, Repeat, X
} from 'lucide-react';

// 歌曲列表 - 真实歌名
const TRACK_LIST = [
  { file: '234087980.mp3', name: '我们俩', artist: '未知歌手' },
  { file: '3523954469.mp3', name: '夏天的风', artist: '未知歌手' },
  { file: '552956062.mp3', name: '多幸运', artist: '未知歌手' },
  { file: 'M8000009TIka3l8J6p.mp3', name: 'lemon', artist: '未知歌手' },
  { file: 'M800000ilBSL2DLpGi.mp3', name: '爱我还是他', artist: '未知歌手' },
  { file: 'M800000r7I6R3VjL8c.mp3', name: '把回忆拼好给你', artist: '未知歌手' },
  { file: 'M800000rGOC128oAe8.mp3', name: '绿色', artist: '未知歌手' },
  { file: 'M8000015GMPA1rCZO5.mp3', name: '悬溺', artist: '未知歌手' },
  { file: 'M800001EVRsh3kfSIG.mp3', name: '可不可以', artist: '未知歌手' },
  { file: 'M800002cjEhn44AZ3y.mp3', name: '红色高跟鞋', artist: '未知歌手' },
  { file: 'M800002dOqLZ3Effbw.mp3', name: '可惜没如果', artist: '未知歌手' },
  { file: 'M800002IgYHQ3ZcHK8.mp3', name: '童话', artist: '未知歌手' },
  { file: 'M800002YnBPF3Ju9EO.mp3', name: '特别的人', artist: '未知歌手' },
  { file: 'M8000038ZxHO15ZToB.mp3', name: '如果可以', artist: '未知歌手' },
  { file: 'M800003Bpqbf422oua.mp3', name: 'loser', artist: '未知歌手' },
  { file: 'M800003mRf8u26lMMY.mp3', name: '恶作剧', artist: '未知歌手' },
  { file: 'M800004D7rhs4dNgN8.mp3', name: '其实', artist: '未知歌手' },
  { file: 'M800004fneUm24gD2c.mp3', name: '爱错', artist: '未知歌手' },
  { file: 'M800004INdnu0H2fok.mp3', name: '最后一页', artist: '未知歌手' },
  { file: 'M800004TXEXY2G2c7C.mp3', name: '江南', artist: '未知歌手' },
];

// 单例音频实例
let audioInstance: HTMLAudioElement | null = null;

const getAudioInstance = (): HTMLAudioElement => {
  if (!audioInstance) {
    audioInstance = new Audio();
    audioInstance.preload = 'auto';
  }
  return audioInstance;
};

const MusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const isShuffleRef = useRef(false);
  const isRepeatRef = useRef(false);

  const currentTrack = TRACK_LIST[currentIndex];

  // 保持refs同步
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    isShuffleRef.current = isShuffle;
    isRepeatRef.current = isRepeat;
  }, [currentIndex, isShuffle, isRepeat]);

  // 播放下一首的函数
  const playNextTrack = useCallback(() => {
    const nextIndex = isShuffleRef.current 
      ? Math.floor(Math.random() * TRACK_LIST.length)
      : (currentIndexRef.current + 1) % TRACK_LIST.length;
    setCurrentIndex(nextIndex);
    setProgress(0);
  }, []);

  // 初始化音频实例
  useEffect(() => {
    audioRef.current = getAudioInstance();
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeatRef.current) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNextTrack();
        // 延迟播放，等待新歌曲加载
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
            isPlayingRef.current = true;
          }
        }, 100);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [playNextTrack]);

  // 加载歌曲
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlayingRef.current;
      audioRef.current.src = `/audio/${currentTrack.file}`;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      isPlayingRef.current = false;
    } else {
      audioRef.current.play().catch(() => {});
      isPlayingRef.current = true;
    }
  }, [isPlaying]);

  const playPrev = useCallback(() => {
    const nextIndex = isShuffle 
      ? Math.floor(Math.random() * TRACK_LIST.length)
      : (currentIndex - 1 + TRACK_LIST.length) % TRACK_LIST.length;
    setCurrentIndex(nextIndex);
    setProgress(0);
  }, [currentIndex, isShuffle]);

  const playNext = useCallback(() => {
    const nextIndex = isShuffle 
      ? Math.floor(Math.random() * TRACK_LIST.length)
      : (currentIndex + 1) % TRACK_LIST.length;
    setCurrentIndex(nextIndex);
    setProgress(0);
  }, [currentIndex, isShuffle]);

  const selectTrack = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      isPlayingRef.current = true;
    }
  }, []);

  const toggleLike = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, [volume]);

  const formatTime = (time: number) => 
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

  return (
    <>
      {/* 迷你播放器 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
          <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <Disc3 className="w-7 h-7 text-white" />
          </motion.div>
          {isPlaying && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-gray-900" />}
        </div>
      </motion.button>

      {/* 播放器面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-4 z-50 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* 顶部 */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-[10px] text-gray-400">{isPlaying ? '正在播放' : '已暂停'}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* 专辑封面 */}
            <div className="px-4 py-4 text-center">
              <motion.div 
                className="w-20 h-20 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg"
                animate={{ scale: isPlaying ? 1.02 : 1 }}
              >
                <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <Disc3 className="w-12 h-12 text-white/80" />
                </motion.div>
              </motion.div>
              <h3 className="text-sm font-bold text-white truncate">{currentTrack.name}</h3>
              <p className="text-[10px] text-gray-500">{currentTrack.artist}</p>
            </div>

            {/* 进度条 */}
            <div className="px-4 pb-2">
              <div className="relative h-1 bg-white/10 rounded-full">
                <div className="absolute h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: `${duration ? (progress/duration)*100 : 0}%` }} />
                <input type="range" min={0} max={duration||100} value={progress} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* 控制 */}
            <div className="flex items-center justify-center gap-2 px-4 pb-3">
              <button onClick={() => setIsShuffle(!isShuffle)} className={`p-1.5 ${isShuffle ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
                <Shuffle className="w-3.5 h-3.5" />
              </button>
              <button onClick={playPrev} className="p-1.5 text-gray-400 hover:text-white">
                <SkipBack className="w-4 h-4" />
              </button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={togglePlay} className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                {isPlaying ? <Pause className="w-4 h-4 text-gray-900" /> : <Play className="w-4 h-4 text-gray-900 ml-0.5" />}
              </motion.button>
              <button onClick={playNext} className="p-1.5 text-gray-400 hover:text-white">
                <SkipForward className="w-4 h-4" />
              </button>
              <button onClick={() => setIsRepeat(!isRepeat)} className={`p-1.5 ${isRepeat ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 音量 */}
            <div className="flex items-center gap-2 px-4 pb-3">
              <button onClick={() => handleVolumeChange({ target: { value: String(volume === 0 ? 0.7 : 0) } } as any)} className="p-0.5 text-gray-500 hover:text-white">
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1 h-0.5 bg-white/10 rounded-full relative">
                <div className="absolute h-full bg-gray-400 rounded-full" style={{ width: `${volume*100}%` }} />
                <input type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolumeChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            {/* 播放列表 */}
            <div className="border-t border-white/10">
              <button onClick={() => setShowPlaylist(!showPlaylist)} className="w-full px-3 py-2 flex items-center justify-between hover:bg-white/5 transition-colors">
                <span className="text-[10px] text-gray-400">播放列表 ({TRACK_LIST.length})</span>
                <List className="w-3.5 h-3.5 text-gray-500" />
              </button>
              
              <AnimatePresence>
                {showPlaylist && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="max-h-32 overflow-y-auto">
                    <div className="px-2 pb-2 space-y-0.5">
                      {TRACK_LIST.map((track, idx) => (
                        <div key={track.file} onClick={() => selectTrack(idx)} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer ${idx === currentIndex ? 'bg-violet-500/20' : 'hover:bg-white/5'}`}>
                          <span className="text-[9px] w-4 text-gray-500">{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[11px] truncate ${idx === currentIndex ? 'text-white font-medium' : 'text-gray-400'}`}>{track.name}</div>
                          </div>
                          <button onClick={(e) => toggleLike(idx, e)} className={`p-0.5 ${likedTracks.has(idx) ? 'text-pink-500' : 'text-gray-600 hover:text-pink-400'}`}>
                            <Heart className={`w-3 h-3 ${likedTracks.has(idx) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;