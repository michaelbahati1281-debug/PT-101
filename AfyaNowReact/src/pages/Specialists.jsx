import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Star,
  MapPin,
  Clock3,
  ChevronRight,
  Stethoscope,
  SlidersHorizontal,
  Home,
  Zap,
  Building2,
  Languages,
} from "lucide-react";

import { doctors, specialties, languageOptions } from "../data/doctors";
import { services } from "../data/services";
import { getSeverityLevel } from "../data/severity";
import { useGeolocation } from "../hooks/useGeolocation";
import { sortDoctors, SPECIALIST_SORT_OPTIONS } from "../utils/sort";
import { getDistanceKm, formatDistanceKm } from "../utils/geo";
import SortMenu from "../components/common/SortMenu";
import Badge from "../components/common/Badge";
import SeveritySelector from "../components/priority/SeveritySelector";

function Specialists() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [language, setLanguage] = useState("All");
  const [category, setCategory] = useState("All");
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [sortKey, setSortKey] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const { coords, status: locationStatus, error: locationError, requestLocation } = useGeolocation();

  useEffect(() => {
    const serviceId = searchParams.get("service");
    if (!serviceId) return;

    const service = services.find(
      (item) => item.id === Number(serviceId)
    );

    if (service && specialties.includes(service.name)) {
      setSelectedSpecialty(service.name);
    } else if (service) {
      setSearch(service.name);
    }
  }, [searchParams]);

  const handleSeverityChange = (severityId) => {
    setSeverity(severityId);
    const level = getSeverityLevel(severityId);
    if (level) {
      setCategory(level.recommendedCategory);
      if (severityId === "severe" || severityId === "emergency") {
        setSortKey("soonest");
      }
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase()) ||
        doctor.facilities.some((facility) =>
          facility.name.toLowerCase().includes(search.toLowerCase())
        );

      const matchesSpecialty =
        selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;

      const matchesLanguage =
        language === "All" || doctor.languages.includes(language);

      const matchesCategory =
        category === "All" || doctor.categories.includes(category);

      const matchesHomeService = !homeServiceOnly || doctor.homeService;

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesLanguage &&
        matchesCategory &&
        matchesHomeService
      );
    });
  }, [search, selectedSpecialty, language, category, homeServiceOnly]);

  const sortedDoctors = useMemo(
    () => sortDoctors(filteredDoctors, sortKey, coords),
    [filteredDoctors, sortKey, coords]
  );

  return (
    <div className="mobile-app">

      {/* HEADER */}

      <header className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>Find a Specialist</h1>
          <p>Choose a doctor that fits your needs</p>
        </div>

        <button
          className="icon-button"
          onClick={() => setShowFilters((prev) => !prev)}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={18} />
        </button>

      </header>

      <main className="specialists-content">

        {/* SEARCH */}

        <div className="specialists-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search doctor, specialty or facility..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        {/* QUICK FIND — CONDITION SEVERITY */}

        <section className="quick-find-section">
          <h2>Quick Find: how urgent is it?</h2>
          <SeveritySelector value={severity} onChange={handleSeverityChange} />
        </section>

        {/* SPECIALTIES */}

        <div className="specialty-scroll">

          {specialties.map((specialty) => (

            <button
              key={specialty}
              className={`specialty-button ${
                selectedSpecialty === specialty
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedSpecialty(specialty)
              }
            >
              {specialty}
            </button>

          ))}

        </div>

        {/* ADDITIONAL FILTERS */}

        {showFilters && (
          <div className="extra-filters">

            <div className="filter-block">
              <span className="filter-block-label">
                <Languages size={13} /> Language
              </span>
              <div className="category-scroll">
                {languageOptions.map((option) => (
                  <button
                    key={option}
                    className={`category-button${language === option ? " active" : ""}`}
                    onClick={() => setLanguage(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <span className="filter-block-label">Service category</span>
              <div className="category-toggle-compact">
                {["All", "standard", "priority"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`category-button${category === item ? " active" : ""}`}
                    onClick={() => setCategory(item)}
                  >
                    {item === "All" ? "All" : item === "priority" ? "Priority/Convenience" : "Standard"}
                  </button>
                ))}
              </div>
            </div>

            <label className="home-service-checkbox">
              <input
                type="checkbox"
                checked={homeServiceOnly}
                onChange={(event) => setHomeServiceOnly(event.target.checked)}
              />
              <Home size={13} />
              Home service available
            </label>

          </div>
        )}

        {/* RESULT HEADER + SORT */}

        <div className="specialists-heading">

          <div>
            <h2>Available Specialists</h2>

            <p>
              {sortedDoctors.length} specialist
              {sortedDoctors.length !== 1 ? "s" : ""}
              found
            </p>
          </div>

          <SortMenu
            options={SPECIALIST_SORT_OPTIONS}
            value={sortKey}
            onChange={setSortKey}
            onRequestLocation={requestLocation}
            locationStatus={locationStatus}
            locationError={locationError}
          />

        </div>

        {/* DOCTORS */}

        <div className="doctor-list">

          {sortedDoctors.map((doctor) => {
            const distanceKm = coords
              ? getDistanceKm(coords.lat, coords.lng, doctor.lat, doctor.lng)
              : null;

            return (
              <Link
                key={doctor.id}
                to={`/specialists/${doctor.id}`}
                className="doctor-card"
              >

                {/* DOCTOR AVATAR */}

                <div className="doctor-avatar">

                  <Stethoscope size={27} />

                </div>

                {/* INFORMATION */}

                <div className="doctor-information">

                  <div className="doctor-name-row">

                    <h3>{doctor.name}</h3>

                    <span className="verified-badge">
                      ✓
                    </span>

                  </div>

                  <p className="doctor-specialty">
                    {doctor.specialty}
                  </p>

                  <div className="doctor-hospital">

                    <MapPin size={12} />

                    <span>
                      {doctor.hospital}
                      {doctor.facilities.length > 1 && ` +${doctor.facilities.length - 1} more`}
                    </span>

                  </div>

                  <div className="doctor-bottom">

                    <span className="doctor-rating">

                      <Star
                        size={12}
                        fill="currentColor"
                      />

                      {doctor.rating}

                      <small>
                        ({doctor.reviews})
                      </small>

                    </span>

                    <span className="doctor-experience">
                      {distanceKm != null ? formatDistanceKm(distanceKm) + " away" : doctor.availability}
                    </span>

                  </div>

                  <div className="card-badge-row">
                    {doctor.categories.includes("priority") && (
                      <Badge tone="warning" icon={Zap}>Priority</Badge>
                    )}
                    {doctor.homeService && (
                      <Badge tone="success" icon={Home}>Home service</Badge>
                    )}
                    {doctor.facilities.length > 1 && (
                      <Badge tone="default" icon={Building2}>{doctor.facilities.length} facilities</Badge>
                    )}
                  </div>

                </div>

                <ChevronRight
                  size={18}
                  className="doctor-arrow"
                />

              </Link>

            );
          })}

        </div>

        {/* EMPTY STATE */}

        {sortedDoctors.length === 0 && (

          <div className="empty-doctors">

            <div className="empty-doctor-icon">
              <Search size={27} />
            </div>

            <h3>No specialists found</h3>

            <p>
              Try another doctor name, specialty or filter.
            </p>

            <button
              className="reset-button"
              onClick={() => {
                setSearch("");
                setSelectedSpecialty("All");
                setLanguage("All");
                setCategory("All");
                setHomeServiceOnly(false);
                setSeverity(null);
              }}
            >
              Reset Search
            </button>

          </div>

        )}

      </main>

      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-navigation">

        <Link
          to="/home"
          className="bottom-nav-item"
        >
          <span className="nav-symbol">⌂</span>
          <span>Home</span>
        </Link>

        <Link
          to="/services"
          className="bottom-nav-item"
        >
          <Stethoscope size={19} />
          <span>Services</span>
        </Link>

        <Link
          to="/appointments"
          className="bottom-nav-item"
        >
          <Clock3 size={19} />
          <span>Appointments</span>
        </Link>

        <Link
          to="/profile"
          className="bottom-nav-item"
        >
          <span>◯</span>
          <span>Profile</span>
        </Link>

      </nav>

    </div>
  );
}

export default Specialists;
