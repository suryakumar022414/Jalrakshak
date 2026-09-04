'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface MagicRingsProps {
  color?: string;
  colorTwo?: string;
  ringCount?: number;
  speed?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  hoverScale?: number;
  parallax?: number;
  clickBurst?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MagicRings: React.FC<MagicRingsProps> = ({
  color = '#10b981',
  colorTwo = '#06b6d4',
  ringCount = 6,
  speed = 1.0,
  attenuation = 10,
  lineThickness = 2.0,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1.0,
  blur = 0,
  noiseAmount = 0.1,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = false,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Clear existing canvas children
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Shader Material
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uColor1: { value: new THREE.Color(color) },
      uColor2: { value: new THREE.Color(colorTwo) },
      uRingCount: { value: ringCount },
      uSpeed: { value: speed },
      uLineThickness: { value: lineThickness },
      uBaseRadius: { value: baseRadius },
      uRadiusStep: { value: radiusStep },
      uNoiseAmount: { value: noiseAmount },
      uOpacity: { value: opacity },
      uRingGap: { value: ringGap },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uRingCount;
      uniform float uSpeed;
      uniform float uLineThickness;
      uniform float uBaseRadius;
      uniform float uRadiusStep;
      uniform float uNoiseAmount;
      uniform float uOpacity;
      uniform float uRingGap;
      uniform vec2 uMouse;

      varying vec2 vUv;

      // Pseudo random / noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
        vec2 mouseOffset = (uMouse - 0.5) * 0.1;
        st -= mouseOffset;

        float dist = length(st);
        float angle = atan(st.y, st.x);

        float ringIntensity = 0.0;

        for (float i = 0.0; i < 12.0; i += 1.0) {
          if (i >= uRingCount) break;

          float r = uBaseRadius + i * uRadiusStep * uRingGap;
          // Expanding wave ring effect
          float pulse = mod(dist - uTime * 0.15 * uSpeed + i * 0.05, 0.6);
          float ringDist = abs(dist - r - pulse * 0.2);

          // Add subtle wave distortion
          float noise = sin(angle * 6.0 + uTime * 2.0 + i) * uNoiseAmount * 0.03;
          ringDist += noise;

          float width = (uLineThickness / min(uResolution.x, uResolution.y)) * (1.0 + i * 0.15);
          float line = smoothstep(width, 0.0, ringDist);
          
          ringIntensity += line;
        }

        // Color interpolation based on radial distance
        float colorMix = clamp(dist * 2.0, 0.0, 1.0);
        vec3 finalColor = mix(uColor1, uColor2, colorMix);

        // Core glow aura
        float aura = smoothstep(0.5, 0.0, dist) * 0.15;
        finalColor += uColor1 * aura;

        float alpha = clamp(ringIntensity + aura * 0.5, 0.0, 1.0) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Mouse movement listener if enabled
    const handleMouseMove = (e: MouseEvent) => {
      if (!followMouse || !container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.uMouse.value.set(x, y);
    };

    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 5. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime() * speed;
      renderer.render(scene, camera);
    };
    animate();

    // 6. Resize Handling
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth || 300;
      const newHeight = container.clientHeight || 300;
      rendererRef.current.setSize(newWidth, newHeight);
      uniforms.uResolution.value.set(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (followMouse) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color, colorTwo, ringCount, speed, lineThickness, baseRadius, radiusStep, noiseAmount, opacity, ringGap, followMouse]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0, ...style }}
    />
  );
};
