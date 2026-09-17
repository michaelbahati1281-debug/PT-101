import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

import { services } from "../data/services";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = services.find(
    (item) => item.id === Number(id)
  );

  if (!service) {
    return (
      <div className="mobile-app">

        <main className="not-found-page">

          <h1>Service not found</h1>

          <Link
            to="/services"
            className="primary-button"
          >
            Back to Services
          </Link>

        </main>

      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="mobile-app">

      <header className="details-header">

        <button
          className="back-button"
          onClick={() => navigate("/services")}
        >
          <ArrowLeft size={21} />
        </button>

        <h1>Service Details</h1>

        <div className="header-spacer"></div>

      </header>

      <main className="service-details-content">

        <section className="service-hero">

          <div className="service-detail-icon">
            <Icon size={42} />
          </div>

          <h2>{service.name}</h2>

          <span className="detail-category">
            {service.category}
          </span>

          <p>
            {service.description}
          </p>

        </section>

        <section className="details-section">

          <h2>About this service</h2>

          <p>
            AfyaNow helps you discover healthcare providers
            offering {service.name.toLowerCase()} services and
            request an appointment based on your preferred
            date and time.
          </p>

        </section>

        <section className="details-section">

          <h2>What you can do</h2>

          <div className="benefit-list">

            <button
              type="button"
              className="benefit-item"
              onClick={() =>
                navigate(`/specialists?service=${service.id}`)
              }
            >
              <CheckCircle2 size={19} />
              <span>Find available specialists</span>
            </button>

            <button
              type="button"
              className="benefit-item"
              onClick={() => navigate("/hospitals")}
            >
              <CheckCircle2 size={19} />
              <span>Compare healthcare facilities</span>
            </button>

            <button
              type="button"
              className="benefit-item"
              onClick={() =>
                navigate(`/specialists?service=${service.id}`)
              }
            >
              <CheckCircle2 size={19} />
              <span>Choose a convenient appointment time</span>
            </button>

            <button
              type="button"
              className="benefit-item"
              onClick={() => navigate("/appointments")}
            >
              <CheckCircle2 size={19} />
              <span>Manage your appointment digitally</span>
            </button>

          </div>

        </section>

        <section className="service-info-grid">

          <button
            type="button"
            className="service-info-card"
            onClick={() =>
              navigate(`/specialists?service=${service.id}`)
            }
          >

            <Clock3 size={20} />

            <div>
              <strong>Flexible</strong>
              <span>Appointment times</span>
            </div>

          </button>

          <button
            type="button"
            className="service-info-card"
            onClick={() =>
              navigate(`/specialists?service=${service.id}`)
            }
          >

            <Users size={20} />

            <div>
              <strong>Specialists</strong>
              <span>Qualified providers</span>
            </div>

          </button>

          <button
            type="button"
            className="service-info-card"
            onClick={() => navigate("/hospitals")}
          >

            <MapPin size={20} />

            <div>
              <strong>Nearby</strong>
              <span>Healthcare facilities</span>
            </div>

          </button>

          <button
            type="button"
            className="service-info-card"
            onClick={() =>
              navigate(`/specialists?service=${service.id}`)
            }
          >

            <CalendarDays size={20} />

            <div>
              <strong>Easy booking</strong>
              <span>Digital appointment</span>
            </div>

          </button>

        </section>

        <Link
          to={`/specialists?service=${service.id}`}
          className="primary-button book-service-button"
        >
          Find Specialists
        </Link>

      </main>

    </div>
  );
}

export default ServiceDetails;