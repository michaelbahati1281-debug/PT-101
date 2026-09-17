import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Hospital as HospitalIcon,
  ChevronRight,
  Home,
  RefreshCw,
} from "lucide-react";

import { useGeolocation } from "../hooks/useGeolocation";
import { sortHospitals, HOSPITAL_SORT_OPTIONS } from "../utils/sort";
import { getDistanceKm, formatDistanceKm } from "../utils/geo";
import SortMenu from "../components/common/SortMenu";
import Badge from "../components/common/Badge";
import { getHospitals } from "../services/api";
import { hospitals as fallbackHospitals } from "../data/hospitals";

function toFallbackShape(list) {
  return list.map((h) => ({
    id: h.id,
    name: h.name,
    address: h.location,
    region: h.region,
    district: h.district,
    ward: h.ward,
    description: h.type,
    latitude: h.lat,
    longitude: h.lng,
    website: h.website,
    rating: h.rating,
    reviews: h.reviews,
    category: h.category,
    homeService: h.homeService,
  }));
}

function Hospitals() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [sortKey, setSortKey] = useState("rating");

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    coords,
    status: locationStatus,
    error: locationError,
    requestLocation,
  } = useGeolocation();

  useEffect(() => {
    const requestedSort = searchParams.get("sort");

    if (requestedSort === "distance") {
      setSortKey("distance");
      requestLocation();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load hospitals from AfyaNow backend
  useEffect(() => {
    async function loadHospitals() {
      try {
        setLoading(true);
        setError("");

        const data = await getHospitals();

        if (data && data.length > 0) {
          setHospitals(data);
        } else {
          console.warn("Backend returned no hospitals; using bundled national directory.");
          setHospitals(toFallbackShape(fallbackHospitals));
        }
      } catch (err) {
        console.error("Hospital API error:", err);
        console.warn("Fallback: showing the bundled national hospital directory.");
        setHospitals(toFallbackShape(fallbackHospitals));
      } finally {
        setLoading(false);
      }
    }

    loadHospitals();
  }, []);

  // Get unique regions from real database data
  const regions = useMemo(() => {
    const uniqueRegions = [
      ...new Set(hospitals.map((hospital) => hospital.region).filter(Boolean)),
    ];

    return ["All", ...uniqueRegions.sort()];
  }, [hospitals]);

  // Statistics from real API data
  const stats = useMemo(() => {
    const total = hospitals.length;

    const totalRegions = new Set(
      hospitals.map((hospital) => hospital.region).filter(Boolean)
    ).size;

    return {
      total,
      totalRegions,
    };
  }, [hospitals]);

  // Filter hospitals
  const filtered = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return hospitals.filter((hospital) => {
      const matchesSearch =
        !searchText ||
        hospital.name?.toLowerCase().includes(searchText) ||
        hospital.address?.toLowerCase().includes(searchText) ||
        hospital.region?.toLowerCase().includes(searchText) ||
        hospital.district?.toLowerCase().includes(searchText) ||
        hospital.ward?.toLowerCase().includes(searchText) ||
        hospital.description?.toLowerCase().includes(searchText);

      const matchesRegion =
        region === "All" || hospital.region === region;

      return matchesSearch && matchesRegion;
    });
  }, [hospitals, search, region]);

  // Adapt backend hospital records to the existing sorting utility
  const hospitalsForSorting = useMemo(() => {
    return filtered.map((hospital) => ({
      ...hospital,

      // Keep real ratings when present (bundled fallback data);
      // live API records without ratings simply sort as 0.
      rating: hospital.rating ?? 0,
      reviews: hospital.reviews ?? 0,

      // Existing UI compatibility
      location: hospital.address || hospital.region || "Location unavailable",
      type: hospital.description || "Healthcare facility",

      lat: hospital.latitude
        ? Number(hospital.latitude)
        : null,

      lng: hospital.longitude
        ? Number(hospital.longitude)
        : null,
    }));
  }, [filtered]);

  const sorted = useMemo(() => {
    if (sortKey === "distance" && !coords) {
      return hospitalsForSorting;
    }

    try {
      return sortHospitals(
        hospitalsForSorting,
        sortKey,
        coords
      );
    } catch (error) {
      console.error("Hospital sorting error:", error);

      return hospitalsForSorting;
    }
  }, [hospitalsForSorting, sortKey, coords]);

  return (
    <div className="mobile-app">
      <header className="page-header">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>Hospitals</h1>
          <p>Healthcare facilities across Tanzania</p>
        </div>

        <div className="header-spacer"></div>
      </header>

      <main className="specialists-content">

        {/* Statistics */}
        <div className="hospital-stats-simple">
          <div>
            <strong>{stats.total}</strong>
            <span>Hospitals</span>
          </div>

          <div>
            <strong>{stats.totalRegions}</strong>
            <span>Regions</span>
          </div>
        </div>

        {/* Search */}
        <div className="specialists-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search hospital, region or district..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* Regions */}
        <div className="category-scroll">
          {regions.map((item) => (
            <button
              key={item}
              className={`category-button${
                region === item ? " active" : ""
              }`}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Heading and sorting */}
        <div className="specialists-heading">
          <div>
            <h2>
              {sorted.length} hospital
              {sorted.length !== 1 ? "s" : ""} found
            </h2>

            <p>
              Showing real hospitals from the AfyaNow database
            </p>
          </div>

          <SortMenu
            options={HOSPITAL_SORT_OPTIONS}
            value={sortKey}
            onChange={(value) => {
              setSortKey(value);

              if (value === "distance" && !coords) {
                requestLocation();
              }
            }}
            onRequestLocation={requestLocation}
            locationStatus={locationStatus}
            locationError={locationError}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="no-results">
            <RefreshCw size={25} className="loading-icon" />
            <p>Loading hospitals...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="no-results">
            <HospitalIcon size={25} />
            <p>{error}</p>

            <button
              type="button"
              className="category-button active"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {/* Hospital list */}
        {!loading && !error && (
          <div className="doctor-list">
            {sorted.map((hospital) => {
              const hasCoordinates =
                hospital.lat != null &&
                hospital.lng != null;

              const distanceKm =
                coords && hasCoordinates
                  ? getDistanceKm(
                      coords.lat,
                      coords.lng,
                      hospital.lat,
                      hospital.lng
                    )
                  : null;

              return (
                <Link
                  key={hospital.id}
                  to={`/hospitals/${hospital.id}`}
                  className="hospital-card"
                  style={{ display: "flex" }}
                >
                  {/* Hospital icon */}
                  <div className="hospital-icon">
                    <HospitalIcon size={22} />
                  </div>

                  {/* Hospital information */}
                  <div className="hospital-info">
                    <h3>{hospital.name}</h3>

                    <div className="hospital-location">
                      <MapPin size={12} />

                      <span>
                        {hospital.address ||
                          hospital.region ||
                          "Location unavailable"}
                      </span>
                    </div>

                    <div className="hospital-meta">
                      <span>
                        {hospital.description ||
                          "Healthcare facility"}
                      </span>

                      {hospital.district && (
                        <span>{hospital.district}</span>
                      )}

                      {distanceKm != null && (
                        <span>
                          {formatDistanceKm(distanceKm)} away
                        </span>
                      )}
                    </div>

                    <div className="card-badge-row">
                      <Badge tone="default">
                        {hospital.region || "Tanzania"}
                      </Badge>

                      {hospital.website && (
                        <Badge tone="success">
                          Website available
                        </Badge>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={18} />
                </Link>
              );
            })}

            {sorted.length === 0 && (
              <div className="no-results">
                <Search size={25} />
                <p>No hospitals found.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Hospitals;