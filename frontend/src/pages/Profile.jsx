import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import "./Profile.css";

const API_URL = "http://localhost:5000";

const emptyProfile = {
  education: "",
  field: "",
  location: "",
  skills: [],
  interests: [],
  experience: "Student",
  availability: "Full Time",
};

function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [user, setUser] = useState(null);

  const [skillsText, setSkillsText] = useState("");
  const [interestsText, setInterestsText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);

  // =====================================
  // GET TOKEN
  // =====================================

  const getToken = () => {
    return (
      localStorage.getItem("melahubToken") ||
      localStorage.getItem("token")
    );
  };

  // =====================================
  // LOAD PROFILE FROM MONGODB
  // =====================================

  useEffect(() => {
    const loadProfile = async () => {
      const token = getToken();

      if (!token) {
        setError("You must be logged in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile."
          );
        }

        const loadedUser = data.user;

        setUser(loadedUser);

        const loadedProfile = {
          education:
            loadedUser.profile?.education || "",
          field:
            loadedUser.profile?.field || "",
          location:
            loadedUser.profile?.location || "",
          skills:
            loadedUser.profile?.skills || [],
          interests:
            loadedUser.profile?.interests || [],
          experience:
            loadedUser.profile?.experience ||
            "Student",
          availability:
            loadedUser.profile?.availability ||
            "Full Time",
        };

        setProfile(loadedProfile);

        setSkillsText(
          loadedProfile.skills.join(", ")
        );

        setInterestsText(
          loadedProfile.interests.join(", ")
        );
      } catch (err) {
        console.error("Profile loading error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // SAVE PROFILE TO MONGODB
  // =====================================

  const handleSave = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const interests = interestsText
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);

    const updatedProfile = {
      education: profile.education,
      field: profile.field,
      location: profile.location,
      skills,
      interests,
      experience: profile.experience,
      availability: profile.availability,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save profile."
        );
      }

      setProfile(data.user.profile);

      setSkillsText(
        data.user.profile.skills.join(", ")
      );

      setInterestsText(
        data.user.profile.interests.join(", ")
      );

      setUser((previous) => ({
        ...previous,
        ...data.user,
      }));

      // Keep the local user information updated
      localStorage.setItem(
        "melahubUser",
        JSON.stringify({
          ...JSON.parse(
            localStorage.getItem("melahubUser") || "{}"
          ),
          ...data.user,
        })
      );

      setSaved(true);
      setEditing(false);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // CANCEL EDITING
  // =====================================

  const handleCancel = () => {
    if (!user?.profile) {
      setEditing(false);
      return;
    }

    const originalProfile = {
      education: user.profile.education || "",
      field: user.profile.field || "",
      location: user.profile.location || "",
      skills: user.profile.skills || [],
      interests: user.profile.interests || [],
      experience:
        user.profile.experience || "Student",
      availability:
        user.profile.availability || "Full Time",
    };

    setProfile(originalProfile);

    setSkillsText(
      originalProfile.skills.join(", ")
    );

    setInterestsText(
      originalProfile.interests.join(", ")
    );

    setEditing(false);
  };

  const skillCount = profile.skills.length;

  // =====================================
  // PAGE
  // =====================================

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-container">

          <BackButton />

          {loading && (
            <div className="profile-loading profile-loading-inline">
              <div className="loading-spinner"></div>
              <span>Updating your profile...</span>
            </div>
          )}

          {/* HEADER */}
          <div className="profile-header">

            <div>
              <span className="profile-label">
                🇪🇹 MELAHUB TALENT PROFILE
              </span>

              <h1>My Profile</h1>

              <p>
                Build your profile so MelaHub can
                discover opportunities that fit you.
              </p>
            </div>

            <div className="profile-avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="profile-error">
              ❌ {error}
            </div>
          )}

          {/* SUCCESS */}
          {saved && (
            <div className="profile-success">
              ✓ Profile saved successfully to MongoDB!
            </div>
          )}

          <div className="profile-grid">

            {/* =================================
                PERSONAL INFORMATION
            ================================= */}

            <section className="profile-card">

              <div className="profile-card-title">

                <div>
                  <h2>Personal Information</h2>
                  <p>
                    Your basic MelaHub information
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    className="profile-edit-btn"
                    onClick={() => setEditing(true)}
                  >
                    ✏️ Edit
                  </button>
                )}

              </div>

              {!editing ? (

                <div className="profile-info-list">

                  <div className="profile-info-item">
                    <span>👤</span>

                    <div>
                      <small>Full Name</small>
                      <strong>
                        {user?.name || "Not provided"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <span>📧</span>

                    <div>
                      <small>Email</small>
                      <strong>
                        {user?.email || "Not provided"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <span>🎓</span>

                    <div>
                      <small>Education</small>
                      <strong>
                        {profile.education ||
                          "Not provided"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <span>📚</span>

                    <div>
                      <small>Field / Profession</small>
                      <strong>
                        {profile.field ||
                          "Not provided"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <span>📍</span>

                    <div>
                      <small>Location</small>
                      <strong>
                        {profile.location ||
                          "Not provided"}
                      </strong>
                    </div>
                  </div>

                </div>

              ) : (

                <form
                  className="profile-form"
                  onSubmit={handleSave}
                >

                  <label>
                    Full Name
                    <input
                      value={user?.name || ""}
                      disabled
                    />
                    <small>
                      Name is managed by your account.
                    </small>
                  </label>

                  <label>
                    Email
                    <input
                      value={user?.email || ""}
                      disabled
                    />
                  </label>

                  <label>
                    Education
                    <input
                      name="education"
                      value={profile.education}
                      onChange={handleChange}
                      placeholder="University, college, school..."
                    />
                  </label>

                  <label>
                    Field / Profession
                    <input
                      name="field"
                      value={profile.field}
                      onChange={handleChange}
                      placeholder="Computer Science, Farming, Business..."
                    />
                  </label>

                  <label>
                    Location
                    <input
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="Harar, Addis Ababa, Oromia..."
                    />
                  </label>

                  <div className="profile-form-buttons">

                    <button
                      type="button"
                      className="profile-cancel-btn"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="profile-save-btn"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : "💾 Save Profile"}
                    </button>

                  </div>

                </form>

              )}

            </section>

            {/* =================================
                SKILLS & INTERESTS
            ================================= */}

            <section className="profile-card">

              <div className="profile-card-title">

                <div>
                  <h2>Skills & Interests</h2>

                  <p>
                    These will power Smart Matching
                  </p>
                </div>

                <span className="skill-count">
                  {skillCount} Skills
                </span>

              </div>

              <form onSubmit={handleSave}>

                <div className="profile-section">

                  <label>
                    🛠️ Your Skills
                  </label>

                  <input
                    value={skillsText}
                    onChange={(e) =>
                      setSkillsText(e.target.value)
                    }
                    placeholder="Farming, React, Marketing, Photography..."
                  />

                  <small>
                    Separate skills with commas.
                  </small>

                </div>

                <div className="profile-section">

                  <label>
                    🎯 Your Interests
                  </label>

                  <input
                    value={interestsText}
                    onChange={(e) =>
                      setInterestsText(e.target.value)
                    }
                    placeholder="Jobs, scholarships, farming, business..."
                  />

                </div>

                <div className="profile-section">

                  <label>
                    💼 Experience
                  </label>

                  <select
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                  >
                    <option>Student</option>
                    <option>Entry Level</option>
                    <option>1-2 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                    <option>
                      Experienced Professional
                    </option>
                  </select>

                </div>

                <div className="profile-section">

                  <label>
                    🕐 Availability
                  </label>

                  <select
                    name="availability"
                    value={profile.availability}
                    onChange={handleChange}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Remote</option>
                    <option>Weekends</option>
                    <option>Flexible</option>
                  </select>

                </div>

                <button
                  type="submit"
                  className="profile-save-btn profile-main-save"
                  disabled={saving}
                >
                  {saving
                    ? "⏳ Saving to MongoDB..."
                    : "🚀 Update My MelaHub Profile"}
                </button>

              </form>

            </section>

          </div>

          {/* =================================
              SMART MATCH PREVIEW
          ================================= */}

          <section className="match-preview">

            <div className="match-preview-icon">
              🧠
            </div>

            <div className="match-preview-content">

              <span>
                NEXT MELAHUB FEATURE
              </span>

              <h2>
                Smart Opportunity Matching
              </h2>

              <p>
                MelaHub will compare your skills,
                interests, experience and location
                with available opportunities and
                recommend the ones that fit you best.
              </p>

            </div>

            <div className="match-example">
              <strong>AI</strong>
              <span>Matching</span>
            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;