import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email and message.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate("/home")} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1>Contact AfyaNow</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="booking-page">
        <div className="booking-form-card">
          {sent && (
            <div className="success-banner">
              Thank you! Your message has been received.
            </div>
          )}
          {error && <div className="booking-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+255 7XX XXX XXX" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows={5} name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" />
            </div>
            <button type="submit" className="confirm-booking-btn">Send Message</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
