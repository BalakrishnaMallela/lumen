import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const loadingSteps = [
  "Booting core systems...",
  "Establishing network link...",
  "Authenticating credentials...",
  "Loading inventory database...",
  "Syncing device statuses...",
  "Finalizing UI..."
];

const ThreeJSAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // 3D Object: Wireframe Globe
    const geometry = new THREE.IcosahedronGeometry(1.8, 4);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      linewidth: 1,
      transparent: true,
      opacity: 0.4
    });
    const globe = new THREE.LineSegments(wireframe, material);
    scene.add(globe);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      globe.rotation.y = 0.1 * elapsedTime;
      particlesMesh.rotation.y = -0.02 * elapsedTime;
      
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default function Preloader({ onComplete, duration = 5000, audioSrc, volume = 0.5 }) {
  const [progress, setProgress] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // Audio management
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      const audio = audioRef.current;
      
      const handleCanPlay = () => {
        audio.volume = volume;
        audio.play().then(() => {
          setAudioPlaying(true);
        }).catch(error => {
          console.log('Audio autoplay failed:', error);
          // Fallback: try to play on first user interaction
          const handleFirstInteraction = () => {
            audio.play().then(() => setAudioPlaying(true));
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
          };
          document.addEventListener('click', handleFirstInteraction);
          document.addEventListener('keydown', handleFirstInteraction);
        });
      };

      const handleError = (error) => {
        console.error('Audio loading error:', error);
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioSrc, volume]);

  // Progress and steps management
  useEffect(() => {
    const totalSteps = loadingSteps.length;
    let step = 0;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        
        const nextStep = Math.min(Math.floor((newProgress / 100) * totalSteps), totalSteps - 1);
        if(nextStep > step) {
          step = nextStep;
          setCurrentStep(step);
        }
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setCurrentStep(totalSteps-1);
          setTimeout(() => {
            // Fade out audio
            if (audioRef.current && audioPlaying) {
              const audio = audioRef.current;
              const fadeOut = setInterval(() => {
                if (audio.volume > 0.1) {
                  audio.volume -= 0.1;
                } else {
                  audio.pause();
                  audio.currentTime = 0;
                  setAudioPlaying(false);
                  clearInterval(fadeOut);
                }
              }, 50);
            }
            
            setShowPreloader(false);
            setTimeout(() => onComplete && onComplete(), 1000);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [duration, onComplete, audioPlaying]);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  
  const containerVariants = {
    initial: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[9999] bg-[#0A0F1A] flex items-center justify-center overflow-hidden"
        >
          {/* Audio Element */}
          {audioSrc && (
            <audio
              ref={audioRef}
              src={audioSrc}
              loop
              preload="auto"
              className="hidden"
            />
          )}

          <ThreeJSAnimation />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-[#0A0F1A] z-10" />

          <div className="relative z-20 text-center max-w-lg mx-auto px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-light text-slate-100 mb-2 tracking-wider">
                Subscription
              </h1>
              <p className="text-blue-300/70 text-sm font-medium tracking-widest uppercase">
              Mangement System 
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="space-y-4"
            >
              <div className="relative w-full h-1 bg-blue-500/10 rounded-full">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-sm h-5">
                 <motion.span 
                  key={currentStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-slate-400 font-medium"
                >
                  {loadingSteps[currentStep]}
                </motion.span>
                <div className="flex items-center gap-2">
                  {audioPlaying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    />
                  )}
                  <span className="text-blue-300 font-semibold tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}