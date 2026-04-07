import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { ArrowRight, Mail, Instagram, Twitter, Github, ChevronDown, ExternalLink, X, ArrowLeft, Play, Maximize2, Cpu, Globe, Layers, Zap, Activity, Dna, Bot, Leaf } from 'lucide-react';
import { PROJECTS, SKILLS, Project } from './constants';
import MatrixBackground from './components/MatrixBackground';
import DisplacementEffect from './components/DisplacementEffect';
import AIChatWidget from './components/AIChatWidget';
import MusicPlayer from './components/MusicPlayer';
import EnergyTrail from './components/EnergyTrail';

const VoidCrack = ({ isHovered, mouseX, mouseY }: { isHovered: boolean, mouseX: number, mouseY: number }) => {
  const [cracks, setCracks] = useState<{ id: number, points: string, opacity: number }[]>([]);

  useEffect(() => {
    if (!isHovered) {
      setCracks([]);
      return;
    }

    const interval = setInterval(() => {
      const newCrack = {
        id: Math.random(),
        points: generatePoints(mouseX, mouseY),
        opacity: 0.8
      };
      setCracks(prev => [...prev.slice(-5), newCrack]);
    }, 150);

    return () => clearInterval(interval);
  }, [isHovered, mouseX, mouseY]);

  const generatePoints = (x: number, y: number) => {
    let points = `${x},${y}`;
    let curX = x;
    let curY = y;
    for (let i = 0; i < 5; i++) {
      curX += (Math.random() - 0.5) * 100;
      curY += (Math.random() - 0.5) * 100;
      points += ` ${curX},${curY}`;
    }
    return points;
  };

  return (
    <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full overflow-visible">
      {cracks.map(crack => (
        <motion.polyline
          key={crack.id}
          points={crack.points}
          fill="none"
          stroke="rgba(0, 242, 255, 0.6)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0.8 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
};

interface NeonLinkProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  rel?: string;
  key?: React.Key;
}

// 视频懒加载组件
const LazyVideo = ({ video }: { video: { title: string; bvid: string; desc: string; tag: string } }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white/[0.02] border border-white/5 overflow-hidden"
    >
      <div className="aspect-video relative overflow-hidden bg-black">
        {!isLoaded ? (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gradient-to-br from-gray-900 to-black"
            onClick={() => setIsLoaded(true)}
          >
            <div className="text-center">
              <motion.div 
                className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-3 border border-neon-blue/40"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 242, 255, 0.3)' }}
              >
                <Play className="w-6 h-6 text-neon-blue ml-1" />
              </motion.div>
              <p className="text-[10px] tracking-widest text-gray-500 uppercase">点击播放</p>
            </div>
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-br from-neon-blue/10 to-neon-purple/10" />
            </div>
          </div>
        ) : (
          <iframe 
            src={`//player.bilibili.com/player.html?bvid=${video.bvid}&page=1&high_quality=1&danmaku=0&autoplay=1`} 
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[8px] tracking-widest text-neon-blue uppercase font-mono">{video.tag}</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">{video.title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{video.desc}</p>
      </div>
    </motion.div>
  );
};

const NeonLink = ({ children, href, className = "", onClick, target, rel }: NeonLinkProps) => (
  <motion.a
    href={href}
    onClick={onClick}
    target={target}
    rel={rel}
    className={`relative inline-block cursor-pointer transition-colors duration-300 hover:text-neon-blue group ${className}`}
    whileHover={{ scale: 1.02 }}
  >
    {children}
    <motion.span
      className="absolute -bottom-1 left-0 h-[1px] w-0 bg-neon-blue transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_8px_#00f2ff]"
    />
    <motion.span
      className="absolute -inset-2 opacity-0 group-hover:opacity-100 pointer-events-none"
      initial={false}
    >
      {[...Array(3)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-neon-blue"
          animate={{
            x: [0, (i - 1) * 20],
            y: [0, (i - 1) * -10],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
          style={{
            left: '50%',
            top: '50%'
          }}
        />
      ))}
    </motion.span>
  </motion.a>
);

const SectionTitle = ({ title, id, subtitle }: { title: string, id: string, subtitle?: string }) => (
  <div className="mb-12 md:mb-24" id={id}>
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-6"
    >
      <NeonLink href={`#${id}`} className="text-6xl md:text-9xl font-black tracking-tighter uppercase glow-blue">
        {title}
      </NeonLink>
      <div className="h-[2px] flex-grow bg-gradient-to-r from-neon-blue/50 to-transparent" />
    </motion.div>
    {subtitle && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-6 flex flex-col md:flex-row md:items-center gap-4"
      >
        <p className="text-gray-300 max-w-2xl text-xl md:text-2xl leading-relaxed font-medium">
          {subtitle}
        </p>
      </motion.div>
    )}
  </div>
);

const Navbar = ({ onSectionClick }: { onSectionClick: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'about', title: 'ABOUT', label: '关于 / 简介' },
    { id: 'strive', title: 'STRIVE', label: '奋斗 / 哲学' },
    { id: 'dream', title: 'DREAM', label: '愿景 / 梦想' },
    { id: 'work', title: 'WORK', label: '作品 / 实践' },
    { id: 'imagine', title: 'IMAGINE', label: '想象 / 创意' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[60] px-6 py-6 transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <NeonLink
            onClick={(e) => { e.preventDefault(); onSectionClick('hero'); }}
            className="text-xl font-bold tracking-tighter"
          >
            YOLO MORTAL
          </NeonLink>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-8 h-[1px] bg-white group-hover:bg-neon-blue transition-colors shadow-[0_0_8px_rgba(0,242,255,0.5)]"
            />
            <motion.span
              animate={isOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
              className="w-8 h-[1px] bg-white group-hover:bg-neon-blue transition-colors shadow-[0_0_8px_rgba(0,242,255,0.5)]"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-8 h-[1px] bg-white group-hover:bg-neon-blue transition-colors shadow-[0_0_8px_rgba(0,242,255,0.5)]"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
          >
            {/* Background Grid for Menu */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
              <motion.div
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,242,255,0.1)_0%,_transparent_50%)]"
              />
            </div>

            <div className="relative z-10 text-center space-y-12">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onSectionClick(item.id);
                    }}
                    className="group relative"
                  >
                    <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.5em] text-gray-600 opacity-0 group-hover:opacity-100 transition-all group-hover:-left-16 font-mono">
                      0{i + 1}
                    </span>
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white group-hover:text-neon-blue transition-all duration-500 group-hover:glow-blue uppercase">
                      {item.title}
                    </h2>
                    <span className="block text-xs tracking-[0.8em] text-gray-500 mt-2 group-hover:text-neon-purple transition-colors uppercase">
                      {item.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Close Button Overlay */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-10 h-10" />
            </button>

            {/* Social Links in Menu */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-8">
              {['INSTAGRAM', 'TWITTER', 'GITHUB'].map((social, i) => (
                <motion.div
                  key={social}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <NeonLink href="#" className="text-[10px] tracking-widest text-gray-600 uppercase">
                    {social}
                  </NeonLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [exploreProgress, setExploreProgress] = useState(0);
  const [isExploring, setIsExploring] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'strive' | 'dream' | 'work' | 'imagine' | 'think'>('hero');
  const exploreTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = (id: string) => {
    setActiveSection(id as any);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleExploreStart = () => {
    setIsExploring(true);
    exploreTimer.current = setInterval(() => {
      setExploreProgress(prev => {
        if (prev >= 100) {
          clearInterval(exploreTimer.current!);
          setActiveSection('strive');
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const handleExploreEnd = () => {
    setIsExploring(false);
    if (exploreTimer.current) clearInterval(exploreTimer.current);
    setExploreProgress(0);
  };

  const filteredProjects = filterTag
    ? PROJECTS.filter(p => p.category === filterTag || p.tags.includes(filterTag))
    : PROJECTS;

  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleTitleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-neon-blue font-display text-xl tracking-widest"
        >
          INITIALIZING...
        </motion.div>
      </div>
    );
  }

  // Animation Variants for Sections
  const sectionVariants = {
    hero: {
      initial: { opacity: 0, scale: 1.1, filter: 'blur(20px)' },
      animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, scale: 0.9, filter: 'blur(20px)', transition: { duration: 0.5 } }
    },
    strive: {
      initial: { opacity: 0, x: -100, skewX: -10, filter: 'brightness(0)' },
      animate: { opacity: 1, x: 0, skewX: 0, filter: 'brightness(1)' },
      exit: { opacity: 0, x: 100, skewX: 10, filter: 'brightness(0)' }
    },
    dream: {
      initial: { opacity: 0, y: 100, scale: 0.8, rotateX: 45 },
      animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
      exit: { opacity: 0, y: -100, scale: 1.2, rotateX: -45 }
    },
    work: {
      initial: { opacity: 0, scale: 1.05, clipPath: 'inset(100% 0 0 0)' },
      animate: { opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)' },
      exit: { opacity: 0, scale: 0.95, clipPath: 'inset(0 0 100% 0)' }
    },
    imagine: {
      initial: { opacity: 0, rotateY: 90, perspective: 1000 },
      animate: { opacity: 1, rotateY: 0, perspective: 1000 },
      exit: { opacity: 0, rotateY: -90, perspective: 1000 }
    },
    about: {
      initial: { opacity: 0, x: -50, filter: 'blur(10px)' },
      animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, x: 50, filter: 'blur(10px)' }
    },
    think: {
      initial: { opacity: 0, x: 100, filter: 'blur(10px)' },
      animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, x: -100, filter: 'blur(10px)' }
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-neon-blue/30 text-white">
      <Navbar onSectionClick={scrollToSection} />

      {/* Matrix Background */}
      <MatrixBackground />

      {/* Displacement Effect */}
      <DisplacementEffect />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(0,242,255,0.03)_0%,_transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'hero' ? (
          <motion.section
            key="hero"
            variants={sectionVariants.hero}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-screen flex flex-col items-center justify-center px-6 z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative"
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
              onMouseMove={handleTitleMouseMove}
            >
              <VoidCrack isHovered={isTitleHovered} mouseX={mousePos.x} mouseY={mousePos.y} />
              <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 block uppercase bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-purple to-pink-500 animate-gradient-x drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">
                YOLO MORTAL
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-lg md:text-2xl tracking-[0.5em] uppercase font-light"
              >
                You only live once
              </motion.p>
            </motion.div>

            {/* 页面边框进度条 */}
            <motion.div
              className="fixed inset-0 pointer-events-none z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: exploreProgress > 0 ? 1 : 0 }}
            >
              {/* 顶部边框 */}
              <motion.div
                className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-purple"
                style={{ width: `${exploreProgress}%` }}
              />
              {/* 右侧边框 */}
              <motion.div
                className="absolute top-0 right-0 w-[2px] bg-gradient-to-b from-neon-purple to-neon-blue"
                style={{ height: `${exploreProgress}%` }}
              />
              {/* 底部边框 */}
              <motion.div
                className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-neon-blue to-neon-purple"
                style={{ width: `${exploreProgress}%` }}
              />
              {/* 左侧边框 */}
              <motion.div
                className="absolute bottom-0 left-0 w-[2px] bg-gradient-to-t from-neon-purple to-neon-blue"
                style={{ height: `${exploreProgress}%` }}
              />
            </motion.div>

            <motion.div
              className="absolute bottom-20 flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div
                className="relative cursor-pointer group"
                onMouseDown={handleExploreStart}
                onMouseUp={handleExploreEnd}
                onMouseLeave={handleExploreEnd}
                onTouchStart={handleExploreStart}
                onTouchEnd={handleExploreEnd}
              >
                {/* 指纹识别图标 */}
                <svg className="w-24 h-24" viewBox="0 0 1024 1024">
                  {/* 半透明圆形背景 */}
                  <circle cx="512" cy="512" r="380" fill="rgba(0,242,255,0.1)" />
                  
                  {/* 外圈大弧线 */}
                  <path d="M886 540c0 210-170 380-379 380-210 0-380-170-380-380 0-210 170-380 380-380 209 0 379 170 379 380" fill="none" stroke="#00f2ff" strokeWidth="40" opacity="0.3" />
                  
                  {/* 第二圈弧线 */}
                  <path d="M328 545c6 150 43 293 112 427 10 19 25 27 42 24 15-3 27-17 27-33 0-9-3-18-7-26a958 958 0 0 1-77-209c-17-70-25-141-26-214-1-59 47-110 104-112 61-2 112 44 113 106 3 108 24 211 71 308 16 34 37 67 56 99 10 16 31 20 47 10 17-10 22-32 12-50-10-16-20-32-30-49-39-69-64-142-76-220-5-32-6-65-7-97-3-86-58-157-138-177-89-22-177 25-211 113-12 32-16 65-13 99" fill="none" stroke="#00f2ff" strokeWidth="28" opacity="0.6" />
                  
                  {/* 第三圈弧线 */}
                  <path d="M510 237c123-2 229 84 260 208 7 30 10 61 11 91 5 96 34 184 84 265 12 19 32 25 49 14 18-11 23-29 11-50-27-46-51-94-61-147a772 772 0 0 1-13-111c-3-80-26-152-76-214-57-70-131-112-220-124-73-10-142 2-206 38-14 7-22 18-22 33 0 13 6 23 18 29 12 6 24 3 36-2 65-28 123-43 179-30z" fill="none" stroke="#00f2ff" strokeWidth="24" opacity="0.8" />
                  
                  {/* 内圈弧线 */}
                  <path d="M167 549a1185 1185 0 0 0 69 356c7 20 25 30 46 25 15-3 25-16 24-31 0-9-2-17-6-26-25-72-44-146-53-221-8-66-16-132-4-198a244 244 0 0 1 38-95c7-11 13-22 8-35-4-12-13-20-25-22-13-2-24 2-32 13-33 48-54 100-61 157-3 26-3 51-4 77z" fill="none" stroke="#00f2ff" strokeWidth="22" opacity="0.9" />
                  
                  {/* 最内圈 */}
                  <path d="M475 528c3 123 30 239 83 350 15 31 33 61 50 91 12 21 31 27 50 16 18-10 23-32 11-52-31-49-57-101-77-156-31-86-46-175-48-266-1-25-16-40-37-39-18 1-31 14-32 32v24z" fill="none" stroke="#00f2ff" strokeWidth="20" />
                  
                  {/* 中心点 */}
                  <circle cx="512" cy="512" r="8" fill="#00f2ff" />
                </svg>
              </div>
              <p className="text-[10px] tracking-[0.3em] text-gray-600 uppercase">长按进入</p>
            </motion.div>
          </motion.section>
        ) : (
          <motion.main
            key={activeSection}
            variants={sectionVariants[activeSection]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: "circOut" }}
            className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen"
          >
            <div className="flex justify-end items-center mb-12">
              <div className="text-[10px] tracking-[0.5em] text-neon-blue/50 uppercase font-mono">
                Section / {activeSection}
              </div>
            </div>

            {activeSection === 'about' && (
              <section id="about" className="space-y-20">
                <SectionTitle title="ABOUT" id="about" subtitle="灵感收藏与深度思考。" />

                {/* Profile Avatar Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pt-10"
                >
                  {/* 1:1 Avatar */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative flex-shrink-0"
                  >
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-neon-blue/30 relative group">
                      <img 
                        src="/src/assets/生成乡村小河图片 (1).png" 
                        alt="Avatar" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-neon-blue/50 animate-pulse" />
                      {/* Rotating ring */}
                      <div className="absolute inset-[-8px] rounded-full border border-dashed border-neon-blue/30 animate-spin-slow" />
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-neon-blue/10 blur-xl -z-10 group-hover:bg-neon-blue/20 transition-colors" />
                  </motion.div>
                  
                  {/* Intro Text */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center md:text-left"
                  >
                    <div className="text-[10px] tracking-[0.5em] text-neon-blue/70 uppercase font-mono mb-2">Hello, I'm</div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                      ZLION
                    </h2>
                    <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                      Born in 2006 in China, Zhou Lei is the founder of Yolomortal and the CEO of Seethefuture.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Photo Gallery Section */}
                <div className="pt-20 border-t border-white/5">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-[10px] tracking-[0.5em] text-neon-blue/50 uppercase font-mono">Photo Gallery / 照片墙</h3>
                    <div className="text-[10px] tracking-widest text-gray-600 uppercase font-mono">Moments & Memories / 瞬间与记忆</div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(import.meta.glob('/src/assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, query: '?url', import: 'default' }))
                      .filter(([path]) => !path.includes('.gitkeep') && !path.includes('生成乡村小河图片'))
                      .map(([path, url], i) => (
                        <motion.div
                          key={path}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (i % 8) * 0.05 }}
                          className="aspect-square bg-white/5 border border-white/10 relative overflow-hidden group cursor-pointer"
                          whileHover={{ scale: 1.02, zIndex: 10 }}
                        >
                          <img
                            src={url as string}
                            alt={path.split('/').pop()?.split('.')[0] || `Photo ${i + 1}`}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                      ))}
                  </div>
                </div>

                {/* Curated Inspiration Section - Videos */}
                <div className="pt-20 border-t border-white/5">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-[10px] tracking-[0.5em] text-neon-blue/50 uppercase font-mono">Curated Inspiration / 灵感收藏</h3>
                    <div className="text-[10px] tracking-widest text-gray-600 uppercase font-mono">Thoughts & Philosophy / 深度思考</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { 
                        title: '感觉意识是如何产生的？', 
                        bvid: 'BV1pC4y1a7fR', 
                        desc: '意识是世界内秉的属性吗？探索意识起源的奥秘。',
                        tag: 'Philosophy'
                      },
                      { 
                        title: '为什么中国人比美国人更"爱国"？', 
                        bvid: 'BV1mG4y1v7vP', 
                        desc: '从社会学角度深度剖析爱国主义的差异与根源。',
                        tag: 'Sociology'
                      },
                      { 
                        title: '姓社vs姓资：辩论高端局', 
                        bvid: 'BV1vK4y1P7vj', 
                        desc: '沃尔夫与阿瑟·拉弗的巅峰对决，90分钟高能辩经。',
                        tag: 'Economy'
                      },
                      { 
                        title: '美元如何偷袭黄金，制霸全球？', 
                        bvid: 'BV1m54y1h7vN', 
                        desc: '揭秘资本主义世界的300年黄金博弈。',
                        tag: 'History'
                      }
                    ].map((video, i) => (
                      <LazyVideo key={i} video={video} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'strive' && (
              <section id="strive" className="space-y-20">
                <SectionTitle title="STRIVE" id="strive" subtitle="奋斗是生命的底色，哲学是前行的灯塔。" />
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-square bg-white/5 border border-white/10 relative overflow-hidden group"
                  >
                    <img
                      src="https://picsum.photos/seed/strive/800/800"
                      alt="Strive"
                      className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </motion.div>
                  <div className="space-y-8">
                    <p className="text-2xl md:text-4xl leading-relaxed text-white font-black">
                      在数字时代的洪流中，我们不断追求卓越。每一次代码的敲击，每一帧影像的剪辑，都是对自我极限的挑战。
                    </p>
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-bold">
                      克制、简洁、富有氛围感。这不仅是设计的准则，更是生活的哲学。在繁杂中寻找纯粹，在动态中捕捉永恒。
                    </p>
                  </div>
                </div>

                {/* Articles Section */}
                <div className="pt-20 border-t border-white/5">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <h3 className="text-[10px] tracking-[0.5em] text-neon-blue/50 uppercase font-mono">Recent Writings / 近期文章</h3>
                    <NeonLink
                      href="https://jsxy0.pages.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs tracking-widest uppercase text-gray-500 hover:text-neon-blue flex items-center gap-2 group"
                    >
                      Visit My Blog
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </NeonLink>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROJECTS.filter(p => p.category === 'WRITINGS').map((article, i) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <span className="text-6xl font-bold font-mono">0{i + 1}</span>
                        </div>
                        <div className="text-[10px] tracking-widest text-neon-blue/50 uppercase font-mono mb-4">{article.date}</div>
                        <h4 className="text-xl font-bold mb-4 group-hover:text-neon-blue transition-colors">{article.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{article.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map(tag => (
                            <span key={tag} className="text-[8px] tracking-widest uppercase px-2 py-1 border border-white/10 text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Blog Introduction */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-32 p-12 border border-neon-blue/20 bg-neon-blue/[0.02] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ExternalLink className="w-32 h-32 text-neon-blue" />
                  </div>
                  <div className="relative z-10 max-w-3xl">
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
                      PERSONAL <span className="text-neon-blue">BLOG</span>
                    </h3>
                    <p className="text-xl text-gray-400 leading-relaxed mb-8">
                      除了在这里展示的作品，我还在个人博客中记录更多关于技术、设计与生活的思考。欢迎订阅我的博客，与我一起在数字海洋中探索。
                    </p>
                    <NeonLink
                      href="https://jsxy0.pages.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-neon-blue font-bold tracking-widest uppercase group/link"
                    >
                      Explore Blog
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                    </NeonLink>
                  </div>
                </motion.div>
              </section>
            )}

            {activeSection === 'dream' && (
              <section id="dream" className="space-y-20">
                <SectionTitle title="DREAM" id="dream" subtitle="愿景勾勒未来，梦想驱动创新。" />
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { title: 'VISION', desc: '构建一个充满美感与逻辑的数字世界。' },
                    { title: 'FUTURE', desc: '探索人工智能与人类创意的共生可能。' },
                    { title: 'IMPACT', desc: '用作品触动人心，用技术改变生活。' }
                  ].map((item, i) => (
                    <a
                      key={item.title}
                      href="http://2017.makemepulse.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="p-8 bg-white/5 border border-white/10 hover:border-neon-purple/50 transition-colors group cursor-pointer h-full"
                      >
                        <h3 className="text-3xl font-black mb-4 group-hover:text-neon-purple transition-colors">{item.title}</h3>
                        <p className="text-xl text-gray-300 leading-relaxed font-bold">{item.desc}</p>
                        <div className="mt-4 text-[10px] tracking-widest text-neon-purple/40 uppercase font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          ↗ Explore
                        </div>
                      </motion.div>
                    </a>
                  ))}
                </div>

                {/* Frontier Technology Section */}
                <div className="pt-20 border-t border-white/5">
                  <h3 className="text-[10px] tracking-[0.5em] text-neon-purple/50 uppercase font-mono mb-12">Frontier Tech / 前沿科技</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: 'Generative AI', icon: <Cpu className="w-5 h-5" />, desc: '探索 AIGC 在创意领域的无限可能。', link: 'https://circletimestudio.com/' },
                      { title: 'Web3 & Decentralization', icon: <Globe className="w-5 h-5" />, desc: '构建去中心化的数字资产与社区。', link: 'https://www.atelierdaruma.com/' },
                      { title: 'Spatial Computing', icon: <Layers className="w-5 h-5" />, desc: '模糊虚拟与现实的边界，重塑交互。', link: 'https://www.resn.co.nz/' },
                      { title: 'Quantum Logic', icon: <Zap className="w-5 h-5" />, desc: '研究未来计算范式对设计的深远影响。', link: 'https://www.innerspacevr.com/' },
                      { title: 'Neural Interfaces', icon: <Activity className="w-5 h-5" />, desc: '探索脑机接口技术，实现思维与数字世界的直接对话。', link: 'https://www.pebblestudios.co.uk/' },
                      { title: 'Bio-Digital Integration', icon: <Dna className="w-5 h-5" />, desc: '研究生物技术与数字系统的融合，定义新人类。', link: 'https://www.1618digital.com/' },
                      { title: 'Autonomous Systems', icon: <Bot className="w-5 h-5" />, desc: '构建具备自我进化能力的智能系统，重塑生产力。', link: 'https://yordstudio.com/' },
                      { title: 'Sustainable Tech', icon: <Leaf className="w-5 h-5" />, desc: '利用前沿科技解决环境危机，实现文明的可持续发展。', link: 'https://www.rooom.com/' }
                    ].map((tech, i) => (
                      <a
                        key={tech.title}
                        href={tech.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group cursor-pointer h-full"
                        >
                          <div className="text-neon-purple mb-4 group-hover:scale-110 transition-transform duration-500">{tech.icon}</div>
                          <h4 className="text-sm font-bold tracking-widest uppercase mb-2">{tech.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{tech.desc}</p>
                          <div className="mt-3 text-[10px] tracking-widest text-neon-purple/40 uppercase font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                            ↗ Explore
                          </div>
                        </motion.div>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'work' && (
              <section id="work" className="space-y-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <SectionTitle title="WORK" id="work" subtitle="实践出真知，作品是最好的名片。" />
                  <div className="flex flex-wrap gap-4">
                    {['ALL', 'IMAGES', 'VIDEOS', 'WRITINGS'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterTag(cat === 'ALL' ? null : cat)}
                        className={`text-[10px] tracking-[0.3em] uppercase px-4 py-2 border transition-all ${
                          (filterTag === cat || (cat === 'ALL' && !filterTag))
                            ? 'border-neon-blue text-neon-blue bg-neon-blue/5'
                            : 'border-white/10 text-gray-500 hover:border-white/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, i) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={i}
                      onClick={() => setSelectedProject(project)}
                      onTagClick={(tag) => setFilterTag(tag)}
                    />
                  ))}
                </div>

                {/* Skills Section moved from THINK */}
                <div className="pt-20 border-t border-white/5">
                  <h3 className="text-[10px] tracking-[0.5em] text-neon-blue/50 uppercase font-mono mb-12">Core Skills / 核心技能</h3>
                  <div className="flex flex-wrap gap-x-8 gap-y-12">
                    {SKILLS.map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_8px_#00f2ff]" />
                        <NeonLink onClick={(e) => { e.preventDefault(); setFilterTag(skill); }} className="text-xl md:text-3xl font-medium tracking-tight">
                          {skill}
                        </NeonLink>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'imagine' && (
              <section id="imagine" className="space-y-20">
                <SectionTitle title="IMAGINE" id="imagine" subtitle="想象力是唯一的限制，创意无边界。" />
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <p className="text-xl text-gray-400 leading-relaxed">
                      想象力是打破现实枷锁的唯一钥匙。在数字的荒原中，我们播种创意，收获未来。
                    </p>
                    <div className="pt-8 space-y-4">
                      <div className="flex items-center gap-4 text-neon-blue">
                        <div className="w-12 h-[1px] bg-neon-blue" />
                        <span className="text-[10px] tracking-[0.5em] uppercase">Connect / Collaborate</span>
                      </div>
                      <div className="flex gap-6">
                      <NeonLink href="mailto:3531908677@qq.com" className="p-4 border border-white/10 rounded-full">
                        <Mail className="w-6 h-6" />
                      </NeonLink>
                      <NeonLink href="https://instagram.com/z3531908677" target="_blank" className="p-4 border border-white/10 rounded-full">
                        <Instagram className="w-6 h-6" />
                      </NeonLink>
                      <NeonLink href="https://twitter.com/z3531908677" target="_blank" className="p-4 border border-white/10 rounded-full">
                        <Twitter className="w-6 h-6" />
                      </NeonLink>
                      <NeonLink href="https://github.com/3531908677" target="_blank" className="p-4 border border-white/10 rounded-full">
                        <Github className="w-6 h-6" />
                      </NeonLink>
                    </div>
                  </div>
                </div>
                <a href="https://lab.hakim.se/core/01/" target="_blank" rel="noopener noreferrer" className="relative group block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-black border border-white/10 p-8 h-full flex flex-col justify-center items-center text-center space-y-8 overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,242,255,0.2)_0%,_transparent_70%)] animate-pulse" />
                      </div>

                      <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                          <motion.div
                            animate={{
                              rotate: 360,
                              scale: [1, 1.1, 1],
                              borderRadius: ["20%", "50%", "20%"]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-neon-blue/30 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                          />
                          <motion.div
                            animate={{
                              rotate: -360,
                              scale: [1, 1.2, 1],
                              borderRadius: ["50%", "20%", "50%"]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-2 border-2 border-neon-purple/30 shadow-[0_0_20px_rgba(191,0,255,0.2)]"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-white animate-pulse" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold tracking-tighter mb-4 uppercase">Creative Lab</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                          这里是灵感的实验室。我们打破常规，在代码与艺术的交汇处，探索未知的视觉维度。
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 w-full max-w-xs relative z-10">
                        {[Activity, Dna, Bot].map((Icon, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.1 }}
                            className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center rounded-lg hover:border-neon-blue/50 transition-colors group/icon"
                          >
                            <Icon className="w-6 h-6 text-gray-500 group-hover/icon:text-neon-blue transition-colors" />
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className="text-[10px] tracking-[0.4em] text-neon-blue/40 uppercase font-mono"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        Experimental Zone / 01 ↗
                      </motion.div>
                    </div>
                  </a>
                </div>

                {/* seethefuture Community Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-32 p-12 border border-neon-blue/20 bg-neon-blue/[0.02] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Globe className="w-32 h-32 text-neon-blue" />
                  </div>
                  <div className="relative z-10 max-w-3xl">
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
                      SEE THE <span className="text-neon-blue">FUTURE</span>
                    </h3>
                    <p className="text-xl text-gray-400 leading-relaxed mb-8">
                      这是我创建的数字艺术与前沿科技社区。在这里，我们共同探讨未来的可能性，分享灵感，连接创意。欢迎加入我们，一起预见未来。
                    </p>
                    <NeonLink
                      href="https://yjwl.netlify.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-neon-blue font-bold tracking-widest uppercase group/link"
                    >
                      Visit Community
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                    </NeonLink>
                  </div>
                </motion.div>
              </section>
            )}
          </motion.main>
        )}
      </AnimatePresence>



      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.3em] text-gray-600 uppercase">
            © 2026 YOLO MORTAL | Created with light & motion
          </p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChatWidget />

      {/* Music Player */}
      <MusicPlayer />

      {/* Energy Trail Effect */}
      <EnergyTrail />



      {/* Detail View Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onProjectSelect={(p) => setSelectedProject(p)}
          />
        )}
      </AnimatePresence>

      {/* Filter Reset Button */}
      <AnimatePresence>
        {filterTag && activeSection === 'work' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setFilterTag(null)}
            className="fixed bottom-8 right-8 z-40 bg-neon-blue text-black px-6 py-3 rounded-full font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filter: {filterTag}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, index, onClick, onTagClick }: { project: Project, index: number, onClick: () => void, onTagClick: (tag: string) => void, key?: React.Key }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative aspect-[4/3] overflow-hidden mb-6 bg-white/5 border border-white/10 transition-all duration-300 group-hover:border-neon-blue/50"
        onClick={onClick}
      >
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
        <div className="absolute top-4 right-4 flex gap-2">
          {project.duration && (
            <span className="bg-black/80 text-white text-[10px] px-2 py-1 font-mono border border-white/10">
              {project.duration}
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
        </div>
      </motion.div>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <NeonLink onClick={(e) => { e.preventDefault(); onClick(); }} className="text-xl font-bold tracking-tight uppercase">{project.title}</NeonLink>
          {project.date && <span className="text-gray-600 font-mono text-xs">{project.date}</span>}
        </div>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map(tag => (
            <NeonLink key={tag} onClick={(e) => { e.preventDefault(); onTagClick(tag); }} className="text-[9px] tracking-widest text-gray-600 uppercase hover:text-neon-blue">
              {tag}
            </NeonLink>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project, onClose, onProjectSelect }: { project: Project, onClose: () => void, onProjectSelect: (p: Project) => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-y-auto"
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <NeonLink onClick={(e) => { e.preventDefault(); onClose(); }} className="flex items-center gap-2 text-xs tracking-widest uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </NeonLink>
          <div className="text-center hidden md:block">
            <h1 className="text-sm font-bold tracking-[0.3em] uppercase">{project.title}</h1>
          </div>
          <button onClick={onClose} className="p-2 hover:text-neon-blue transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-grow max-w-5xl mx-auto w-full px-6 py-12 md:py-20 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-4 items-center text-gray-500 font-mono text-xs uppercase">
              <span>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>{project.date || '2026'}</span>
              {project.duration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-700" />
                  <span>{project.duration}</span>
                </>
              )}
            </div>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-none">
              {project.title}
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] tracking-widest text-neon-blue uppercase px-3 py-1 border border-neon-blue/30 rounded-full bg-neon-blue/5">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video bg-white/5 border border-white/10 group"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {project.category === 'VIDEOS' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <Play className="w-8 h-8 fill-current" />
                </motion.button>
              </div>
            )}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded hover:text-neon-blue">
                 <Maximize2 className="w-5 h-5" />
               </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-12"
          >
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs tracking-[0.3em] text-gray-500 uppercase font-bold">Overview</h3>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                  {project.description}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs tracking-[0.3em] text-gray-500 uppercase font-bold">The Concept</h3>
                <p className="text-gray-400 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </div>
            <div className="space-y-8">
               <div className="space-y-4">
                 <h3 className="text-xs tracking-[0.3em] text-gray-500 uppercase font-bold">Role</h3>
                 <p className="text-gray-300">Creative Direction / Visual Design</p>
               </div>
               <div className="space-y-4">
                 <h3 className="text-xs tracking-[0.3em] text-gray-500 uppercase font-bold">Tools</h3>
                 <p className="text-gray-300">Adobe After Effects, Cinema 4D, Photoshop</p>
               </div>
               <div className="space-y-4">
                 <h3 className="text-xs tracking-[0.3em] text-gray-500 uppercase font-bold">Client</h3>
                 <p className="text-gray-300">Experimental Lab</p>
               </div>
            </div>
          </motion.div>

          {/* Related Projects */}
          <div className="pt-20 border-t border-white/10">
            <h3 className="text-xs tracking-[0.3em] text-gray-500 uppercase font-bold mb-12">Next Project</h3>
            <div className="group cursor-pointer" onClick={() => {
              const next = PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length];
              onProjectSelect(next);
            }}>
              <div className="flex items-center justify-between">
                <h4 className="text-4xl md:text-8xl font-bold tracking-tighter uppercase group-hover:text-neon-blue transition-colors">
                  {PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length].title}
                </h4>
                <ArrowRight className="w-12 h-12 md:w-20 md:h-20 text-gray-800 group-hover:text-neon-blue group-hover:translate-x-4 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 text-center mt-auto">
          <NeonLink onClick={(e) => { e.preventDefault(); onClose(); }} className="text-[10px] tracking-widest text-gray-600 uppercase">
            Return to Portfolio
          </NeonLink>
        </footer>
      </div>
    </motion.div>
  );
}
