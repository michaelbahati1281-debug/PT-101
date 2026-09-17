import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getAppointment, rescheduleAppointment, timeSlots } from "../data/appointments";

function RescheduleAppointment() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAppointment(getAppointment());
  }, []);

  if (!appointment) {
    return (
      <div className="mobile-app">
        <div className="not-found-page">
          <h2>Appointment Not Found</h2>
          <p>We couldn't find an appointment to reschedule.</p>
          <button
            className="primary-button"
            onClick={() => navigate("/appointments")}
          >
            Back to My Appointments
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const handleConfirm = () => {
    if (!date || !time) {
      setError("Please choose a new date and time.");
      return;
    }
    setError("");
    rescheduleAppointment(date, time);
    navigate("/appointments/current");
  };

  return (
    <div className="mobile-app" style={{ maxWidth: "600px" }}>
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => navigate("/appointments/current")}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Reschedule Appointment</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="booking-page">
        <div className="booking-form-card">
          <h2 style={{ marginBottom: 15 }}>Current Appointment</h2>

          <div className="summary-item">
            <span>Doctor</span>
            <strong>{appointment.doctorName}</strong>
          </div>
          <div className="summary-item">
            <span>Current Date</span>
            <strong>{appointment.date}</strong>
          </div>
          <div className="summary-item">
            <span>Current Time</span>
            <strong>{appointment.time}</strong>
          </div>

          {error && <div className="booking-error" style={{ marginTop: 20 }}>{error}</div>}

          <div className="booking-section">
            <h2>Choose New Date</h2>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="booking-section">
            <h2>Choose New Time</h2>
            <div className="time-grid">
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  className={`time-slot${time === slot ? " selected" : ""}`}
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          <button className="confirm-booking-btn" onClick={handleConfirm}>
            Confirm Reschedule
          </button>
        </div>
      </main>
    </div>
  );
}

export default RescheduleAppointment;
