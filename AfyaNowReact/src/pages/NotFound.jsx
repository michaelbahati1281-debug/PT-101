import { useNavigate } from "react-router-dom";
import { ArrowLeft, HeartPulse } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Page Not Found</h1>
        <div className="header-spacer"></div>
      </header>

      <div className="not-found-page">
        <div className="placeholder-icon">
          <HeartPulse size={38} />
        </div>
        <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <button className="primary-button" onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
