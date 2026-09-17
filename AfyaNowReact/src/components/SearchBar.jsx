import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Stethoscope, UserRound, Hospital, X } from "lucide-react";

import { doctors } from "../data/doctors";
import { services } from "../data/services";
import { hospitals } from "../data/hospitals";

function SearchBar({ placeholder = "Search doctors, services, hospitals..." }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();

  const matchedDoctors = q
    ? doctors
        .filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q) ||
            d.hospital.toLowerCase().includes(q) ||
            d.facilities.some((facility) => facility.name.toLowerCase().includes(q)) ||
            d.languages.some((lang) => lang.toLowerCase().includes(q))
        )
        .slice(0, 3)
    : [];

  const matchedServices = q
    ? services.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedHospitals = q
    ? hospitals
        .filter(
          (h) =>
            h.name.toLowerCase().includes(q) ||
            h.location.toLowerCase().includes(q) ||
            h.region.toLowerCase().includes(q) ||
            h.services.some((service) => service.toLowerCase().includes(q))
        )
        .slice(0, 3)
    : [];

  const hasResults =
    matchedDoctors.length + matchedServices.length + matchedHospitals.length > 0;

  const goTo = (path) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

  return (
    <div className="search-bar-wrapper">
      <div className="home-search">
        <Search size={20} />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            className="search-clear-btn"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && q && (
        <div className="search-results-dropdown">
          {!hasResults && <p className="search-no-results">No matches for "{query}".</p>}

          {matchedDoctors.length > 0 && (
            <div className="search-result-group">
              <span>Specialists</span>
              {matchedDoctors.map((doctor) => (
                <button
                  key={`doctor-${doctor.id}`}
                  className="search-result-item"
                  onClick={() => goTo(`/specialists/${doctor.id}`)}
                >
                  <UserRound size={15} />
                  {doctor.name} · {doctor.specialty}
                </button>
              ))}
            </div>
          )}

          {matchedServices.length > 0 && (
            <div className="search-result-group">
              <span>Services</span>
              {matchedServices.map((service) => (
                <button
                  key={`service-${service.id}`}
                  className="search-result-item"
                  onClick={() => goTo(`/services/${service.id}`)}
                >
                  <Stethoscope size={15} />
                  {service.name}
                </button>
              ))}
            </div>
          )}

          {matchedHospitals.length > 0 && (
            <div className="search-result-group">
              <span>Hospitals</span>
              {matchedHospitals.map((hospital) => (
                <button
                  key={`hospital-${hospital.id}`}
                  className="search-result-item"
                  onClick={() => goTo(`/hospitals/${hospital.id}`)}
                >
                  <Hospital size={15} />
                  {hospital.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
