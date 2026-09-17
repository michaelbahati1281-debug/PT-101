import { Building2, MapPinned, Home, Zap } from "lucide-react";

/* =========================================================
   HOSPITAL STATS BAR

   Summarizes the national directory: total health centres,
   regions covered, how many offer home service, and how many
   offer Priority/Convenience access.
========================================================= */

function HospitalStatsBar({ stats }) {
  return (
    <div className="hospital-stats-bar">
      <div className="hospital-stat">
        <Building2 size={18} />
        <div>
          <strong>{stats.total}</strong>
          <span>Health centres</span>
        </div>
      </div>

      <div className="hospital-stat">
        <MapPinned size={18} />
        <div>
          <strong>{stats.totalRegions}</strong>
          <span>Regions covered</span>
        </div>
      </div>

      <div className="hospital-stat">
        <Home size={18} />
        <div>
          <strong>{stats.homeServiceCount}</strong>
          <span>Offer home service</span>
        </div>
      </div>

      <div className="hospital-stat">
        <Zap size={18} />
        <div>
          <strong>{stats.priorityCount}</strong>
          <span>Priority/Convenience</span>
        </div>
      </div>
    </div>
  );
}

export default HospitalStatsBar;
