import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate("/home")} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1>Privacy Policy</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="doctor-details-content">
        <section className="doctor-about-section">
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
            AfyaNow is currently a prototype application. This privacy notice
            describes prototype-level data handling only and does not reflect
            a production privacy policy.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>1. Data We Store</h2>
          <p>
            Profile details, appointment bookings and account information you
            enter are stored only in your browser's local storage on this
            device. Nothing is sent to a remote server in this prototype.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>2. How Data Is Used</h2>
          <p>
            Locally stored data is used only to display your appointments,
            profile and activity within the app while you use it on this
            device.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>3. Clearing Your Data</h2>
          <p>
            You can remove all stored data at any time by clearing your
            browser's site data for this application.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>4. Future Changes</h2>
          <p>
            When AfyaNow moves beyond prototype stage and connects to a real
            backend, this policy will be replaced with a complete, legally
            reviewed privacy policy.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Privacy;
