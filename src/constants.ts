export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  category: 'IMAGES' | 'VIDEOS' | 'WRITINGS';
  date?: string;
  duration?: string;
}

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: '赛博朋克夜曲',
    description: '对霓虹闪烁的街道和数字孤立的视觉探索。',
    tags: ['视觉设计', '创意合成'],
    image: 'https://picsum.photos/seed/cyber/1200/800',
    category: 'IMAGES'
  },
  {
    id: '2',
    title: '虚空回响',
    description: '探索数字时代沉默概念的实验性动态作品。',
    tags: ['动态设计', '实验性'],
    image: 'https://picsum.photos/seed/void/1200/800',
    category: 'VIDEOS',
    duration: '02:45',
    date: '2025.12'
  },
  {
    id: '3',
    title: '克制的艺术',
    description: '深入探讨现代数字界面中的极简主义哲学。',
    tags: ['思考', '项目回顾'],
    image: 'https://picsum.photos/seed/minimal/1200/800',
    category: 'WRITINGS',
    date: '2026.01.15'
  },
  {
    id: '4',
    title: '数字碎片',
    description: '捕捉代码生成艺术中故障和不完美的魅力。',
    tags: ['生成艺术', '抽象'],
    image: 'https://picsum.photos/seed/glitch/1200/800',
    category: 'IMAGES'
  },
  {
    id: '5',
    title: '霓虹脉冲',
    description: '记录未来大都市节奏的短片。',
    tags: ['短片', '摄影'],
    image: 'https://picsum.photos/seed/neon/1200/800',
    category: 'VIDEOS',
    duration: '01:30',
    date: '2026.02'
  },
  {
    id: '6',
    title: '超越网格',
    description: '关于打破常规设计系统的思考。',
    tags: ['创意笔记', '设计策略'],
    image: 'https://picsum.photos/seed/grid/1200/800',
    category: 'WRITINGS',
    date: '2026.03.10'
  },
  {
    id: '7',
    title: '硅魂',
    description: '探索人工智能与人类意识的交集。',
    tags: ['AI 哲学', '未来'],
    image: 'https://picsum.photos/seed/silicon/1200/800',
    category: 'WRITINGS',
    date: '2026.03.15'
  },
  {
    id: '8',
    title: '混沌建筑师',
    description: '去中心化系统如何重塑我们对秩序的理解。',
    tags: ['Web3', '社会学'],
    image: 'https://picsum.photos/seed/chaos/1200/800',
    category: 'WRITINGS',
    date: '2026.03.20'
  },
  {
    id: '9',
    title: '极简主义宣言',
    description: '数字噪音时代有意识生活的指南。',
    tags: ['生活方式', '设计'],
    image: 'https://picsum.photos/seed/manifesto/1200/800',
    category: 'WRITINGS',
    date: '2026.03.25'
  }
];

export const SKILLS = [
  'Photography',
  'Video Editing',
  'Motion Design',
  'Color Grading',
  'Writing & Copy',
  'Visual Composition',
  'AI Prompt Engineering',
  'UI/UX Design',
  'Frontend Development',
  '3D Modeling',
  'Creative Direction',
  'Brand Strategy',
  'Digital Marketing',
  'Sound Design',
  'Data Visualization',
  'Interaction Design',
  'AR/VR Development',
  'Cybersecurity',
  'Cloud Architecture',
  'Blockchain Development',
  'Game Design',
  'Machine Learning',
  'Product Management',
  'Agile Methodology'
];
