import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { getAppointment } from "../data/appointments";

function BookingConfirmation() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    setAppointment(getAppointment());
  }, []);

  if (!appointment) {
    return (
      <div className="mobile-app">
        <div className="not-found-page">
          <h2>No Appointment Found</h2>
          <p>
            We couldn't find a recent booking. Please book an
            appointment with a specialist first.
          </p>
          <button
            className="primary-button"
            onClick={() => navigate("/specialists")}
          >
            Find a Specialist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <header className="details-header confirmation-header">
        <button
          className="back-button"
          onClick={() => navigate("/appointments/current")}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Appointment Confirmed</h1>
        <div className="header-spacer"></div>
      </header>

      <div className="confirmation-card">
        <div className="success-icon">✓</div>

        <h1>Appointment Confirmed</h1>
        <p>
          Your appointment with {appointment.doctorName} has
          been booked successfully. A confirmation has been
          saved to My Appointments.
        </p>

        <div className="confirmation-details">
          <div>
            <span>Doctor</span>
            <strong>{appointment.doctorName}</strong>
          </div>
          <div>
            <span>Specialty</span>
            <strong>{appointment.specialty}</strong>
          </div>
          <div>
            <span>Hospital</span>
            <strong>{appointment.hospital}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>{appointment.date}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{appointment.time}</strong>
          </div>
          <div>
            <span>Consultation Type</span>
            <strong>{appointment.consultationType}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className="confirmed-status">
              {appointment.status}
            </strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/appointments" className="primary-button">
            <CalendarDays size={16} />
            My Appointments
          </Link>
          <Link to="/home" className="secondary-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
