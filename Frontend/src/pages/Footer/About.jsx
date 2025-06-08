import "bootstrap/dist/css/bootstrap.min.css";

function About() {
  const lang = localStorage.getItem("language") || "en";

  const content = {
    en: {
      title: "Green Wallet",
      about: "About",
      about_text:
        "Green Wallet is a smart finance tracker designed to help users efficiently manage their income and expenses. It allows users to log product-based transactions and view detailed financial records.",

      features_title: "Core Features",
      features: [
        "Track income and expenses for each product",
        "Maintain a complete history of transaction records",
        "Get insights with detailed analysis",
        "Visualize spending patterns with a line chart",
        "Compare price changes for all products",
      ],

      analysis_title: "Smart Financial Analysis",
      analysis_text:
        "Green Wallet offers a visual analysis page where users can see how much they've spent on specific products and view the rate difference over time using a line chart. This helps in making informed financial decisions.",
      how_title: "How It Works",
      how_text:
        "Users can add transactions with product names, categories, prices, and timestamps. These entries are stored and can be viewed any time with filters and charts.",

      pros_title: "Advantages",
      cons_title: "Limitations",
      pros: [
        "User-friendly interface",
        "Fast product-wise tracking",
        "Visual insights using charts",
        "Lightweight and responsive",
        "Secure local data handling",
      ],
      cons: [
        "No cloud sync (yet)",
        "No AI-based budget suggestions",
        "Limited to product-wise entries",
        "Manual entry only (no receipts scan)",
      ],

      note: "All your data is organized, visualized, and secure with Green Wallet.",
    },

    ta: {
      title: "கிரீன் வாலெட்",
      about: "பற்றி",
      about_text:
        "கிரீன் வாலெட் என்பது பயனர்களின் வருமானம் மற்றும் செலவுகளை திறமையாக நிர்வகிக்க உருவாக்கப்பட்ட ஒரு நுண்ணறிவு நிதி கண்காணிப்பு கருவியாகும். இது ஒவ்வொரு தயாரிப்பிற்குமான பரிவர்த்தனைகளை பதிவு செய்ய மற்றும் விரிவான நிதி பதிவுகளை காண உதவுகிறது.",

      features_title: "முக்கிய அம்சங்கள்",
      features: [
        "ஒவ்வொரு தயாரிப்பிற்கும் வருமானம் மற்றும் செலவுகளை கண்காணிக்கவும்",
        "முழுமையான பரிவர்த்தனை பதிவுகள் சேமிக்கப்படுகின்றன",
        "விரிவான பகுப்பாய்வுகள் மூலம் நிதி நுண்ணறிவு",
        "செலவுகளின் முறைப்படி கோட்டுப் படமாக காணலாம்",
        "அனைத்து தயாரிப்புகளுக்கும் விலையீட்டில் ஏற்படும் மாற்றங்களை ஒப்பிடலாம்",
      ],
      how_title: "இது எப்படி செயல்படுகிறது?",
      how_text:
        "பயனர்கள் தயாரிப்பு பெயர், வகை, விலை மற்றும் நேரம் உள்ளிட்ட விவரங்களை உள்ளிட்டு பரிவர்த்தனைகளை சேர்க்கலாம். இவை சேமிக்கப்படுகின்றன மற்றும் எந்த நேரமும் பார்வையிடலாம்.",

      pros_title: "நன்மைகள்",
      cons_title: "குறைபாடுகள்",
      pros: [
        "பயனர் நட்பு இடைமுகம்",
        "விரைவான தயாரிப்பு கண்காணிப்பு",
        "கண்காட்சி வரைபடங்கள் மூலம் விளக்கம்",
        "இலேசான மற்றும் பதிலளிக்கும் வடிவமைப்பு",
        "உள்ளக தரவுகள் பாதுகாப்பாக இருக்கின்றன",
      ],
      cons: [
        "மேகத்துடன் ஒத்திசைவு இல்லை",
        "AI அடிப்படையிலான யோசனைகள் இல்லை",
        "தயாரிப்பு அடிப்படையிலான பதிவுகள் மட்டும்",
        "சான்றுகள் ஸ்கேன் ஆதரவு இல்லை",
      ],

      analysis_title: "நிதி பகுப்பாய்வுகள்",
      analysis_text:
        "கிரீன் வாலெட் ஒரு காட்சிப்படுத்தப்பட்ட பகுப்பாய்வு பக்கம் வழங்குகிறது. இதில், நீங்கள் எந்த தயாரிப்பில் எவ்வளவு செலவிட்டுள்ளீர்கள் என்பதையும், காலத்திற்கேற்ப விலை மாற்றங்களையும் கோட்டுப் படமாகப் பார்க்க முடியும். இது சிந்தித்த நிதி முடிவுகளை எடுக்க உதவும்.",

      note: "உங்கள் அனைத்து தரவுகளும் கிரீன் வாலெட்டில் ஒழுங்காக, காட்சியளிக்கப்படுவதுடன் பாதுகாப்பாகவும் இருக்கும்.",
    },
  };

  const t = content[lang];

  return (
    <div className="container py-5">
      {/* Title */}
      <div className="text-center mb-5">
        <h1 className="display-4 text-success fw-bold">{t.title}</h1>
      </div>

      {/* About */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <h4 className="card-title text-primary">{t.about}</h4>
          <p className="card-text">{t.about_text}</p>
        </div>
      </div>

      {/* Features */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <h4 className="card-title text-primary">{t.features_title}</h4>
          <ul className="list-group list-group-flush">
            {t.features.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-start"
              >
                <span className="me-2 text-success">✔️</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* How It Works */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <h4 className="card-title text-primary">{t.how_title}</h4>
          <p className="card-text">{t.how_text}</p>
        </div>
      </div>

      {/* Analysis */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <h4 className="card-title text-primary">{t.analysis_title}</h4>
          <p className="card-text">{t.analysis_text}</p>
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="row mb-4 d-flex justify-content-center">
        <div className="col-md-6 ">
          <div className="card border-success shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-success">{t.pros_title}</h5>
              <ul className="list-group list-group-flush">
                {t.pros.map((item, index) => (
                  <li key={index} className="list-group-item">
                    ✅ {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="col-md-6 mt-4 mt-md-0">
        <div className="card border-danger shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title text-danger">{t.cons_title}</h5>
            <ul className="list-group list-group-flush">
              {t.cons.map((item, index) => (
                <li key={index} className="list-group-item">⚠️ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div> */}
      </div>

      {/* Footer Note */}
      <div className="alert alert-success shadow-sm text-center fw-semibold">
        {t.note}
      </div>
    </div>
  );
}

export default About;
