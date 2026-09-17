import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getAppointment, cancelAppointment } from "../data/appointments";

function AppointmentDetails() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAppointment(getAppointment());
  }, []);

  const handleConfirmCancel = () => {
    const updated = cancelAppointment();
    setAppointment(updated);
    setShowCancelModal(false);
    setMessage("Appointment cancelled successfully.");

    setTimeout(() => {
      navigate("/appointments");
    }, 1200);
  };

  if (!appointment) {
    return (
      <div className="mobile-app">
        <div className="not-found-page">
          <h2>Appointment Not Found</h2>
          <p>We couldn't find this appointment.</p>
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

  const rows = [
    ["Doctor", appointment.doctorName],
    ["Specialty", appointment.specialty],
    ["Hospital", appointment.hospital],
    ["Location", appointment.location],
    ["Date", appointment.date],
    ["Time", appointment.time],
    ["Consultation Type", appointment.consultationType],
    ["Patient Name", appointment.patientName],
    ["Phone Number", appointment.phone],
    ["Email", appointment.email || "Not provided"],
    ["Reason for Visit", appointment.reason || "Not provided"],
    ["Status", appointment.status],
  ];

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => navigate("/appointments")}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Appointment Details</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="appointments-content">
        {message && <div className="success-banner">{message}</div>}

        <div className="confirmation-details" style={{ marginTop: 10 }}>
          {rows.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong
                className={
                  label === "Status" && value === "Cancelled"
                    ? "status-cancelled-text"
                    : label === "Status" && value === "Confirmed"
                    ? "confirmed-status"
                    : ""
                }
              >
                {value}
              </strong>
            </div>
          ))}
        </div>

        {appointment.status === "Confirmed" && (
          <div className="confirmation-actions" style={{ marginTop: 25 }}>
            <button
              className="primary-button"
              onClick={() =>
                navigate("/appointments/current/reschedule")
              }
            >
              Reschedule Appointment
            </button>
            <button
              className="danger-btn"
              style={{ flex: 1, borderRadius: 9, fontWeight: 600 }}
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Appointment
            </button>
          </div>
        )}

        <button
          className="secondary-btn full-width"
          style={{ marginTop: 12, padding: 13 }}
          onClick={() => navigate("/appointments")}
        >
          Back to My Appointments
        </button>
      </main>

      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2>Cancel Appointment?</h2>
            <p>Are you sure you want to cancel this appointment?</p>
            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Appointment
              </button>
              <button className="danger-btn" onClick={handleConfirmCancel}>
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentDetails;
