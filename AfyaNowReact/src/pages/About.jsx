import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowLeft, Search, UserRound, CalendarDays, ClipboardList, HeartPulse } from "lucide-react";

function About() {
  const navigate = useNavigate();

  const points = [
    { icon: Search, title: "Find healthcare services", text: "Browse categories like General Medicine, Cardiology, Dentistry and more." },
    { icon: UserRound, title: "Find specialists", text: "Search verified doctors by specialty, hospital or location." },
    { icon: ClipboardList, title: "Compare options", text: "Review consultation fees, ratings and availability before booking." },
    { icon: CalendarDays, title: "Book appointments", text: "Choose a date, time and consultation type in a few taps." },
    { icon: HeartPulse, title: "Manage appointments", text: "View, reschedule or cancel appointments anytime from one place." },
  ];

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate("/home")} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1>About AfyaNow</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="doctor-details-content">
        <section className="doctor-about-section">
          <h2>Our Mission</h2>
          <p>
            To make quality healthcare simple to find and easy to access for
            every patient in Tanzania, by connecting them with trusted
            hospitals and specialists in one place.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>Our Vision</h2>
          <p>
            A future where booking a doctor's appointment is as easy as
            ordering a ride — fast, transparent and stress-free.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>How AfyaNow Works</h2>
          <p>AfyaNow helps patients:</p>
        </section>

        <section className="doctor-info-section">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="doctor-detail-row">
                <div className="doctor-detail-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <span>{point.title}</span>
                  <strong style={{ fontWeight: 500 }}>{point.text}</strong>
                </div>
              </div>
            );
          })}
        </section>

        <section className="doctor-about-section">
          <h2>Why Choose AfyaNow?</h2>
          <p>
            We bring together verified specialists, realistic Tanzanian
            healthcare facilities, and a straightforward booking flow —
            all designed around what patients actually need.
          </p>
        </section>

        <Link to="/specialists" className="primary-button book-doctor-button">
          <CalendarDays size={18} />
          Book an Appointment
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default About;
