import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_KEY = "afyanowLanguage";
const LanguageContext = createContext(null);

const messages = {
  en: {
    english: "English", kiswahili: "Kiswahili", menu: "Menu", notifications: "Notifications",
    "splash.tagline": "Your healthcare, simplified.", "splash.start": "Get Started",
    "auth.welcome": "Welcome Back", "auth.loginPrompt": "Login to continue using AfyaNow", "auth.create": "Create Account", "auth.createPrompt": "Create your AfyaNow account",
    "auth.emailOrPhone": "Email or Phone Number", "auth.password": "Password", "auth.fullName": "Full Name", "auth.email": "Email Address", "auth.phone": "Phone Number",
    "auth.login": "Login", "auth.register": "Create Account", "home.welcome": "Welcome to", "home.healthMatters": "YOUR HEALTH MATTERS",
    "home.heading": "Find the right care, at the right time.", "home.description": "Discover healthcare services, specialists and hospitals near you.",
    "nav.dashboard": "Dashboard", "nav.profile": "Profile", "nav.appointments": "My Appointments", "nav.notifications": "Notifications", "nav.hospitals": "Hospitals", "nav.help": "Help & FAQ", "nav.about": "About AfyaNow",
    "auth.iam": "I am a", "auth.patient": "Patient", "auth.doctor": "Doctor",
    "auth.doctorNotFound": "No matching doctor account was found. Please register as a doctor first.",
    "auth.accountNotFound": "No matching account was found. Please register first.",
    "dashboard.greeting": "GOOD MORNING!", "dashboard.welcomeBack": "Welcome back", "dashboard.toAfyaNow": "to AfyaNow", "dashboard.activity": "Here's a look at your healthcare activity.",
    "dashboard.upcomingAppointment": "Upcoming Appointment", "dashboard.nextScheduled": "Your next scheduled visit",
    "dashboard.viewAppointment": "View Appointment", "dashboard.reschedule": "Reschedule", "dashboard.cancel": "Cancel",
    "dashboard.noUpcoming": "No upcoming appointment", "dashboard.bookNext": "Book your next healthcare visit with AfyaNow.",
    "dashboard.findSpecialist": "Find a Specialist", "dashboard.quickActions": "Quick Actions",
    "dashboard.findDoctor": "Find a Doctor", "dashboard.browseSpecialists": "Browse specialists",
    "dashboard.bookAppointment": "Book Appointment", "dashboard.scheduleVisit": "Schedule a visit",
    "dashboard.healthcareServices": "Healthcare Services", "dashboard.exploreServices": "Explore services",
    "dashboard.myAppointments": "My Appointments", "dashboard.manageBookings": "Manage bookings",
    "dashboard.recentActivity": "Recent Activity", "dashboard.appointmentBooked": "Appointment booked",
    "dashboard.appointmentConfirmed": "Appointment confirmed", "dashboard.appointmentRescheduled": "Appointment rescheduled",
    "footer.companion": "Your healthcare appointment companion.", "footer.quickLinks": "Quick Links",
    "footer.support": "Support", "footer.helpCenter": "Help Center", "footer.contactUs": "Contact Us",
    "footer.privacyPolicy": "Privacy Policy", "footer.termsOfService": "Terms of Service",
    "footer.copyright": "© 2026 AfyaNow. All rights reserved.",
  },
  sw: {
    english: "Kiingereza", kiswahili: "Kiswahili", menu: "Menyu", notifications: "Arifa",
    "splash.tagline": "Huduma yako ya afya, imerahisishwa.", "splash.start": "Anza",
    "auth.welcome": "Karibu Tena", "auth.loginPrompt": "Ingia ili kuendelea kutumia AfyaNow", "auth.create": "Fungua Akaunti", "auth.createPrompt": "Fungua akaunti yako ya AfyaNow",
    "auth.emailOrPhone": "Barua pepe au Simu", "auth.password": "Nenosiri", "auth.fullName": "Jina Kamili", "auth.email": "Barua pepe", "auth.phone": "Namba ya Simu",
    "auth.login": "Ingia", "auth.register": "Fungua Akaunti", "home.welcome": "Karibu", "home.healthMatters": "AFYA YAKO NI MUHIMU",
    "home.heading": "Pata huduma sahihi, kwa wakati sahihi.", "home.description": "Gundua huduma za afya, wataalamu na hospitali zilizo karibu nawe.",
    "nav.dashboard": "Dashibodi", "nav.profile": "Wasifu", "nav.appointments": "Miadi Yangu", "nav.notifications": "Arifa", "nav.hospitals": "Hospitali", "nav.help": "Msaada na Maswali", "nav.about": "Kuhusu AfyaNow",
    "auth.iam": "Mimi ni", "auth.patient": "Mgonjwa", "auth.doctor": "Daktari",
    "auth.doctorNotFound": "Hakuna akaunti ya daktari iliyopatikana. Tafadhali jiandikishe kama daktari kwanza.",
    "auth.accountNotFound": "Hakuna akaunti iliyopatikana. Tafadhali jiandikishe kwanza.",
    "dashboard.greeting": "HERI YA ASUBUHI!", "dashboard.welcomeBack": "Karibu tena", "dashboard.toAfyaNow": "kwenye AfyaNow", "dashboard.activity": "Hii ndio shughuli yako ya afya.",
    "dashboard.upcomingAppointment": "Miadi Inayokuja", "dashboard.nextScheduled": "Ziara yako inayofuata",
    "dashboard.viewAppointment": "Angalia Miadi", "dashboard.reschedule": "Panga Upya", "dashboard.cancel": "Ghairi",
    "dashboard.noUpcoming": "Hakuna miadi inayokuja", "dashboard.bookNext": "Weka miadi yako ijayo ya afya na AfyaNow.",
    "dashboard.findSpecialist": "Tafuta Mtaalamu", "dashboard.quickActions": "Hatua za Haraka",
    "dashboard.findDoctor": "Tafuta Daktari", "dashboard.browseSpecialists": "Vinjari wataalamu",
    "dashboard.bookAppointment": "Weka Miadi", "dashboard.scheduleVisit": "Panga ziara",
    "dashboard.healthcareServices": "Huduma za Afya", "dashboard.exploreServices": "Vinjari huduma",
    "dashboard.myAppointments": "Miadi Yangu", "dashboard.manageBookings": "Dhibiti miadi",
    "dashboard.recentActivity": "Shughuli ya Hivi Karibuni", "dashboard.appointmentBooked": "Miadi imewekwa",
    "dashboard.appointmentConfirmed": "Miadi imethibitishwa", "dashboard.appointmentRescheduled": "Miadi imepangwa upya",
    "footer.companion": "Msaidizi wako wa miadi ya afya.", "footer.quickLinks": "Viungo vya Haraka",
    "footer.support": "Msaada", "footer.helpCenter": "Kituo cha Msaada", "footer.contactUs": "Wasiliana Nasi",
    "footer.privacyPolicy": "Sera ya Faragha", "footer.termsOfService": "Masharti ya Huduma",
    "footer.copyright": "© 2026 AfyaNow. Haki zote zimehifadhiwa.",
  },
};

// Static copy is translated at the application boundary so protected pages can
// remain intact while every existing route responds to the selected language.
const swPhrases = {
  "English": "Kiingereza", "Kiswahili": "Kiswahili", "Menu": "Menyu", "Go back": "Rudi", "Back": "Rudi", "Open menu": "Fungua menyu", "Close menu": "Funga menyu", "Main navigation": "Urambazaji mkuu", "Interface language": "Lugha ya kiolesura", "Notifications": "Arifa",
  "Safe • Simple • Accessible": "Salama • Rahisi • Inapatikana", "OR": "AU", "Forgot password?": "Umesahau nenosiri?", "Don't have an account?": "Huna akaunti?", "Already have an account?": "Tayari una akaunti?", "Create Account": "Fungua Akaunti", "Login": "Ingia", "Password": "Nenosiri", "Confirm Password": "Thibitisha Nenosiri",
  "I am a": "Mimi ni", "Patient": "Mgonjwa",
  "No matching doctor account was found. Please register as a doctor first.": "Hakuna akaunti ya daktari iliyopatikana. Tafadhali jiandikishe kama daktari kwanza.",
  "No matching account was found. Please register first.": "Hakuna akaunti iliyopatikana. Tafadhali jiandikishe kwanza.",
  "Health centres": "Vituo vya afya", "Regions in Tanzania": "Mikoa ya Tanzania", "Regions covered": "Mikoa inayohudumiwa", "Home service": "Huduma ya nyumbani", "Offer home service": "Hutoa huduma ya nyumbani", "Priority/Convenience": "Kipaumbele/Urahisi",
  "Services": "Huduma", "Healthcare services": "Huduma za afya", "Specialists": "Wataalamu", "Find a specialist": "Tafuta mtaalamu", "Hospitals": "Hospitali", "Nearby hospitals": "Hospitali zilizo karibu", "Appointments": "Miadi", "Manage bookings": "Dhibiti miadi", "Healthcare Services": "Huduma za Afya", "Choose what you need": "Chagua unachohitaji", "Nearby Hospitals": "Hospitali Zilizo Karibu", "Healthcare facilities around you": "Vituo vya afya vilivyo karibu nawe", "See all": "Tazama zote", "No hospitals found.": "Hakuna hospitali zilizopatikana.", "Home": "Nyumbani", "Profile": "Wasifu", "Dashboard": "Dashibodi",
  "Your health information is important": "Taarifa zako za afya ni muhimu", "Your healthcare appointment companion.": "Msaidizi wako wa miadi ya afya.", "Quick Links": "Viungo vya Haraka", "Support": "Msaada", "Help Center": "Kituo cha Msaada", "Contact Us": "Wasiliana Nasi", "Privacy Policy": "Sera ya Faragha", "Terms of Service": "Masharti ya Huduma", "© 2026 AfyaNow. All rights reserved.": "© 2026 AfyaNow. Haki zote zimehifadhiwa.",
  "Book Appointment": "Weka Miadi", "APPOINTMENT BOOKING": "KUWEKA MIADI", "How urgent is your condition?": "Hali yako ni ya dharura kiasi gani?", "Choose Facility": "Chagua Kituo", "Choose Date": "Chagua Tarehe", "Choose Time": "Chagua Muda", "Consultation Type": "Aina ya Ushauri", "Home Visit Location": "Eneo la Ziara ya Nyumbani", "Additional location description": "Maelezo ya ziada ya eneo", "Service Category": "Kategoria ya Huduma", "Patient Information": "Taarifa za Mgonjwa", "Full Name": "Jina Kamili", "Phone Number": "Namba ya Simu", "Email Address": "Barua pepe", "Reason for Visit": "Sababu ya Ziara", "Appointment Summary": "Muhtasari wa Miadi", "Facility": "Kituo", "Location": "Eneo", "Date": "Tarehe", "Time": "Muda", "Consultation Fee": "Ada ya Ushauri", "Home Visit Fee": "Ada ya Ziara ya Nyumbani", "Total": "Jumla", "Confirm Booking": "Thibitisha Miadi", "Doctor Not Found": "Daktari Hakupatikana", "Appointment Not Found": "Miadi Haikupatikana",
  "Appointment Confirmed": "Miadi Imethibitishwa", "No Appointment Found": "Hakuna Miadi Iliyopatikana", "Doctor": "Daktari", "Specialty": "Utaalamu", "Hospital": "Hospitali", "Status": "Hali", "My Appointments": "Miadi Yangu", "Upcoming Appointment": "Miadi Inayokuja", "Your next scheduled visit": "Ziara yako inayofuata", "Past Appointments": "Miadi ya Zamani", "Your appointment history": "Historia ya miadi yako", "No appointments yet": "Bado hakuna miadi", "Reschedule": "Panga Upya", "Cancel": "Ghairi", "Cancel Appointment?": "Ghairi Miadi?", "Reschedule Appointment": "Panga Upya Miadi", "Current Appointment": "Miadi ya Sasa", "Current Date": "Tarehe ya Sasa", "Current Time": "Muda wa Sasa", "Choose New Date": "Chagua Tarehe Mpya", "Choose New Time": "Chagua Muda Mpya",
  "GOOD MORNING!": "HERI YA ASUBUHI!", "Welcome back": "Karibu tena", "Here's a look at your healthcare activity.": "Hii ndio shughuli yako ya afya.",
  "View Appointment": "Angalia Miadi", "No upcoming appointment": "Hakuna miadi inayokuja",
  "Book your next healthcare visit with AfyaNow.": "Weka miadi yako ijayo ya afya na AfyaNow.",
  "Find a Doctor": "Tafuta Daktari", "Browse specialists": "Vinjari wataalamu",
  "Schedule a visit": "Panga ziara", "Explore services": "Vinjari huduma",
  "Recent Activity": "Shughuli ya Hivi Karibuni", "Appointment booked": "Miadi imewekwa",
  "Appointment confirmed": "Miadi imethibitishwa", "Appointment rescheduled": "Miadi imepangwa upya",
  "Call 112 (Ambulance)": "Piga 112 (Ambulensi)", "This may need urgent care.": "Hii inahitaji huduma ya dharura.",
  "Please don't wait for an appointment. Go to the nearest hospital emergency department or call 112 (Ambulance) right away.": "Tafisiri usubiri miadi. Nenda kwenye dharura ya hospitali iliyo karibu au piga 112 (Ambulensi) mara moja.",
  "Find the nearest hospital": "Tafuta hospitali iliyo karibu",
  "Find a Specialist": "Tafuta Mtaalamu", "Choose a doctor that fits your needs": "Chagua daktari anayekidhi mahitaji yako", "Quick Find: how urgent is it?": "Utafutaji wa Haraka: ni dharura kiasi gani?", "Available Specialists": "Wataalamu Wanaopatikana", "No specialists found": "Hakuna wataalamu waliopatikana", "Priority": "Kipaumbele", "Standard": "Kawaida", "Experience": "Uzoefu", "Languages": "Lugha", "Availability": "Upatikanaji", "About the Specialist": "Kuhusu Mtaalamu", "Access Options": "Chaguo za Huduma",
  "Hospital Details": "Maelezo ya Hospitali", "Hospital Not Found": "Hospitali Haikupatikana", "Region": "Mkoa", "Opening Hours": "Saa za Kufunguliwa", "Contact": "Mawasiliano", "About": "Kuhusu", "Available Services": "Huduma Zinazopatikana", "Specialists Here": "Wataalamu Hapa", "Healthcare facilities across Tanzania": "Vituo vya afya Tanzania nzima", "Showing results from our directory": "Inaonyesha matokeo kutoka orodha yetu", "Search hospital, region or service...": "Tafuta hospitali, mkoa au huduma...",
  "Service Details": "Maelezo ya Huduma", "Service not found": "Huduma haikupatikana", "About this service": "Kuhusu huduma hii", "What you can do": "Unachoweza kufanya", "No services found": "Hakuna huduma zilizopatikana", "Choose a service to get started": "Chagua huduma kuanza", "Search healthcare service...": "Tafuta huduma ya afya...", "Find available specialists": "Tafuta wataalamu wanaopatikana", "Compare healthcare facilities": "Linganisha vituo vya afya", "Choose a convenient appointment time": "Chagua muda unaokufaa", "Manage your appointment digitally": "Dhibiti miadi yako kidijitali",
  "My Profile": "Wasifu Wangu", "Date of Birth": "Tarehe ya Kuzaliwa", "Gender": "Jinsia", "Select": "Chagua", "Female": "Mwanamke", "Male": "Mwanaume", "Other": "Nyingine", "Save Changes": "Hifadhi Mabadiliko", "Log Out": "Ondoka", "Help & FAQ": "Msaada na Maswali", "Contact AfyaNow": "Wasiliana na AfyaNow", "Name": "Jina", "Email": "Barua pepe", "Message": "Ujumbe", "Send Message": "Tuma Ujumbe", "About AfyaNow": "Kuhusu AfyaNow", "Our Mission": "Dhamira Yetu", "Our Vision": "Maono Yetu", "How AfyaNow Works": "Jinsi AfyaNow Inavyofanya Kazi", "Why Choose AfyaNow?": "Kwa Nini Uchague AfyaNow?", "Page Not Found": "Ukurasa Haupatikani",
  "Enter your email or phone number": "Weka barua pepe au namba ya simu", "Enter your password": "Weka nenosiri lako", "Enter your full name": "Weka jina lako kamili", "Enter your email": "Weka barua pepe yako", "Create a password": "Tengeneza nenosiri", "Re-enter your password": "Weka tena nenosiri", "Search doctors, services, hospitals...": "Tafuta madaktari, huduma, hospitali...", "Search doctor, specialty or facility...": "Tafuta daktari, utaalamu au kituo...", "Your full name": "Jina lako kamili", "How can we help?": "Tunawezaje kukusaidia?", "City, Region": "Mji, Mkoa", "Clear search": "Futa utafutaji", "Toggle filters": "Washa/zima vichujio"
};

const sourceText = new WeakMap();
const sourceAttributes = new WeakMap();

function installPageTranslation(language) {
  const root = document.getElementById("root");
  if (!root) return () => {};
  const translate = (value) => language === "sw" ? (swPhrases[value] || value) : value;
  const applyText = (node) => {
    const source = sourceText.get(node) ?? node.nodeValue;
    sourceText.set(node, source);
    const leading = source.match(/^\s*/)?.[0] || "";
    const trailing = source.match(/\s*$/)?.[0] || "";
    const core = source.trim();
    const next = `${leading}${translate(core)}${trailing}`;
    if (node.nodeValue !== next) node.nodeValue = next;
  };
  const applyElement = (element) => {
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return;
    ["placeholder", "aria-label", "title"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const saved = sourceAttributes.get(element) || {};
      const source = saved[attribute] ?? element.getAttribute(attribute);
      saved[attribute] = source;
      sourceAttributes.set(element, saved);
      element.setAttribute(attribute, translate(source));
    });
  };
  const apply = (target = root) => {
    if (target.nodeType === Node.TEXT_NODE) applyText(target);
    if (target.nodeType === Node.ELEMENT_NODE) applyElement(target);
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node; while ((node = walker.nextNode())) node.nodeType === Node.TEXT_NODE ? applyText(node) : applyElement(node);
  };
  apply();
  const observer = new MutationObserver((records) => records.forEach((record) => {
    if (record.type === "characterData") apply(record.target);
    record.addedNodes.forEach((node) => apply(node));
  }));
  observer.observe(root, { childList: true, characterData: true, subtree: true });
  return () => observer.disconnect();
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) || "en");

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language === "sw" ? "sw" : "en";
  }, [language]);

  useEffect(() => installPageTranslation(language), [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key) => messages[language][key] || messages.en[key] || key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
