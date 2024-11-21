import "./alert.css";

const Alert = ({ message, type, onClose }) => {
  return (
    <div className={`alert ${type}`}>
      <div className="alert-content">
        <span>{message}</span>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;
