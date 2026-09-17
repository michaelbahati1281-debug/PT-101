import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock3,
  ShieldCheck,
  CalendarDays,
  Languages,
  BriefcaseMedical,
  ChevronRight,
  Home,
  Zap,
  Building2,
} from "lucide-react";

import { doctors } from "../data/doctors";
import { serviceCategories } from "../data/categories";
import Badge from "../components/common/Badge";

function DoctorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const doctor = doctors.find(
    (item) => item.id === Number(id)
  );

  if (!doctor) {
    return (
      <div className="mobile-app">

        <div className="not-found-page">

          <h2>Doctor Not Found</h2>

          <p>
            The specialist you are looking for
            could not be found.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/specialists")
            }
          >
            Back to Specialists
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="mobile-app">

      {/* HEADER */}

      <header className="details-header">

        <button
          className="back-button"
          onClick={() =>
            navigate("/specialists")
          }
        >
          <ArrowLeft size={20} />
        </button>

        <h1>Doctor Profile</h1>

        <div className="header-spacer"></div>

      </header>

      <main className="doctor-details-content">

        {/* PROFILE */}

        <section className="doctor-profile-card">

          <div className="doctor-large-avatar">
            <BriefcaseMedical size={36} />
          </div>

          <div className="verified-profile">
            <ShieldCheck size={14} />
            Verified Specialist
          </div>

          <h2>{doctor.name}</h2>

          <p className="profile-specialty">
            {doctor.specialty}
          </p>

          <div className="profile-rating">

            <Star
              size={16}
              fill="currentColor"
            />

            <strong>{doctor.rating}</strong>

            <span>
              ({doctor.reviews} reviews)
            </span>

          </div>

          <div className="card-badge-row" style={{ justifyContent: "center", marginTop: 10 }}>
            {doctor.categories.includes("priority") && (
              <Badge tone="warning" icon={Zap}>Priority/Convenience</Badge>
            )}
            {doctor.categories.includes("standard") && (
              <Badge tone="default">Standard</Badge>
            )}
            {doctor.homeService && (
              <Badge tone="success" icon={Home}>Home service</Badge>
            )}
          </div>

        </section>

        {/* PRACTICES AT — MULTIPLE FACILITIES */}

        <section className="doctor-about-section">

          <h2>
            Practices At {doctor.facilities.length > 1 ? `(${doctor.facilities.length} facilities)` : ""}
          </h2>

          <div className="facility-list">
            {doctor.facilities.map((facility) => (
              <Link
                key={facility.hospitalId}
                to={`/hospitals/${facility.hospitalId}`}
                className="facility-item"
              >
                <div className="doctor-detail-icon">
                  <Building2 size={18} />
                </div>
                <div>
                  <strong>{facility.name}</strong>
                  <span>{facility.location}</span>
                  {facility.days && (
                    <span className="facility-days">
                      {facility.days.join(", ")}
                    </span>
                  )}
                </div>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>

        </section>

        {/* BASIC INFORMATION */}

        <section className="doctor-info-section">

          <div className="doctor-detail-row">

            <div className="doctor-detail-icon">
              <BriefcaseMedical size={18} />
            </div>

            <div>
              <span>Experience</span>
              <strong>{doctor.experience}</strong>
            </div>

          </div>

          <div className="doctor-detail-row">

            <div className="doctor-detail-icon">
              <Languages size={18} />
            </div>

            <div>
              <span>Languages</span>
              <div className="card-badge-row" style={{ marginTop: 4 }}>
                {doctor.languages.map((lang) => (
                  <Badge key={lang} tone="default">{lang}</Badge>
                ))}
              </div>
            </div>

          </div>

          {doctor.homeService && (
            <div className="doctor-detail-row">

              <div className="doctor-detail-icon">
                <Home size={18} />
              </div>

              <div>
                <span>Home Visit Fee</span>
                <strong>TSh {doctor.homeServiceFee?.toLocaleString()}</strong>
              </div>

            </div>
          )}

        </section>

        {/* ABOUT */}

        <section className="doctor-about-section">

          <h2>About the Specialist</h2>

          <p>
            {doctor.about}
          </p>

        </section>

        {/* SERVICE CATEGORY EXPLAINER */}

        <section className="doctor-about-section">
          <h2>Access Options</h2>
          <div className="category-toggle-detailed">
            {serviceCategories
              .filter((category) => doctor.categories.includes(category.id))
              .map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="category-card">
                    <Icon size={20} />
                    <div>
                      <strong>{category.label}</strong>
                      <p>{category.description}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* AVAILABILITY */}

        <section className="availability-card">

          <div className="availability-icon">
            <Clock3 size={20} />
          </div>

          <div>

            <span>Availability</span>

            <strong>
              {doctor.availability}
            </strong>

          </div>

          <ChevronRight size={18} />

        </section>

        {/* BOOK BUTTON */}

        <Link
          to={`/booking/${doctor.id}`}
          className="primary-button book-doctor-button"
        >
          <CalendarDays size={18} />
          Book Appointment
        </Link>

      </main>

    </div>
  );
}

export default DoctorDetails;
