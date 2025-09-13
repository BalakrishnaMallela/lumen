import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';

const QuestOffersPage = () => {
  const [toast, setToast] = useState({ show: false, message: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ price: 'all', discount: 'all' });
  const [sort, setSort] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedOffers, setDisplayedOffers] = useState(null);

  const offersData = [
    { id: 1, title: 'Premium Plan', price: 50, discount: 20, quota: '500GB', tags: ['Popular'], expiry: '2025-12-31' },
    { id: 2, title: 'Pro Plan', price: 30, discount: 10, quota: '200GB', tags: ['New'], expiry: '2025-11-15' },
    { id: 3, title: 'Starter Plan', price: 10, discount: 5, quota: '50GB', tags: ['Limited'], expiry: '2025-10-31' },
    { id: 4, title: 'Family Plan', price: 70, discount: 15, quota: '1TB', tags: ['Popular', 'New'], expiry: '2025-11-30' },
    { id: 5, title: 'Ultra Plan', price: 90, discount: 25, quota: '2TB', tags: ['Popular'], expiry: '2025-12-15' },
    { id: 6, title: 'Basic Plan', price: 15, discount: 8, quota: '100GB', tags: ['New'], expiry: '2025-10-20' },
    { id: 7, title: 'Business Plan', price: 120, discount: 30, quota: '5TB', tags: ['Limited'], expiry: '2025-12-05' },
    { id: 8, title: 'Student Plan', price: 5, discount: 5, quota: '20GB', tags: ['Popular'], expiry: '2025-09-30' },
    { id: 9, title: 'Enterprise Plan', price: 200, discount: 35, quota: '10TB', tags: ['Limited'], expiry: '2025-12-20' },
    { id: 10, title: 'Family Plus', price: 80, discount: 18, quota: '1.5TB', tags: ['New'], expiry: '2025-11-25' },
    { id: 11, title: 'Starter Plus', price: 20, discount: 7, quota: '100GB', tags: ['Popular'], expiry: '2025-10-15' },
    { id: 12, title: 'Pro Max', price: 150, discount: 28, quota: '3TB', tags: ['Popular', 'New'], expiry: '2025-12-10' },
    { id: 13, title: 'Ultimate Plan', price: 250, discount: 40, quota: '15TB', tags: ['Limited'], expiry: '2025-12-31' },
    { id: 14, title: 'Mini Plan', price: 8, discount: 6, quota: '30GB', tags: ['New'], expiry: '2025-10-05' },
    { id: 15, title: 'Mega Plan', price: 180, discount: 32, quota: '8TB', tags: ['Popular'], expiry: '2025-12-12' }
  ];

  const features = [
    { id: 1, title: 'Upgrade/Downgrade', description: 'Change your plan anytime easily.' },
    { id: 2, title: 'Auto Renewal', description: 'Never miss a renewal with auto-renew.' },
    { id: 3, title: 'AI Recommendations', description: 'Smart suggestions based on your usage.' },
    { id: 4, title: 'Discounts & Offers', description: 'Get personalized discounts & promotions.' },
  ];

  const promotions = [
    { id: 1, title: 'Recommended Plans & Top Offers', subtitle: 'Choose your best plan and enjoy exclusive discounts!' },
    { id: 2, title: 'Limited Time Offer!', subtitle: 'Get up to 40% off on premium plans.' },
    { id: 3, title: 'AI Suggested Plans', subtitle: 'Smart suggestions based on your usage.' },
  ];

  const handleApply = (offer) => {
    setToast({ show: true, message: `${offer.title} Applied! Discount: ${offer.discount}%` });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const getAIRecommendation = () => {
    const recommended = [...offersData]
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 3);
    setDisplayedOffers(recommended);
  };

  const filteredOffers = (displayedOffers || offersData)
    .filter((o) => o.title.toLowerCase().includes(search.toLowerCase()))
    .filter((o) => (filter.price === 'all' ? true : filter.price === 'low' ? o.price < 50 : o.price >= 50))
    .filter((o) => (filter.discount === 'all' ? true : o.discount >= 15));

  if (sort === 'priceAsc') filteredOffers.sort((a, b) => a.price - b.price);
  if (sort === 'priceDesc') filteredOffers.sort((a, b) => b.price - a.price);
  if (sort === 'discountDesc') filteredOffers.sort((a, b) => b.discount - a.discount);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promotions.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);

  const Navbar = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#111', color: '#fff', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
      <h2 style={{ color: '#1e90ff' }}>Quest 2.0</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Browse Plans</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>My Subscriptions</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Offers</a>
      </div>
    </div>
  );

  const OfferCard = ({ offer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, rotate: 1, boxShadow: '0px 10px 25px rgba(0,0,0,0.4)' }}
      transition={{ type: 'spring', stiffness: 120 }}
      style={{
        backgroundColor: '#1b1b1b',
        color: '#fff',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid #333',
        position: 'relative',
        minHeight: '220px',
        flex: '0 0 20%',
        boxSizing: 'border-box',
      }}
    >
      {offer.tags.map((tag) => (
        <span key={tag} style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#1e90ff', padding: '2px 6px', borderRadius: '5px', fontSize: '12px' }}>{tag}</span>
      ))}
      <h3>{offer.title}</h3>
      <p>Price: ${offer.price}</p>
      <p style={{ color: '#1e90ff' }}>Discount: {offer.discount}%</p>
      <p>Quota: {offer.quota}</p>
      <p>Expiry: {offer.expiry}</p>
      <button onClick={() => handleApply(offer)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#1e90ff', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}>Apply</button>
    </motion.div>
  );

  const FeatureCard = ({ feature }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: '#1b1b1b', color: '#fff', borderRadius: '10px', padding: '20px', margin: '10px', flex: '1 0 200px', border: '1px solid #333' }}
    >
      <h3 style={{ color: '#1e90ff' }}>{feature.title}</h3>
      <p>{feature.description}</p>
    </motion.div>
  );

  const FloatingShapes = () => {
    const shapes = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * 10 - 5,
      y: Math.random() * 5 - 2.5,
      z: Math.random() * 10 - 5,
      size: Math.random() * 0.8 + 0.2,
      color: ['#1e90ff', '#00ffcc', '#ff6347'][i % 3],
    }));

    return (
      <>
        {shapes.map((s, idx) => (
          <mesh key={idx} position={[s.x, s.y, s.z]}>
            <sphereGeometry args={[s.size, 16, 16]} />
            <meshStandardMaterial color={s.color} />
          </mesh>
        ))}
      </>
    );
  };

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{ position: 'relative', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}><FloatingShapes /></Suspense>
        </Canvas>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', width: '100%' }}>
          <motion.div
            key={promotions[currentSlide].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{ fontSize: '2.5rem', color: '#1e90ff' }}>{promotions[currentSlide].title}</h1>
            <p style={{ fontSize: '1.2rem' }}>{promotions[currentSlide].subtitle}</p>
          </motion.div>

          <button onClick={prevSlide} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>◀</button>
          <button onClick={nextSlide} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>▶</button>
        </div>
      </div>

      {/* Feature Section */}
      <div style={{ padding: '20px' }}>
        <h2 style={{ color: '#1e90ff', marginBottom: '10px' }}>Key Features</h2>
        <motion.div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.2 } } }}>
          {features.map((f) => <FeatureCard key={f.id} feature={f} />)}
        </motion.div>
      </div>

      {/* Filters */}
      <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', color: '#fff' }}>
        <input type="text" placeholder="Search offers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #333', flex: '1 0 200px', background: '#222', color: '#fff' }} />
        <select value={filter.price} onChange={(e) => setFilter({ ...filter, price: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }}>
          <option value="all">All Prices</option>
          <option value="low">Low &lt; 50</option>
          <option value="high">High &gt;= 50</option>
        </select>
        <select value={filter.discount} onChange={(e) => setFilter({ ...filter, discount: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }}>
          <option value="all">All Discounts</option>
          <option value="high">Discount ≥ 15%</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }}>
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low → High</option>
          <option value="priceDesc">Price: High → Low</option>
          <option value="discountDesc">Discount: High → Low</option>
        </select>
      </div>

      {/* AI Recommendation Button */}
      <div style={{ padding: '20px', marginTop: '10px' }}>
        <button onClick={getAIRecommendation} style={{ padding: '10px 20px', backgroundColor: '#1e90ff', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          AI Recommendation
        </button>
      </div>

      {/* Offers */}
      <div style={{ padding: '20px' }}>
        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', rowGap: '20px' }}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#1e90ff', color: '#fff', padding: '15px 20px', borderRadius: '10px', zIndex: 1000 }}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestOffersPage;
