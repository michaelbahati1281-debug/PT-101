import { useMemo, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { services } from "../data/services";

function Services() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Medical",
    "Specialized",
    "Surgical",
    "Maternal & Child Health",
    "Diagnostics",
    "Rehabilitation",
    "Preventive",
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="mobile-app">

      <header className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Healthcare Services</h1>
          <p>Choose a service to get started</p>
        </div>

        <div className="header-spacer"></div>

      </header>

      <main className="services-page-content">

        <div className="services-search">

          <Search size={20} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search healthcare service..."
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              <X size={17} />
            </button>
          )}

        </div>

        <div className="category-scroll">

          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}

        </div>

        <div className="services-result-heading">

          <div>
            <h2>Available Services</h2>

            <p>
              {filteredServices.length} service
              {filteredServices.length !== 1 ? "s" : ""}
              {" "}available
            </p>
          </div>

        </div>

        {filteredServices.length > 0 ? (

          <div className="services-list">

            {filteredServices.map((service) => {

              const Icon = service.icon;

              return (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="service-large-card"
                >

                  <div className="service-large-icon">
                    <Icon size={25} />
                  </div>

                  <div className="service-large-info">

                    <h3>{service.name}</h3>

                    <p>
                      {service.description}
                    </p>

                    <span>
                      {service.category}
                    </span>

                  </div>

                  <div className="service-arrow">
                    →
                  </div>

                </Link>
              );

            })}

          </div>

        ) : (

          <div className="empty-services">

            <div className="empty-services-icon">
              <Search size={28} />
            </div>

            <h3>No services found</h3>

            <p>
              Try another search term or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="reset-button"
            >
              Reset Search
            </button>

          </div>

        )}

      </main>

      <nav className="bottom-navigation">

        <Link
          to="/home"
          className="bottom-nav-item"
        >
          <span>⌂</span>
          <span>Home</span>
        </Link>

        <Link
          to="/services"
          className="bottom-nav-item active"
        >
          <span>✚</span>
          <span>Services</span>
        </Link>

        <Link
          to="/appointments"
          className="bottom-nav-item"
        >
          <span>▣</span>
          <span>Appointments</span>
        </Link>

        <Link
          to="/profile"
          className="bottom-nav-item"
        >
          <span>●</span>
          <span>Profile</span>
        </Link>

      </nav>

    </div>
  );
}

export default Services;