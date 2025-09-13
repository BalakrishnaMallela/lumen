import React, { useState, useEffect } from "react";
import axios from 'axios';

// Base URL for the backend API, running on port 8081
const API_BASE_URL = 'http://localhost:8081/api';

// Subscription plans data (sorted by tier)
const subscriptionPlans = [
  { id: 1, name: "Basic Copper", price: 599, speed: "25 Mbps", data: "250 GB", popular: false },
  { id: 4, name: "Basic Fibernet", price: 999, speed: "50 Mbps", data: "500 GB", popular: false },
  { id: 5, name: "Premium Copper", price: 1299, speed: "50 Mbps", data: "750 GB", popular: false },
  { id: 2, name: "Premium Fibernet", price: 1999, speed: "100 Mbps", data: "1 TB", popular: true },
  { id: 3, name: "Enterprise Fibernet", price: 3999, speed: "200 Mbps", data: "Unlimited", popular: false },
];

export default function Subscription() {
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [message, setMessage] = useState("");
  const [upgradeSelect, setUpgradeSelect] = useState("");
  const [downgradeSelect, setDowngradeSelect] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded user ID for demonstration purposes
  const userId = 'user123';

  // Show notification message
  const showMessage = (msg, color = "#22c55e") => {
    setMessage({ text: msg, color });
    setTimeout(() => setMessage(""), 3000);
  };

  // Fetch user's current subscription on component load
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/subscriptions/${userId}`);
        setUserSubscriptions(response.data);
      } catch (err) {
        setError("Failed to fetch subscriptions.");
        console.error(err);
        setUserSubscriptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserSubscription();
  }, [userId]);

  // Subscribe to a plan
  const subscribePlan = async (plan) => {
    if (userSubscriptions.length > 0) {
      showMessage("Cancel your existing subscription before subscribing to a new plan!", "#f87171");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/subscriptions/${userId}/subscribe`, { planId: plan.id });
      setUserSubscriptions([plan]);
      showMessage(`Subscribed to ${plan.name}!`);
    } catch (err) {
      showMessage("Subscription failed!", "#f87171");
      console.error(err);
    }
  };

  // Upgrade plan
  const upgradePlan = async () => {
    if (!upgradeSelect) return;
    const plan = subscriptionPlans.find(p => p.id === parseInt(upgradeSelect, 10));
    try {
      await axios.put(`${API_BASE_URL}/subscriptions/${userId}/update`, { planId: plan.id });
      setUserSubscriptions([plan]);
      showMessage(`Upgraded to ${plan.name}!`);
      setUpgradeSelect("");
    } catch (err) {
      showMessage("Upgrade failed!", "#f87171");
      console.error(err);
    }
  };

  // Downgrade plan
  const downgradePlan = async () => {
    if (!downgradeSelect) return;
    const plan = subscriptionPlans.find(p => p.id === parseInt(downgradeSelect, 10));
    try {
      await axios.put(`${API_BASE_URL}/subscriptions/${userId}/update`, { planId: plan.id });
      setUserSubscriptions([plan]);
      showMessage(`Downgraded to ${plan.name}!`);
      setDowngradeSelect("");
    } catch (err) {
      showMessage("Downgrade failed!", "#f87171");
      console.error(err);
    }
  };

  // Cancel subscription
  const cancelPlan = async () => {
    if (userSubscriptions.length === 0) {
      showMessage("No active subscription to cancel!", "#f87171");
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/subscriptions/${userId}/cancel`);
      setUserSubscriptions([]);
      showMessage("Subscription cancelled successfully!");
    } catch (err) {
      showMessage("Cancellation failed!", "#f87171");
      console.error(err);
    }
  };

  // Styles
  const cardStyle = {
    background: "#111827",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #1f2937",
    flex: 1,
    textAlign: "center",
    minWidth: "220px",
    transition: "all 0.3s",
    cursor: "pointer",
    position: "relative",
  };

  const popularBadge = {
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#2563eb",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  };

  const buttonStyle = (bg, color = "#fff") => ({
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: bg,
    color,
    cursor: "pointer",
    marginTop: "12px",
    fontWeight: "600",
    minWidth: "120px",
    transition: "all 0.2s",
  });

  const selectStyle = {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #1f2937",
    background: "#111827",
    color: "#fff",
    marginRight: "8px",
    fontWeight: "500",
    cursor: "pointer",
  };

  // Get index of current subscription
  const currentIndex = userSubscriptions.length
    ? subscriptionPlans.findIndex(p => p.id === userSubscriptions[0].id)
    : -1;

  // Upgrade options = higher tier plans only
  const upgradeOptions = currentIndex >= 0 ? subscriptionPlans.slice(currentIndex + 1) : [];
  // Downgrade options = lower tier plans only
  const downgradeOptions = currentIndex > 0 ? subscriptionPlans.slice(0, currentIndex) : [];

  return (
    <div style={{ padding: "32px", background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      {/* Message Notification */}
      {message && (
        <div style={{ background: message.color, padding: "12px 20px", borderRadius: "8px", marginBottom: "24px", maxWidth: "500px" }}>
          {message.text}
        </div>
      )}

      {isLoading && <p>Loading subscriptions...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {!isLoading && !error && (
        <>
          {/* Available Plans */}
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Available Plans</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {subscriptionPlans.map(plan => (
              <div key={plan.id} style={cardStyle}>
                {plan.popular && <div style={popularBadge}>Most Popular</div>}
                <h3 style={{ color: "#3b82f6", marginBottom: "8px" }}>{plan.name}</h3>
                <p>Speed: {plan.speed}</p>
                <p>Data: {plan.data}</p>
                <p>Price: ₹{plan.price}/month</p>
                <button
                  style={buttonStyle(userSubscriptions[0]?.id === plan.id ? "#facc15" : "#2563eb", userSubscriptions[0]?.id === plan.id ? "#000" : "#fff")}
                  onClick={() => subscribePlan(plan)}
                  disabled={userSubscriptions[0]?.id === plan.id}
                >
                  {userSubscriptions[0]?.id === plan.id ? "Subscribed" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>

          {/* My Subscription */}
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>My Subscription</h2>
          {userSubscriptions.length === 0 ? (
            <p>No active subscriptions</p>
          ) : (
            <div style={{ ...cardStyle, textAlign: "left", maxWidth: "400px" }}>
              <h3 style={{ color: "#3b82f6" }}>{userSubscriptions[0].name}</h3>
              <p>Speed: {userSubscriptions[0].speed}</p>
              <p>Data: {userSubscriptions[0].data}</p>
              <p>Price: ₹{userSubscriptions[0].price}/month</p>

              {upgradeOptions.length > 0 && (
                <>
                  <select style={selectStyle} value={upgradeSelect} onChange={e => setUpgradeSelect(e.target.value)}>
                    <option value="">Select upgrade plan</option>
                    {upgradeOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <button style={buttonStyle("#22c55e")} onClick={upgradePlan} disabled={!upgradeSelect}>Upgrade</button>
                </>
              )}

              {downgradeOptions.length > 0 && (
                <>
                  <select style={selectStyle} value={downgradeSelect} onChange={e => setDowngradeSelect(e.target.value)}>
                    <option value="">Select downgrade plan</option>
                    {downgradeOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <button style={buttonStyle("#facc15", "#000")} onClick={downgradePlan} disabled={!downgradeSelect}>Downgrade</button>
                </>
              )}

              <div>
                <button style={buttonStyle("#ef4444")} onClick={cancelPlan}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}