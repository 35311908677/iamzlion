import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
  size: number;
  angle: number;
  velocity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  vertices: number;
  irregularity: number[];
}

interface TrailSegment {
  points: { x: number; y: number; size: number }[];
  age: number;
}

const EnergyTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<TrailSegment[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, isMoving: false });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        prevX,
        prevY,
        isMoving: true,
      };

      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      if (velocity > 2) {
        // 添加轨迹点
        pointsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          age: 0,
          size: Math.min(velocity * 0.4, 18) + 8,
          angle,
          velocity,
        });

        // 添加到拖尾段
        if (trailsRef.current.length === 0 || 
            Math.hypot(e.clientX - trailsRef.current[trailsRef.current.length - 1].points[0]?.x || 0,
                       e.clientY - trailsRef.current[trailsRef.current.length - 1].points[0]?.y || 0) > 5) {
          trailsRef.current.push({
            points: [{ x: e.clientX, y: e.clientY, size: Math.min(velocity * 0.3, 15) + 5 }],
            age: 0,
          });
        }

        // 生成几何碎片粒子
        const particleCount = Math.floor(velocity * 0.25) + 2;
        for (let i = 0; i < particleCount; i++) {
          const spread = (Math.random() - 0.5) * 50;
          const perpAngle = angle + Math.PI / 2;
          const spreadX = Math.cos(perpAngle) * spread;
          const spreadY = Math.sin(perpAngle) * spread;
          
          // 不规则顶点数量
          const vertices = Math.floor(Math.random() * 4) + 4; // 4-7边形
          const irregularity: number[] = [];
          for (let v = 0; v < vertices; v++) {
            irregularity.push(0.5 + Math.random() * 1);
          }

          particlesRef.current.push({
            x: e.clientX + spreadX,
            y: e.clientY + spreadY,
            vx: (Math.random() - 0.5) * 3 + dx * 0.08,
            vy: (Math.random() - 0.5) * 3 + dy * 0.08,
            size: Math.random() * 18 + 6,
            life: 1,
            maxLife: Math.random() * 0.6 + 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.15,
            vertices,
            irregularity,
          });
        }
      }

      // 限制数量
      if (pointsRef.current.length > 100) {
        pointsRef.current = pointsRef.current.slice(-80);
      }
      if (trailsRef.current.length > 30) {
        trailsRef.current = trailsRef.current.slice(-25);
      }
    };

    // 多色系配置
    const colors = [
      { r: 0, g: 242, b: 255 },    // 青色
      { r: 168, g: 85, b: 247 },   // 紫色
      { r: 236, g: 72, b: 153 },   // 粉色
      { r: 34, g: 197, b: 94 },    // 绿色
      { r: 251, g: 191, b: 36 },  // 金色
      { r: 59, g: 130, b: 246 },   // 蓝色
    ];

    // 根据索引获取颜色
    const getColor = (index: number, alpha: number) => {
      const color = colors[index % colors.length];
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    };

    // 绘制不规则多边形
    const drawIrregularPolygon = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      vertices: number,
      irregularity: number[],
      alpha: number,
      colorIndex: number = 0
    ) => {
      if (size <= 0 || alpha <= 0) return;

      ctx.beginPath();
      for (let i = 0; i < vertices; i++) {
        const angle = rotation + (i * Math.PI * 2) / vertices;
        const r = size * irregularity[i % irregularity.length];
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // 渐变填充 - 多色
      const color = colors[colorIndex % colors.length];
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.9})`);
      gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.6})`);
      gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fill();

      // 边缘发光线
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.8})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // 绘制液态能量带 - 多色渐变
    const drawLiquidTrail = (points: Point[]) => {
      if (points.length < 2) return;

      // 绘制主体能量带
      ctx.beginPath();
      
      const firstPoint = points[0];
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const alpha = 1 - p1.age;
        
        if (alpha > 0) {
          // 波动偏移
          const wave = Math.sin(timeRef.current * 4 + i * 0.3) * 4;
          const perpAngle = p1.angle + Math.PI / 2;
          const offsetX = Math.cos(perpAngle) * wave;
          const offsetY = Math.sin(perpAngle) * wave;

          const midX = (p0.x + p1.x) / 2 + offsetX;
          const midY = (p0.y + p1.y) / 2 + offsetY;

          ctx.quadraticCurveTo(p0.x + offsetX * 0.5, p0.y + offsetY * 0.5, midX, midY);
        }
      }

      // 能量带多色渐变
      const lastPoint = points[points.length - 1];
      const gradient = ctx.createLinearGradient(
        firstPoint.x, firstPoint.y,
        lastPoint.x, lastPoint.y
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
      gradient.addColorStop(0.15, 'rgba(168, 85, 247, 0.4)');
      gradient.addColorStop(0.3, 'rgba(236, 72, 153, 0.5)');
      gradient.addColorStop(0.45, 'rgba(251, 191, 36, 0.5)');
      gradient.addColorStop(0.6, 'rgba(34, 197, 94, 0.6)');
      gradient.addColorStop(0.8, 'rgba(0, 242, 255, 0.9)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // 发光效果
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 25;
      ctx.stroke();
      
      // 第二层发光
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.stroke();
      
      ctx.shadowBlur = 0;

      // 绘制能量点 - 多色
      points.forEach((point, index) => {
        const alpha = Math.max(0, 1 - point.age * 0.8);
        const size = point.size * (1 - point.age * 0.4);
        const colorIndex = index % colors.length;

        if (alpha > 0 && size > 0) {
          const color = colors[colorIndex];
          
          // 核心发光
          const glowGradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, size * 3
          );
          glowGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
          glowGradient.addColorStop(0.2, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.7})`);
          glowGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.4})`);
          glowGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // 不规则几何形状
          const vertices = Math.floor(Math.sin(index * 0.5) * 2) + 5;
          const irregularity: number[] = [];
          for (let v = 0; v < vertices; v++) {
            irregularity.push(0.6 + Math.sin(timeRef.current * 2 + v) * 0.4);
          }

          drawIrregularPolygon(
            point.x,
            point.y,
            size,
            point.angle + timeRef.current,
            vertices,
            irregularity,
            alpha * 0.7,
            colorIndex
          );
        }
      });
    };

    // 绘制水波纹效果 - 多色
    const drawRipple = (x: number, y: number, radius: number, alpha: number, colorIndex: number = 0) => {
      if (alpha <= 0) return;

      const color = colors[colorIndex % colors.length];

      for (let i = 0; i < 3; i++) {
        const r = radius * (1 + i * 0.3);
        const a = alpha * (1 - i * 0.3);
        
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${a * 0.5})`;
        ctx.lineWidth = 1 - i * 0.2;
        ctx.stroke();
      }
    };

    const animate = () => {
      timeRef.current += 0.016;
      
      // 清除画布，带残影效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新轨迹点年龄
      pointsRef.current.forEach(point => {
        point.age += 0.018;
      });

      // 绘制液态能量拖尾
      drawLiquidTrail(pointsRef.current);

      // 更新和绘制粒子 - 多色
      particlesRef.current = particlesRef.current.filter((particle, pIndex) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.97;
        particle.vy *= 0.97;
        particle.life -= 0.018 / particle.maxLife;
        particle.rotation += particle.rotationSpeed;

        if (particle.life > 0) {
          const alpha = particle.life;
          const size = particle.size * particle.life;
          const colorIndex = (pIndex + Math.floor(timeRef.current * 2)) % colors.length;

          drawIrregularPolygon(
            particle.x,
            particle.y,
            size,
            particle.rotation,
            particle.vertices,
            particle.irregularity,
            alpha,
            colorIndex
          );

          // 添加水波纹 - 多色
          if (Math.random() > 0.95) {
            drawRipple(particle.x, particle.y, size * 2, alpha * 0.3, colorIndex);
          }

          return true;
        }
        return false;
      });

      // 绘制鼠标位置的拖尾 - 不显示光球，只有拖尾效果

      // 清理旧数据
      pointsRef.current = pointsRef.current.filter(point => point.age < 1.2);
      if (particlesRef.current.length > 300) {
        particlesRef.current = particlesRef.current.slice(-200);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default EnergyTrail;
