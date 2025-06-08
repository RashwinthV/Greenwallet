import Footertranslations  from "../../footerTranslation";

function Terms() {

    const lang=localStorage.getItem("language")
        const t=Footertranslations[lang]
  return (
    <div className="container py-5">
      <h2 className="text-primary mb-4">{t.terms_title}</h2>
      <div className="card shadow-sm p-4 fs-5">
        <p>{t.terms_intro}</p>
        <p><strong>User Obligations:</strong> {t.terms_user_obligations}</p>
        <p><strong>License:</strong> {t.terms_license}</p>
        <p><strong>Prohibited Use:</strong> {t.terms_prohibited_use}</p>
        <p><strong>No Warranty:</strong> {t.terms_no_warranty}</p>
        <p><strong>Limitation of Liability:</strong> {t.terms_limitation_of_liability}</p>
        <p><strong>Termination:</strong> {t.terms_termination}</p>
        <p><strong>Governing Law:</strong> {t.terms_governing_law}</p>
        <p><strong>Changes:</strong> {t.terms_changes}</p>
      </div>
    </div>
  );
}

export default Terms;
