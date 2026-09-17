/* =========================================================
   BADGE — small pill used for tags (category, home service,
   language, severity, region, etc.)

   tone: "default" | "primary" | "success" | "warning" | "danger"
========================================================= */

function Badge({ children, tone = "default", icon: Icon, size = 12 }) {
  return (
    <span className={`badge-pill badge-${tone}`}>
      {Icon && <Icon size={size} />}
      {children}
    </span>
  );
}

export default Badge;
