import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate("/home")} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1>Terms of Service</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="doctor-details-content">
        <section className="doctor-about-section">
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
            AfyaNow is currently a prototype application. The terms below are
            placeholder content for demonstration purposes only and do not
            constitute a legally binding agreement.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>1. Use of the Prototype</h2>
          <p>
            This application is a work-in-progress demonstration of a
            healthcare appointment platform. It is not connected to a real
            backend, and no real medical services are provided through it.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>2. Appointment Bookings</h2>
          <p>
            Appointments booked in this prototype are stored locally on your
            device and are not sent to any hospital or doctor. They exist
            only to demonstrate the booking flow.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>3. Account Information</h2>
          <p>
            Any name, phone number or email entered is stored locally on your
            device for prototype purposes and is not transmitted to a server.
          </p>
        </section>

        <section className="doctor-about-section">
          <h2>4. Changes</h2>
          <p>
            These prototype terms may change as the application is developed
            further toward a production-ready service.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Terms;
