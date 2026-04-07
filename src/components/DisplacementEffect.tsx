import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DisplacementEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
        vec3 l = 1.79284291400159 - 0.85373472095314 * ( g*g + h*h );
        vec3 grid = g * l;
        return 130.0 * dot(m, grid);
      }

      void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse;
        
        // Calculate distance to mouse
        float dist = distance(uv, mouse);
        
        // Displacement strength based on mouse proximity
        float strength = 0.15;
        float radius = 0.25;
        float edge = 0.1;
        float m = smoothstep(radius, radius - edge, dist);
        
        // Create distortion offset
        vec2 distortion = vec2(
          snoise(uv * 4.0 + uTime * 0.2),
          snoise(uv * 4.0 - uTime * 0.2 + 100.0)
        ) * strength * m;
        
        // Sample a "virtual" background (dark gradient)
        vec2 distortedUv = uv + distortion;
        
        vec3 color1 = vec3(0.0, 0.05, 0.1); // Deep blue
        vec3 color2 = vec3(0.05, 0.0, 0.1); // Deep purple
        vec3 bgColor = mix(color1, color2, distortedUv.y + distortedUv.x * 0.5);
        
        // Add a subtle glow at the mouse position
        float glow = exp(-dist * 15.0) * 0.3;
        bgColor += vec3(0.0, 0.95, 1.0) * glow * m;
        
        gl_FragColor = vec4(bgColor, 0.4); // Semi-transparent
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - (e.clientY / window.innerHeight)
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = (time: number) => {
      // Smooth mouse movement
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      uniforms.uTime.value = time * 0.001;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default DisplacementEffect;
