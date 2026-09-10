import { useLocation, useNavigate } from "react-router-dom";
import "./BackButton.css";

function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button type="button" className="back-button" onClick={handleBack}>
      <span aria-hidden="true">←</span>
      Back
    </button>
  );
}

export default BackButton;
