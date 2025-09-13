import React from "react";
import { Wifi, Repeat, Headset, Shield } from "lucide-react"; // icons

const cardStyle = {
  background: "linear-gradient(145deg, #1f2937, #111827)",
  padding: "24px",
  borderRadius: "16px",
  flex: 1,
  textAlign: "center",
  minWidth: "220px",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
};

const iconStyle = {
  width: "40px",
  height: "40px",
  marginBottom: "12px",
  color: "#3b82f6",
};

export default function AboutUs() {
  const features = [
    { icon: <Wifi style={iconStyle} />, title: "Fast Connectivity", desc: "High speed internet plans for all your needs." },
    { icon: <Repeat style={iconStyle} />, title: "Flexible Plans", desc: "Easily upgrade or downgrade whenever you want." },
    { icon: <Headset style={iconStyle} />, title: "Reliable Support", desc: "24/7 customer support to assist you anytime." },
    { icon: <Shield style={iconStyle} />, title: "Secure Network", desc: "Advanced security measures for safe browsing." },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px", color: "#3b82f6" }}>
        About SubSync
      </h2>
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {features.map((feature, idx) => (
          <div
            key={idx}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
          >
            {feature.icon}
            <h3 style={{ color: "#fff", fontSize: "20px", marginBottom: "8px" }}>{feature.title}</h3>
            <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
