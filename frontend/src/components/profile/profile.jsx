import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserLoginContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import { fetchFriends } from "../../services/api";

const Profile = () => {
  const { currentUser, isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [labCount, setLabCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        const [detailsRes, reportsRes, friendsRes] = await Promise.all([
          api.get("/user-details"),
          api.get("/reports/me"),
          fetchFriends(userId),
        ]);

        setDetails(detailsRes.data);
        setLabCount(reportsRes.data?.length || 0);
        setFriendsCount(friendsRes.data?.length || 0);
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && currentUser?.uid) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  if (loading) return <p className="profile-loading">Loading Profile...</p>;

  if (!isAuthenticated)
    return <h2 className="profile-login-msg">Please log in to view profile.</h2>;

 return (
    <div className="profile-container">
      <div className="profile-card">

        {/* Header */}
        <div className="profile-header">
          <img
            src="data:image/webp;base64,UklGRggEAABXRUJQVlA4IPwDAADQNQCdASovAQ4BPp1OoUulpKMhp9ToqLATiWlu4JTkePGMEF9E892CGxmv9tMOz2XCFaYr/9gIauISQlTNP+uOFvIrM2rSOpDXgf/zRFm7VlTVL5xRodAHX/+ua6WY0VwRkPzyIEnDzL3SuIEGH69HFoJQR8C3wl5gvCwy2mHQEO8b7LZOcUaK4Mhcq6IRkZAPP4FnhZ95yHH/Lb/DlqfmVZfOkCQUaGPk9r04e5HnrCS84aKP//zfL4CK5fjnt67kn6wWstZYJJk6KQQXvwZZAW+GALFNGhn6AmPDWlbGRYDhIACR+k1GAR7uSuW87YsQ2CSzhGu4q8owliq2+5xQj0g92xKboqLcM3BByRoqnpxrgyFPOf3G4PJnUnXdgzByS8bFvs9+jr4dCyCwsGBJZk1gyLWPjjX3N2Qs3Kv5Xp2zP+XF7aT8gWmGuwrR1Yg9it7iqXVi/j12IlNDbdxbeci1OEgV3YRDpYH55hZHBj+3C3YFn2rAQnFGipREiDs6e2kooTdijsTtAOPjoPIP7TijRXBhy+24tMZ1M2rr6tlLzJUuwgA6Fwj4FlLhFwJqiixeU0gAAP73HEm9UZRy0CnTr85km9OmXcF7j9Pc16oDMB9+xBrEgKUkbkxMdL6bc9wYba+9ZE6ps9BQU0gEf9UjkPHRbm7ZXxVRgHcCZn1ljAEfyulh6vqE1AcLdZdGE3D4HKe3cyjNrz84WAjnATkXkieO6Z42PMkkqHfBfNKtZXRNp8Rfr8e7KUqL0hXAOM8NLYPy18IKJl5ZbEO4hVj1snaKnmT+P4kcR3T7l9wY9pPEiyUPnIRrzV3AwQ1f7wzcTcUTFxuwq6EUlUp3TDUlkD5S5hQ0IiXZc5gQIcstgZeh+GB2aUr2LIDZQztcnxDF3RSme+uXb/cpVZVUZoiCQtKPyahe45Ou1pIU3UkdwrAC1ZN2ByM2e6dbHCutDBasxIbr3gJYAeb93DUlKS/+AugTVntSlUlE6AcMz0XQ4Lr1vYRQL7Ug1AlpYkd2wQvorG449yzC6XymDidBnkoTMm7gsB84WGvOwt6GkYmv8lh4k1yy4Z/Xhuyj4WNEApdKOaBMDz02t0vSOdsuzSDL4SjR1hH+8cVCb8ikQlpFOcFd1XoVUUKJOwtVeD21CkGYuwfdxWMt6KwYQW/hsf486kLfts1P6D+/6GQMZvA8Xj9WCuqr/c4HAczNMRLdZ1ApMn7kdWQI2gV5viCeUUW5ZIIxOuG+9XIVRqT2kEeiCVdUnRKAsNeaP0Fmbc8HmvVYAqE3X3ESCaLE1PD1vJjsmKkofYI5W3Lgpl/Yq7ByXpVAxi3RqTG+LnyV4nvWQCRcil6mEoAAAAA="
            alt="Profile"
            className="profile-photo"
          />

          <div className="profile-user-info">
            <p className="profile-name">{details?.name || currentUser?.name}</p>
            <p className="profile-email">{currentUser?.email}</p>

            <div className="profile-top-stats">
              <div className="mini-stat">
                <span className="mini-stat-number">{labCount}</span>
                <span className="mini-stat-label">Lab Reports</span>
              </div>

              <div className="mini-stat">
                <span className="mini-stat-number">{friendsCount}</span>
                <span className="mini-stat-label">Friends</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="profile-details-grid">

          <div className="profile-section">
            <h4>Basic Information</h4>
            <p><strong>Age:</strong> {details?.age}</p>
            <p><strong>Gender:</strong> {details?.gender}</p>
            <p><strong>Height:</strong> {details?.height} cm</p>
            <p><strong>Weight:</strong> {details?.weight} kg</p>
            <p><strong>Cholesterol:</strong> {details?.cholesterolLevel}</p>
          </div>

          <div className="profile-section">
            <h4>Medical Conditions</h4>
            <p><strong>Diabetic:</strong> {details?.isDiabetic ? "Yes" : "No"}</p>
            <p><strong>Hypertension:</strong> {details?.hasHypertension ? "Yes" : "No"}</p>
            <p><strong>Thyroid:</strong> {details?.hasThyroid ? "Yes" : "No"}</p>
            <p><strong>Heart Disease:</strong> {details?.hasHeartDisease ? "Yes" : "No"}</p>
            <p><strong>Kidney Disease:</strong> {details?.hasKidneyDisease ? "Yes" : "No"}</p>
          </div>

          <div className="profile-section">
            <h4>Allergies</h4>
            <p><strong>Food Allergies:</strong> {details?.foodAllergies || "None"}</p>
            <p><strong>Other Allergies:</strong> {details?.hasOtherAllergies || "None"}</p>
          </div>

          <div className="profile-section">
            <h4>Lifestyle</h4>
            <p><strong>Exercise:</strong> {details?.lifestyle?.exerciseFrequency || "N/A"}</p>
            <p><strong>Sleep:</strong> {details?.lifestyle?.sleepHours || "N/A"}</p>
            <p><strong>Smoking:</strong> {details?.lifestyle?.smoke ? "Yes" : "No"}</p>
            <p><strong>Alcohol:</strong> {details?.lifestyle?.alcohol ? "Yes" : "No"}</p>
            <p><strong>Water Intake:</strong> {details?.lifestyle?.waterIntake || "N/A"}</p>
            <p><strong>Stress Level:</strong> {details?.lifestyle?.stressLevel || "N/A"}</p>
          </div>

          <div className="profile-section">
            <h4>Additional Details</h4>
            <p><strong>Medications:</strong> {details?.additionalDetails?.medications || "None"}</p>
            <p><strong>Dietary Preference:</strong> {details?.additionalDetails?.dietaryPreference || "N/A"}</p>
          </div>

        </div>

        <div className="profile-actions">
          <button
            className="edit-btn"
            onClick={() => navigate("/user-details-form")}
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};
export default Profile;
