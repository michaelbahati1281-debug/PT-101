import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock3,
  Phone,
  Hospital as HospitalIcon,
  CalendarDays,
  Stethoscope,
  Home,
  Zap,
  MapPinned,
} from "lucide-react";

import { hospitals as bundledHospitals } from "../data/hospitals";
import { doctors } from "../data/doctors";
import Badge from "../components/common/Badge";
import { getHospital } from "../services/api";

function toDisplayShape(h) {
  return {
    ...h,
    location: h.address || h.location || h.region || "Location unavailable",
    lat: h.latitude != null ? Number(h.latitude) : h.lat,
    lng: h.longitude != null ? Number(h.longitude) : h.lng,
    type: h.description || h.type || "Healthcare facility",
    region: h.region || "Tanzania",
    rating: Number(h.rating || 0),
    reviews: h.reviews || 0,
    category: h.category || "standard",
    homeService: Boolean(h.homeService),
    about: h.about || h.description || "Healthcare services delivered by trusted providers.",
    hours: h.openingHours || "See facility for opening hours",
    phone: h.phone || "Contact the facility",
    services: h.services || [],
  };
}

function HospitalDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);

  const [hospital, setHospital] = useState(() =>
    Number.isInteger(numericId)
      ? bundledHospitals.find((item) => item.id === numericId) || null
      : null
  );
  const [notFound, setNotFound] = useState(!hospital);
  const [loading, setLoading] = useState(!hospital);

  useEffect(() => {
    if (hospital) return;

    let cancelled = false;

    async function loadFromApi() {
      try {
        const data = await getHospital(id);
        if (!cancelled) {
          setHospital(toDisplayShape(data));
          setNotFound(false);
        }
      } catch (err) {
        console.error("Hospital API error:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFromApi();
    return () => {
      cancelled = true;
    };
  }, [id, hospital]);

  if (loading) {
    return (
      <div className="mobile-app">
        <header className="details-header">
          <button
            className="back-button"
            onClick={() => navigate("/hospitals")}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Hospital Details</h1>
          <div className="header-spacer"></div>
        </header>
        <main className="doctor-details-content">
          <div className="no-results">
            <HospitalIcon size={25} />
            <p>Loading hospital...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!hospital || notFound) {
    return (
      <div className="mobile-app">
        <div className="not-found-page">
          <h2>Hospital Not Found</h2>
          <p>The facility you are looking for could not be found.</p>
          <button
            className="primary-button"
            onClick={() => navigate("/hospitals")}
          >
            Back to Hospitals
          </button>
        </div>
      </div>
    );
  }

  const hospitalSpecialists = doctors.filter((doctor) =>
    doctor.facilities.some((facility) => facility.name === hospital.name)
  );

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => navigate("/hospitals")}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Hospital Details</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="doctor-details-content">
        <section className="doctor-profile-card">
          <div className="doctor-large-avatar">
            <HospitalIcon size={36} />
          </div>

          <h2>{hospital.name}</h2>
          <p className="profile-specialty">{hospital.type}</p>

          <div className="profile-rating">
            <Star size={16} fill="currentColor" />
            <strong>{hospital.rating}</strong>
            <span>({hospital.reviews} reviews)</span>
          </div>

          <div className="card-badge-row" style={{ justifyContent: "center", marginTop: 10 }}>
            <Badge tone={hospital.category === "priority" ? "warning" : "default"} icon={hospital.category === "priority" ? Zap : undefined}>
              {hospital.category === "priority" ? "Priority/Convenience" : "Standard"}
            </Badge>
            {hospital.homeService && (
              <Badge tone="success" icon={Home}>Home service</Badge>
            )}
          </div>
        </section>

        <section className="doctor-info-section">
          <div className="doctor-detail-row">
            <div className="doctor-detail-icon">
              <MapPinned size={18} />
            </div>
            <div>
              <span>Region</span>
              <strong>{hospital.region}</strong>
            </div>
          </div>

          <div className="doctor-detail-row">
            <div className="doctor-detail-icon">
              <MapPin size={18} />
            </div>
            <div>
              <span>Location</span>
              <strong>{hospital.location}</strong>
            </div>
          </div>

          <div className="doctor-detail-row">
            <div className="doctor-detail-icon">
              <Clock3 size={18} />
            </div>
            <div>
              <span>Opening Hours</span>
              <strong>{hospital.hours}</strong>
            </div>
          </div>

          <div className="doctor-detail-row">
            <div className="doctor-detail-icon">
              <Phone size={18} />
            </div>
            <div>
              <span>Contact</span>
              <strong>{hospital.phone}</strong>
            </div>
          </div>
        </section>

        <section className="doctor-about-section">
          <h2>About</h2>
          <p>{hospital.about}</p>
        </section>

        {hospital.services?.length > 0 && (
          <section className="doctor-about-section">
            <h2>Available Services</h2>
            <div className="appointment-types">
              {hospital.services.map((service) => (
                <div key={service} className="appointment-type selected">
                  {service}
                </div>
              ))}
            </div>
          </section>
        )}

        {hospitalSpecialists.length > 0 && (
          <section className="doctor-about-section">
            <h2>Specialists Here</h2>
            <div className="doctor-list">
              {hospitalSpecialists.map((doctor) => (
                <Link
                  key={doctor.id}
                  to={`/specialists/${doctor.id}`}
                  className="hospital-card"
                  style={{ display: "flex" }}
                >
                  <div className="hospital-icon">
                    <Stethoscope size={20} />
                  </div>
                  <div className="hospital-info">
                    <h3>{doctor.name}</h3>
                    <div className="hospital-meta">
                      <span>{doctor.specialty}</span>
                      {doctor.facilities.length > 1 && (
                        <span>Also at {doctor.facilities.length - 1} other facilit{doctor.facilities.length - 1 === 1 ? "y" : "ies"}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link
          to="/specialists"
          className="primary-button book-doctor-button"
        >
          <CalendarDays size={18} />
          Find Specialists
        </Link>
        <Link
          to="/services"
          className="secondary-btn full-width"
          style={{ display: "block", textAlign: "center", padding: 13, marginTop: 10 }}
        >
          View Services
        </Link>
      </main>
    </div>
  );
}

export default HospitalDetails;