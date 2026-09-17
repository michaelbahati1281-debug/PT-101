import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowLeft, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Go to Specialists, choose a doctor, then tap Book Appointment. Fill in your preferred date, time and details, then confirm.",
  },
  {
    q: "Can I cancel my appointment?",
    a: "Yes. Open My Appointments, select your appointment, and tap Cancel Appointment. You'll be asked to confirm before it's cancelled.",
  },
  {
    q: "Can I reschedule my appointment?",
    a: "Yes. From Appointment Details, tap Reschedule Appointment and choose a new date and time.",
  },
  {
    q: "How do I find a specialist?",
    a: "Use the Specialists page to search or filter by specialty, or search directly from the Home page search bar.",
  },
  {
    q: "How does AfyaNow work?",
    a: "AfyaNow lets you discover healthcare services, find specialists, compare hospitals and book appointments — all in one app.",
  },
  {
    q: "Can I book an online consultation?",
    a: "Yes. When booking, choose \"Online Consultation\" as your consultation type instead of an in-person visit.",
  },
  {
    q: "How do I update my profile?",
    a: "Open Profile, tap Edit Profile, make your changes, then tap Save Changes.",
  },
];

function Help() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate("/home")} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1>Help &amp; FAQ</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="appointments-content">
        <div className="past-appointments-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q} className="past-appointment-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                    textAlign: "left",
                  }}
                >
                  <h4 style={{ fontSize: 15 }}>{item.q}</h4>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "0.2s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>
                {isOpen && (
                  <p style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Help;
