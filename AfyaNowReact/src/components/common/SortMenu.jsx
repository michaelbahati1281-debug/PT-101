import { useState } from "react";
import { ArrowUpDown, Check, LocateFixed } from "lucide-react";

/* =========================================================
   SORT MENU

   A small dropdown for ranking a results list (top rated,
   nearest to me, soonest available, lowest price). When the
   "Nearest to me" option is chosen and no location has been
   captured yet, onRequestLocation() is fired so the caller
   can prompt the browser's geolocation permission.
========================================================= */

function SortMenu({
  options,
  value,
  onChange,
  onRequestLocation,
  locationStatus = "idle",
  locationError = "",
}) {
  const [open, setOpen] = useState(false);

  const current = options.find((option) => option.id === value) || options[0];

  const handleSelect = (optionId) => {
    onChange(optionId);
    setOpen(false);

    if (optionId === "distance" && locationStatus !== "success") {
      onRequestLocation?.();
    }
  };

  return (
    <div className="sort-menu">
      <button
        type="button"
        className="sort-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <ArrowUpDown size={14} />
        <span>{current.label}</span>
      </button>

      {open && (
        <div className="sort-menu-panel">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`sort-menu-item${value === option.id ? " active" : ""}`}
              onClick={() => handleSelect(option.id)}
            >
              <span>{option.label}</span>
              {value === option.id && <Check size={14} />}
            </button>
          ))}
        </div>
      )}

      {value === "distance" && locationStatus === "loading" && (
        <p className="sort-location-note">
          <LocateFixed size={12} /> Detecting your location...
        </p>
      )}

      {value === "distance" && locationStatus === "error" && (
        <p className="sort-location-note sort-location-error">{locationError}</p>
      )}
    </div>
  );
}

export default SortMenu;
