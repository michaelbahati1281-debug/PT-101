import { Link } from "react-router-dom";
import { severityLevels } from "../../data/severity";

/* =========================================================
   SEVERITY SELECTOR

   Lets a patient flag how urgent their condition feels, which
   is used to nudge search results and the booking flow toward
   Standard or Priority/Convenience access. This is a triage
   aid only, not a medical diagnosis — for "Emergency" it always
   points the patient to immediate in-person or emergency care
   rather than a routine booking.
========================================================= */

function SeveritySelector({ value, onChange }) {
  const selected = severityLevels.find((level) => level.id === value);

  return (
    <div className="severity-selector">
      <div className="severity-options">
        {severityLevels.map((level) => {
          const Icon = level.icon;
          const isActive = value === level.id;

          return (
            <button
              key={level.id}
              type="button"
              className={`severity-option severity-${level.tone}${isActive ? " active" : ""}`}
              onClick={() => onChange(level.id)}
            >
              <Icon size={18} />
              <span>{level.label}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="severity-guidance">{selected.guidance}</p>
      )}

      {selected?.id === "emergency" && (
        <div className="emergency-banner">
          <strong>This may need urgent care.</strong>
          <p>
            Please don't wait for an appointment. Go to the nearest hospital
            emergency department or call <strong>112 (Ambulance)</strong> right away.
          </p>
          <Link to="/hospitals?sort=distance" className="emergency-banner-link">
            Find the nearest hospital
          </Link>
        </div>
      )}
    </div>
  );
}

export default SeveritySelector;
