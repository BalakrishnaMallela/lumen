import { useEffect, useRef, useState } from "react";
import Preloader from './Preloader';
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  CylinderGeometry,
  SphereGeometry,
  LineBasicMaterial,
  BufferGeometry,
  Vector3,
  Line,
  PlaneGeometry,
} from "three";
import {
  CreditCard,
  Users,
  BarChart3,
  Settings,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Globe,
  DollarSign,
  LogOut,
  Bell,
  Calendar,
  TrendingUp,
  Target,
  Repeat,
  UserCheck,
} from "lucide-react";

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const heroRef = useRef();
  const featuresRef = useRef();
  const statsRef = useRef();

  const heroInView = useInView(heroRef, { once: true, threshold: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, threshold: 0.2 });
  const statsInView = useInView(statsRef, { once: true, threshold: 0.3 });

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.isLoggedIn) {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    checkLoginStatus();
    // Check periodically for changes
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Three.js Scene
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    sceneRef.current = scene;
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create subscription dashboard center piece
    const dashboardGeometry = new BoxGeometry(3, 2, 0.2);
    const dashboardMaterial = new MeshPhongMaterial({ color: 0x4a90e2 });
    const dashboard = new Mesh(dashboardGeometry, dashboardMaterial);
    dashboard.position.y = 1;
    scene.add(dashboard);

    // Create floating credit cards
    const cards = [];
    const cardGeometry = new PlaneGeometry(1.5, 1, 1);
    const cardMaterials = [
      new MeshPhongMaterial({ color: 0x50fa7b }), // Green
      new MeshPhongMaterial({ color: 0xff79c6 }), // Pink
      new MeshPhongMaterial({ color: 0x8be9fd }), // Cyan
      new MeshPhongMaterial({ color: 0xf1fa8c }), // Yellow
    ];

    for (let i = 0; i < 6; i++) {
      const card = new Mesh(
        cardGeometry,
        cardMaterials[i % cardMaterials.length],
      );
      card.position.set(
        (Math.random() - 0.5) * 12,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 8,
      );
      card.rotation.z = Math.random() * 0.3;
      cards.push(card);
      scene.add(card);
    }

    // Create user nodes
    const users = [];
    const userGeometry = new SphereGeometry(0.3, 16, 16);
    const userMaterial = new MeshPhongMaterial({ color: 0x9b59b6 });

    for (let i = 0; i < 8; i++) {
      const user = new Mesh(userGeometry, userMaterial);
      user.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 8,
        (Math.random() - 0.5) * 10,
      );
      users.push(user);
      scene.add(user);
    }

    // Create connecting lines between users and dashboard
    const lines = [];
    users.forEach((user) => {
      const points = [user.position, dashboard.position];
      const geometry = new BufferGeometry().setFromPoints(points);
      const material = new LineBasicMaterial({
        color: 0x6272a4,
        opacity: 0.4,
        transparent: true,
      });
      const line = new Line(geometry, material);
      lines.push(line);
      scene.add(line);
    });

    camera.position.z = 8;
    camera.position.y = 3;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate dashboard
      dashboard.rotation.y += 0.008;
      dashboard.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;

      // Animate floating cards
      cards.forEach((card, index) => {
        card.position.y += Math.sin(Date.now() * 0.0015 + index) * 0.012;
        card.rotation.z += 0.005;
        card.rotation.y += 0.008;
      });

      // Animate user nodes
      users.forEach((user, index) => {
        user.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        user.rotation.x += 0.015;
        user.rotation.y += 0.01;
      });

      // Update connection lines
      lines.forEach((line, index) => {
        if (index < users.length) {
          const points = [users[index].position, dashboard.position];
          line.geometry.setFromPoints(points);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Subscription Analytics",
      description:
        "Track subscription metrics, revenue trends, and customer lifetime value in real-time",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Management",
      description:
        "Manage subscribers, track engagement, and automate customer communications",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Revenue Insights",
      description:
        "Get detailed revenue analytics, churn predictions, and growth forecasts",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Billing & Payments",
      description:
        "Automated billing, payment processing, and dunning management for subscriptions",
      color: "from-orange-400 to-red-400",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Payment Uptime" },
    { value: "50K+", label: "Active Subscribers" },
    { value: "1M+", label: "Transactions Processed" },
    { value: "24/7", label: "Support" },
  ];

  const subscriptionItems = [
    { icon: <CreditCard className="w-6 h-6" />, name: "Payment Methods" },
    { icon: <Users className="w-6 h-6" />, name: "Subscribers" },
    { icon: <Bell className="w-6 h-6" />, name: "Notifications" },
    { icon: <Calendar className="w-6 h-6" />, name: "Billing Cycles" },
    { icon: <TrendingUp className="w-6 h-6" />, name: "Analytics" },
    { icon: <Target className="w-6 h-6" />, name: "Goals" },
    { icon: <Repeat className="w-6 h-6" />, name: "Recurring Plans" },
    { icon: <UserCheck className="w-6 h-6" />, name: "Customer Success" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0"
        style={{ background: "transparent" }}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-10">
        <motion.div className="absolute inset-0" style={{ y, opacity }}>
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.2) 0%, transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(139, 233, 253, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 40% 40%, rgba(155, 89, 182, 0.1) 0%, transparent 60%),
                linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(17,24,39,0.8) 100%)
              `,
            }}
          />
        </motion.div>
      </div>

      {/* Floating Subscription Items */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        {subscriptionItems.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20"
            initial={{ x: -100, y: Math.random() * window.innerHeight }}
            animate={{
              x: window.innerWidth + 100,
              y: Math.random() * window.innerHeight,
              rotate: 360,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: index * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              top: Math.random() * window.innerHeight,
              fontSize: Math.random() * 20 + 30,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="relative z-30">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="fixed top-0 w-full p-6 z-50"
        >
          <div
            className="max-w-7xl mx-auto backdrop-blur-3xl bg-black/20 border border-white/20 rounded-2xl px-8 py-4 shadow-2xl"
            style={{
              background: `
                linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%),
                rgba(0,0,0,0.2)
              `,
              backdropFilter: "blur(20px)",
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.4), 
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            <div className="flex justify-between items-center">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white font-bold" />
                </div>
                <span className="text-xl font-bold text-white">Subsync</span>
              </motion.div>

              <div className="hidden md:flex space-x-8">
                <motion.div
                  key="Home"
                  onClick={() => navigate('/')}
                  className="text-white/80 hover:text-white font-bold transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.div>

                <motion.div
                  key="Features"
                  onClick={() => navigate('/features')}
                  className="text-white/80 hover:text-white font-bold transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Features
                </motion.div>

                <motion.div
                  key="about"
                  onClick={() => navigate('/about')}
                  className="text-white/80 hover:text-white font-bold transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  about
                </motion.div>

                <motion.div
                  key="subscription"
                  onClick={() => navigate('/subscribe')}
                  className="text-white/80 hover:text-white font-bold transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  subscription
                </motion.div>

                <motion.div
                  key="Offers"
                  onClick={() => navigate('/offers')}
                  className="text-white/80 hover:text-white font-bold transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  offers
                </motion.div>
                <motion.div
                  key="Contact"
                  onClick={() => navigate('/contact')}
                  className="text-white/80 hover:text-white font-bold transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact
                </motion.div>
              </div>
               

              {/* Login/User Section */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-bold text-sm">
                        Welcome, {user.name}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-400/30 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(79, 172, 254, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/login")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200"
                  >
                    Login
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="min-h-screen flex items-center justify-center px-6 pt-32"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
                initial={{ y: 100, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Subscription{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  Management
                </span>
                <br />
                Simplified
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-bold"
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Transform your subscription business with powerful analytics, automated billing,
                and intelligent customer insights to maximize revenue and reduce churn.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(79, 172, 254, 0.4)",
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 transition-all duration-300"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={statsInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={
                      statsInView
                        ? {
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2"
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/60 font-bold text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={featuresInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful Features for{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Subscription Success
                </span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto font-bold">
                Everything you need to build, manage, and scale your subscription business
                with confidence and ease
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                  animate={featuresInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
                  }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 text-lg font-bold leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className="flex items-center text-blue-400 mt-6 font-bold"
                    whileHover={{ x: 10 }}
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Showcase */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Automated Billing */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <DollarSign className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-4">Automated Billing</h3>
                <p className="text-white/70">
                  Set up recurring payments, handle failed transactions, and manage billing cycles effortlessly
                </p>
              </motion.div>

              {/* Customer Insights */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-4">Customer Insights</h3>
                <p className="text-white/70">
                  Deep analytics on customer behavior, engagement patterns, and lifetime value metrics
                </p>
              </motion.div>

              {/* Smart Notifications */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Bell className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-4">Smart Notifications</h3>
                <p className="text-white/70">
                  Automated alerts for payment failures, subscription changes, and customer milestones
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="text-xl text-white/80">
                Everything you need to know about our subscription management platform
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "How quickly can I set up my subscription business?",
                  answer: "You can have your subscription business up and running in less than 30 minutes with our intuitive setup wizard and pre-built templates."
                },
                {
                  question: "What payment methods do you support?",
                  answer: "We support all major credit cards, digital wallets like PayPal and Apple Pay, bank transfers, and cryptocurrency payments."
                },
                {
                  question: "How do you handle failed payments?",
                  answer: "Our intelligent dunning management system automatically retries failed payments, sends customized notifications, and helps reduce involuntary churn."
                },
                {
                  question: "Can I customize billing cycles?",
                  answer: "Yes! Set up any billing frequency - weekly, monthly, quarterly, annually, or create custom billing cycles that fit your business model."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-white/70">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/20 rounded-3xl p-12"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(79, 172, 254, 0.3)",
                    "0 0 40px rgba(79, 172, 254, 0.6)",
                    "0 0 20px rgba(79, 172, 254, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex p-4 rounded-full bg-blue-600/20 mb-8"
              >
                <Zap className="w-8 h-8 text-blue-400" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Scale Your
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Subscription Business?
                </span>
              </h2>

              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto font-bold">
                Join thousands of businesses who trust SubsManager to automate their billing,
                reduce churn, and accelerate growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(79, 172, 254, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  Start Your Free Trial
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Schedule Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white font-bold" />
              </div>
              <span className="text-lg font-bold text-white">SubsManager</span>
            </div>
            <p className="text-white/60 font-bold">
              © 2025 SubsManager. All rights reserved. Powering subscription businesses worldwide.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function Landing() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Preloader 
        onComplete={() => setIsLoading(false)}
        duration={3000}
        volume={0.9}
      />
      <AnimatePresence>
        {!isLoading && <Hero />}
      </AnimatePresence>
    </>
  );
}


