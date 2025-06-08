import Footertranslations  from "../../footerTranslation";

function Privacy() {
  const lang = localStorage.getItem("language") || "en";
  const t = Footertranslations[lang];

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="text-info fw-bold">{t.privacy_title}</h2>
      </div>
      <div className="card shadow-sm p-4 fs-5">
        <p>{t.privacy_content}</p>
        <p>{t.privacy_data_collection}</p>
        <p>{t.privacy_data_usage}</p>
        <p>{t.privacy_data_security}</p>
        <p>{t.privacy_user_rights}</p>
        <p>{t.privacy_third_party}</p>
        <p>{t.privacy_cookies}</p>
        <p>{t.privacy_policy_updates}</p>
      </div>
    </div>
  );
}

export default Privacy;
