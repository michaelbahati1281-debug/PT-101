import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CalendarDays, RefreshCcw } from "lucide-react";

import { notifications } from "../data/notifications";

const iconFor = (title) => {
  if (title.toLowerCase().includes("reschedul")) return RefreshCcw;
  if (title.toLowerCase().includes("reminder")) return Bell;
  return CalendarDays;
};

function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Notifications</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="appointments-content">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Bell size={30} />
            </div>
            <h3>No notifications yet</h3>
            <p>Updates about your appointments will appear here.</p>
          </div>
        ) : (
          <div className="past-appointments-list">
            {notifications.map((item) => {
              const Icon = iconFor(item.title);
              return (
                <div
                  key={item.id}
                  className="past-appointment-row"
                  style={{ alignItems: "flex-start" }}
                >
                  <div style={{ display: "flex", gap: 12 }}>
                    <div className="doctor-detail-icon" style={{ flexShrink: 0 }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.message}</p>
                      <span className="past-appointment-date">{item.time}</span>
                    </div>
                  </div>
                  {!item.read && <span className="notification-dot"></span>}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;
