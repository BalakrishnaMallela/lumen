import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import * as THREE from "three";

export default function Error() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create network grid background
    const gridHelper = new THREE.GridHelper(400, 20, 0x0ea5e9, 0x334155);
    gridHelper.position.y = -100;
    scene.add(gridHelper);

    // Create floating network nodes
    const nodes = [];
    for (let i = 0; i < 15; i++) {
      const nodeGeometry = new THREE.SphereGeometry(3, 16, 16);
      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: 0x0ea5e9,
        emissive: 0x002244,
        transparent: true,
        opacity: 0.8,
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

      node.position.set(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 200,
      );

      node.userData = {
        originalY: node.position.y,
        floatSpeed: 0.5 + Math.random() * 0.5,
      };

      scene.add(node);
      nodes.push(node);
    }

    // Create network connections (lines between nodes)
    const connections = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const points = [nodes[i].position, nodes[i + 1].position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.3,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      connections.push(line);
    }

    // Create 3D Routers
    const routers = [];
    for (let i = 0; i < 4; i++) {
      const routerGroup = new THREE.Group();

      // Router body
      const routerGeometry = new THREE.BoxGeometry(20, 8, 15);
      const routerMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3748 });
      const routerBody = new THREE.Mesh(routerGeometry, routerMaterial);
      routerGroup.add(routerBody);

      // Router LED lights
      for (let j = 0; j < 6; j++) {
        const ledGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const ledMaterial = new THREE.MeshPhongMaterial({
          color: Math.random() > 0.5 ? 0x16a34a : 0xf59e0b,
          emissive: Math.random() > 0.5 ? 0x001100 : 0x221100,
        });
        const led = new THREE.Mesh(ledGeometry, ledMaterial);
        led.position.set(-8 + j * 3, 4.5, 8);
        routerGroup.add(led);
      }

      // Router antennas
      for (let k = 0; k < 2; k++) {
        const antennaGeometry = new THREE.CylinderGeometry(0.3, 0.3, 12);
        const antennaMaterial = new THREE.MeshPhongMaterial({
          color: 0x1a202c,
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(-5 + k * 10, 10, 0);
        routerGroup.add(antenna);
      }

      routerGroup.position.set(
        (Math.random() - 0.5) * 250,
        (Math.random() - 0.5) * 80,
        -150 - Math.random() * 100,
      );

      routerGroup.userData = {
        rotationSpeed: 0.005 + Math.random() * 0.01,
      };

      scene.add(routerGroup);
      routers.push(routerGroup);
    }

    // Create 3D Servers
    const servers = [];
    for (let i = 0; i < 3; i++) {
      const serverGroup = new THREE.Group();

      // Server rack
      const serverGeometry = new THREE.BoxGeometry(12, 30, 20);
      const serverMaterial = new THREE.MeshPhongMaterial({ color: 0x1a202c });
      const server = new THREE.Mesh(serverGeometry, serverMaterial);
      serverGroup.add(server);

      // Server slots
      for (let j = 0; j < 8; j++) {
        const slotGeometry = new THREE.BoxGeometry(10, 2, 18);
        const slotMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3748 });
        const slot = new THREE.Mesh(slotGeometry, slotMaterial);
        slot.position.y = -12 + j * 3.5;
        serverGroup.add(slot);

        // Status lights on each slot
        const lightGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const lightMaterial = new THREE.MeshPhongMaterial({
          color: Math.random() > 0.7 ? 0xdc2626 : 0x16a34a,
          emissive: Math.random() > 0.7 ? 0x110000 : 0x001100,
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(4, -12 + j * 3.5, 9.5);
        serverGroup.add(light);
      }

      serverGroup.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 60,
        -200 - Math.random() * 80,
      );

      scene.add(serverGroup);
      servers.push(serverGroup);
    }

    // Create Fiber Optic Cables (glowing curved lines)
    const fiberCables = [];
    for (let i = 0; i < 8; i++) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3((Math.random() - 0.5) * 200, -50, -100),
        new THREE.Vector3((Math.random() - 0.5) * 100, 50, -150),
        new THREE.Vector3((Math.random() - 0.5) * 200, -20, -200),
      );

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.6,
      });
      const cable = new THREE.Line(geometry, material);

      cable.userData = {
        pulseSpeed: 0.02 + Math.random() * 0.03,
      };

      scene.add(cable);
      fiberCables.push(cable);
    }

    // Create Network Switches
    const switches = [];
    for (let i = 0; i < 3; i++) {
      const switchGroup = new THREE.Group();

      // Switch body
      const switchGeometry = new THREE.BoxGeometry(25, 6, 12);
      const switchMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
      const switchBody = new THREE.Mesh(switchGeometry, switchMaterial);
      switchGroup.add(switchBody);

      // Ethernet ports
      for (let j = 0; j < 12; j++) {
        const portGeometry = new THREE.BoxGeometry(1.5, 2, 3);
        const portMaterial = new THREE.MeshPhongMaterial({ color: 0x1f2937 });
        const port = new THREE.Mesh(portGeometry, portMaterial);
        port.position.set(-10 + j * 1.8, -2, 6.5);
        switchGroup.add(port);

        // Port LED
        if (Math.random() > 0.4) {
          const ledGeometry = new THREE.SphereGeometry(0.3, 8, 8);
          const ledMaterial = new THREE.MeshPhongMaterial({
            color: 0x16a34a,
            emissive: 0x001100,
          });
          const led = new THREE.Mesh(ledGeometry, ledMaterial);
          led.position.set(-10 + j * 1.8, 0, 6.5);
          switchGroup.add(led);
        }
      }

      switchGroup.position.set(
        (Math.random() - 0.5) * 180,
        (Math.random() - 0.5) * 100,
        -120 - Math.random() * 60,
      );

      scene.add(switchGroup);
      switches.push(switchGroup);
    }

    // Create Data Packets (moving cubes)
    const dataPackets = [];
    for (let i = 0; i < 12; i++) {
      const packetGeometry = new THREE.BoxGeometry(2, 2, 2);
      const packetMaterial = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        emissive: 0x001122,
        transparent: true,
        opacity: 0.8,
      });
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);

      packet.position.set(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 200,
      );

      packet.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
        ),
        rotationSpeed: 0.02 + Math.random() * 0.03,
      };

      scene.add(packet);
      dataPackets.push(packet);
    }

    camera.position.set(0, 20, 120);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Float network nodes
      nodes.forEach((node) => {
        node.position.y =
          node.userData.originalY +
          Math.sin(time * node.userData.floatSpeed) * 5;
      });

      // Rotate routers slowly
      routers.forEach((router) => {
        router.rotation.y += router.userData.rotationSpeed;
      });

      // Pulse fiber cables
      fiberCables.forEach((cable) => {
        const material = cable.material;
        material.opacity =
          0.4 + Math.sin(time * cable.userData.pulseSpeed) * 0.3;
      });

      // Move data packets
      dataPackets.forEach((packet) => {
        packet.position.add(packet.userData.velocity);
        packet.rotation.x += packet.userData.rotationSpeed;
        packet.rotation.y += packet.userData.rotationSpeed;

        // Reset position if too far
        if (packet.position.length() > 200) {
          packet.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 100,
          );
        }
      });

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.1) * 10;
      camera.position.y = 20 + Math.cos(time * 0.15) * 5;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* 404 Text - Static, No Rotation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            type: "spring",
            stiffness: 80,
            damping: 12,
          }}
          className="mb-8"
        >
          <h1 className="text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-[#3b82f6] to-[#06b6d4] drop-shadow-2xl">
            404
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
            Network Connection Lost!
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto drop-shadow-md">
            The telecom inventory page you're looking for seems to be
            disconnected from our network infrastructure.
          </p>
        </motion.div>

        {/* Navigation Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <motion.button
            onClick={handleGoHome}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/10"
          >
             RETURN HOME
          </motion.button>
        </motion.div>

        {/* Floating Network Icons */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-16 text-3xl opacity-60"
        >
          📡
        </motion.div>

        <motion.div
          animate={{
            y: [0, 12, 0],
            x: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-32 right-20 text-2xl opacity-60"
        >
          🌐
        </motion.div>

        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-32 left-24 text-2xl opacity-60"
        >
          💾
        </motion.div>

        <motion.div
          animate={{
            x: [0, -18, 0],
            rotate: [0, 360],
          }}
          transition={{
            x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          }}
          className="absolute bottom-40 right-16 text-2xl opacity-60"
        >
          ⚡
        </motion.div>

        {/* Data Stream Effects */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{
            x: [window.innerWidth + 50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "linear",
          }}
          className="absolute top-1/4 text-blue-400 text-sm font-mono"
        >
          01110100 01100101 01101100
        </motion.div>

        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{
            x: [window.innerWidth + 80],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 6,
            delay: 2,
            ease: "linear",
          }}
          className="absolute bottom-1/3 text-cyan-400 text-xs font-mono"
        >
          packet_lost... retrying_connection...
        </motion.div>
      </div>

      {/* Loading overlay */}
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-4xl"
          >
            📡
          </motion.div>
        </motion.div>
      )}

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}



