import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseMedical,
  Building2,
} from "lucide-react";

import { doctors } from "../data/doctors";
import {
  timeSlots,
  consultationTypes,
  saveAppointment,
} from "../data/appointments";
import { getServiceCategory } from "../data/categories";
import SeveritySelector from "../components/priority/SeveritySelector";
import CategoryToggle from "../components/priority/CategoryToggle";

function BookAppointment() {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const doctor = doctors.find(
    (item) => item.id === Number(doctorId)
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("in-person");
  const [facilityId, setFacilityId] = useState(
    doctor?.facilities?.[0]?.hospitalId ?? null
  );
  const [category, setCategory] = useState(
    doctor?.categories?.[0] ?? "standard"
  );
  const [severity, setSeverity] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [homeAddress, setHomeAddress] = useState({
    region: "",
    district: "",
    ward: "",
    street: "",
    description: "",
  });
  const [error, setError] = useState("");

  const availableConsultationTypes = useMemo(() => {
    if (!doctor) return [];
    return consultationTypes.filter(
      (item) => item.id !== "home-visit" || doctor.homeService
    );
  }, [doctor]);

  if (!doctor) {
    return (
      <div className="mobile-app">
        <div className="not-found-page">
          <h2>Doctor Not Found</h2>
          <p>
            The specialist you are trying to book with
            could not be found.
          </p>
          <button
            className="primary-button"
            onClick={() => navigate("/specialists")}
          >
            Back to Specialists
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const selectedFacility =
    doctor.facilities.find((facility) => facility.hospitalId === facilityId) ||
    doctor.facilities[0];

  const isHomeVisit = type === "home-visit";
  const priorityExtra = category === "priority" ? doctor.priorityFeeExtra || 0 : 0;
  const homeVisitExtra = isHomeVisit ? doctor.homeServiceFee || 0 : 0;
  const totalFee = doctor.feeValue + priorityExtra + homeVisitExtra;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!date || !time || !patientName || !phone) {
      setError(
        "Please fill in the date, time, full name and phone number."
      );
      return;
    }

    if (!severity) {
      setError("Please let us know how urgent your condition is.");
      return;
    }

    if (
      isHomeVisit &&
      (!homeAddress.region || !homeAddress.district || !homeAddress.ward || !homeAddress.street)
    ) {
      setError("Please provide your region, district, ward and street for the home visit.");
      return;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    const appointment = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospital: isHomeVisit ? "Home Visit" : selectedFacility.name,
      location: isHomeVisit ? homeAddress.street : selectedFacility.location,
      homeAddress: isHomeVisit ? homeAddress : null,
      date,
      time,
      consultationType:
        availableConsultationTypes.find((item) => item.id === type)
          ?.label || type,
      serviceCategory: getServiceCategory(category)?.label || category,
      severity,
      consultationFee: `TSh ${totalFee.toLocaleString()}`,
      patientName,
      phone,
      email,
      reason,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
    };

    saveAppointment(appointment);
    navigate("/booking-confirmation");
  };

  return (
    <div
      className="mobile-app"
      style={{ maxWidth: "900px" }}
    >
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => navigate(`/specialists/${doctor.id}`)}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Book Appointment</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="booking-page">
        <div className="booking-heading">
          <span>APPOINTMENT BOOKING</span>
          <h1>Book with {doctor.name}</h1>
          <p>
            Fill in your appointment details below. All fields
            marked required must be completed before confirming.
          </p>
        </div>

        {error && <div className="booking-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="booking-layout">
            <div className="booking-form-card">

              <div className="booking-section">
                <h2>How urgent is your condition?</h2>
                <SeveritySelector value={severity} onChange={setSeverity} />
              </div>

              {doctor.facilities.length > 1 && !isHomeVisit && (
                <div className="booking-section">
                  <h2>Choose Facility</h2>
                  <div className="facility-choice-list">
                    {doctor.facilities.map((facility) => (
                      <div
                        key={facility.hospitalId}
                        className={`appointment-type${
                          facilityId === facility.hospitalId ? " selected" : ""
                        }`}
                        onClick={() => setFacilityId(facility.hospitalId)}
                      >
                        <Building2 size={14} />
                        {facility.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="booking-section">
                <h2>Choose Date</h2>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>

              <div className="booking-section">
                <h2>Choose Time</h2>
                <div className="time-grid">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className={`time-slot${
                        time === slot ? " selected" : ""
                      }`}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>

              <div className="booking-section">
                <h2>Consultation Type</h2>
                <div className="appointment-types">
                  {availableConsultationTypes.map((item) => (
                    <div
                      key={item.id}
                      className={`appointment-type${
                        type === item.id ? " selected" : ""
                      }`}
                      onClick={() => setType(item.id)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {isHomeVisit && (
                <div className="booking-section">
                  <h2>Home Visit Location</h2>
                  <div className="form-row">
                    {[
                      ["region", "Region"],
                      ["district", "District"],
                      ["ward", "Ward"],
                      ["street", "Street"],
                    ].map(([field, label]) => (
                      <div className="form-group" key={field}>
                        <label>{label} <span>*</span></label>
                        <input
                          type="text"
                          value={homeAddress[field]}
                          onChange={(event) => setHomeAddress((current) => ({ ...current, [field]: event.target.value }))}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>Additional location description</label>
                    <textarea
                      rows={3}
                      placeholder="Landmark, building, or other directions"
                      value={homeAddress.description}
                      onChange={(event) => setHomeAddress((current) => ({ ...current, description: event.target.value }))}
                    />
                  </div>
                </div>
              )}

              {doctor.categories.length > 1 && (
                <div className="booking-section">
                  <h2>Service Category</h2>
                  <CategoryToggle
                    value={category}
                    onChange={setCategory}
                    availableIds={doctor.categories}
                    priorityFeeExtra={doctor.priorityFeeExtra}
                  />
                </div>
              )}

              <div className="booking-section">
                <h2>Patient Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Full Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={patientName}
                      onChange={(event) =>
                        setPatientName(event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Phone Number <span>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+255 7XX XXX XXX"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email (optional)"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Reason for Visit</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe your symptoms or reason for the visit"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="confirm-booking-btn">
                Confirm Appointment
              </button>
            </div>

            <div className="booking-form-card booking-summary">
              <h2>Appointment Summary</h2>

              <div className="summary-doctor">
                <div className="doctor-large-avatar" style={{ width: 65, height: 65 }}>
                  <BriefcaseMedical size={26} />
                </div>
                <div>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialty}</p>
                </div>
              </div>

              <div className="summary-item">
                <span>Facility</span>
                <strong>{isHomeVisit ? "Home Visit" : selectedFacility.name}</strong>
              </div>

              <div className="summary-item">
                <span>Location</span>
                <strong>{isHomeVisit ? "Patient's home" : selectedFacility.location}</strong>
              </div>

              <div className="summary-item">
                <span>Date</span>
                <strong>{date || "Not selected"}</strong>
              </div>

              <div className="summary-item">
                <span>Time</span>
                <strong>{time || "Not selected"}</strong>
              </div>

              <div className="summary-item">
                <span>Service Category</span>
                <strong>{getServiceCategory(category)?.label}</strong>
              </div>

              {homeVisitExtra > 0 && (
                <div className="summary-item">
                  <span>Home Visit Fee</span>
                  <strong>+TSh {homeVisitExtra.toLocaleString()}</strong>
                </div>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default BookAppointment;
