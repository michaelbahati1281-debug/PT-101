import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-switcher" aria-label="Interface language">
      <Languages size={16} aria-hidden="true" />
      <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>{t("english")}</button>
      <span aria-hidden="true">|</span>
      <button type="button" className={language === "sw" ? "active" : ""} onClick={() => setLanguage("sw")}>{t("kiswahili")}</button>
    </div>
  );
}

export default LanguageSwitcher;
