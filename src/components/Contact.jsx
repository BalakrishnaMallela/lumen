import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react"; // Icons

export default function Contact({ showMessage }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      showMessage("Please fill all fields!", "#f87171");
      return;
    }
    showMessage("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #1f2937",
    background: "#111827",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    transition: "border 0.3s, box-shadow 0.3s",
  };

  const buttonStyle = (bg, color = "#fff") => ({
    padding: "12px 16px",
    borderRadius: "8px",
    border: "none",
    background: bg,
    color,
    cursor: "pointer",
    marginTop: "12px",
    fontWeight: "600",
    width: "100%",
    transition: "all 0.3s",
  });

  const cardStyle = {
    background: "linear-gradient(145deg, #1f2937, #111827)",
    padding: "24px",
    borderRadius: "16px",
    flex: 1,
    minWidth: "280px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  return (
    <div>
      <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px", color: "#3b82f6" }}>Contact Us</h2>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Contact Info */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
            <Mail color="#3b82f6" size={24} />
            <span style={{ marginLeft: "12px", color: "#fff", fontWeight: "500" }}>support@lumenquest.com</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
            <Phone color="#3b82f6" size={24} />
            <span style={{ marginLeft: "12px", color: "#fff", fontWeight: "500" }}>+91 98765 43210</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MapPin color="#3b82f6" size={24} />
            <span style={{ marginLeft: "12px", color: "#fff", fontWeight: "500" }}>123, Tech Street, Bengaluru, India</span>
          </div>
        </div>

        {/* Contact Form */}
        <div style={cardStyle}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: form.name ? "#3b82f6" : "#1f2937" }}
          />
          <input
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: form.email ? "#3b82f6" : "#1f2937" }}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "120px", borderColor: form.message ? "#3b82f6" : "#1f2937" }}
          />
          <button
            style={buttonStyle("#2563eb")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={handleSubmit}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
