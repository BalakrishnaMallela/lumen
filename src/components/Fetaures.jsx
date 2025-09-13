// src/pages/Features.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Wifi, Zap, Globe, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function Features() {
  const featuresRef = useRef();
  const featuresInView = useInView(featuresRef, { once: true, threshold: 0.2 });
  const [openIndex, setOpenIndex] = useState(null);

  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Seamless Mobile Plans",
      description:
        "Choose from flexible prepaid and postpaid plans designed for every lifestyle.",
      learnMore:
        "Enjoy unlimited calls, high-speed data, and roaming packs. Upgrade or downgrade your plan instantly with just one click.",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "High-Speed Connectivity",
      description:
        "Stay connected with ultra-fast 5G and reliable 4G LTE networks nationwide.",
      learnMore:
        "Experience uninterrupted streaming, online gaming, and smooth video calls with our industry-leading network infrastructure.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Usage Insights",
      description:
        "Get AI-powered analytics to monitor and optimize your data and call usage.",
      learnMore:
        "Our dashboard helps you predict your data needs, avoid bill shocks, and receive personalized plan recommendations in real-time.",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Roaming",
      description:
        "Travel without worries using our affordable international roaming packs.",
      learnMore:
        "Access coverage in 150+ countries with local rates, manage packs from the app, and track roaming usage in real time.",
      color: "from-orange-400 to-red-400",
    },
  ];

  return (
    <section ref={featuresRef} className="py-20 px-6 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={featuresInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Services?
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto font-bold">
            Experience cutting-edge connectivity, smarter plans, and personalized
            tools designed for the modern subscriber
          </p>
        </motion.div>

        {/* Feature Cards */}
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
              className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}
              >
                {feature.icon}
              </motion.div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70 text-lg font-bold leading-relaxed">
                {feature.description}
              </p>

              {/* Learn More Button */}
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center text-blue-400 mt-6 font-bold focus:outline-none"
                whileHover={{ x: 10 }}
              >
                <span>{openIndex === index ? "Show less" : "Learn more"}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>

              {/* Learn More Section (Slides Down) */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 text-white/80 text-md font-medium overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                      {feature.learnMore}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
