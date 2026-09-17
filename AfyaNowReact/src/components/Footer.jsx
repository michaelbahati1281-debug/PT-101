import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="footer-brand">
        <div className="small-logo">
          <HeartPulse size={18} />
        </div>
        <div>
          <strong>AfyaNow</strong>
          <p>{t("footer.companion")}</p>
        </div>
      </div>

      <div className="footer-columns">
        <div className="footer-column">
          <span>{t("footer.quickLinks")}</span>
          <Link to="/home">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/specialists">Specialists</Link>
          <Link to="/hospitals">Hospitals</Link>
          <Link to="/appointments">{t("nav.appointments")}</Link>
        </div>

        <div className="footer-column">
          <span>{t("footer.support")}</span>
          <Link to="/help">{t("footer.helpCenter")}</Link>
          <Link to="/contact">{t("footer.contactUs")}</Link>
          <Link to="/privacy">{t("footer.privacyPolicy")}</Link>
          <Link to="/terms">{t("footer.termsOfService")}</Link>
        </div>
      </div>

      <p className="footer-copyright">{t("footer.copyright")}</p>
    </footer>
  );
}

export default Footer;
