import { useNavigate } from "react-router-dom";
import "./BackButton.css";

function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
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
