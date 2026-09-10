import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import "./Admin.css";

const API_URL = "http://localhost:5000";

const emptyOpportunityForm = {
  title: "",
  description: "",
  category: "Job",
  location: "Ethiopia",
  organization: "",
  deadline: "",
  applicationUrl: "",
  skills: "",
  interests: "",
  isActive: true,
};

const emptyBusinessForm = {
  name: "",
  description: "",
  category: "Technology",
  location: "Addis Ababa, Ethiopia",
  phone: "",
  email: "",
  website: "",
  image: "",
  isActive: true,
};

function Admin() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [businessesLoading, setBusinessesLoading] = useState(false);

  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [opportunityForm, setOpportunityForm] = useState(
    emptyOpportunityForm
  );
  const [savingOpportunity, setSavingOpportunity] = useState(false);

  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [businessForm, setBusinessForm] = useState(emptyBusinessForm);
  const [savingBusiness, setSavingBusiness] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [statusId, setStatusId] = useState(null);
  const [applicationStatusId, setApplicationStatusId] = useState(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState(null);
  const [businessStatusId, setBusinessStatusId] = useState(null);
  const [deletingBusinessId, setDeletingBusinessId] = useState(null);

  // =========================================================
  // PLATFORM SETTINGS
  // =========================================================

  const [platformSettings, setPlatformSettings] = useState({
    siteName: "MelaHub",
    supportEmail: "support@melahub.com",
    maintenanceMode: false,
    emailNotifications: true,
    newApplicationNotifications: true,
    newBusinessNotifications: true,
  });

  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const getToken = () =>
    localStorage.getItem("melahubToken") ||
    localStorage.getItem("token");

  // =========================================================
  // LOAD SETTINGS FROM MONGODB
  // =========================================================

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);

      const response = await fetch(`${API_URL}/api/settings`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load settings."
        );
      }

      if (data.settings) {
        setPlatformSettings({
          siteName: data.settings.siteName || "MelaHub",

          supportEmail:
            data.settings.supportEmail ||
            "support@melahub.com",

          maintenanceMode:
            data.settings.maintenanceMode ?? false,

          emailNotifications:
            data.settings.emailNotifications ?? true,

          newApplicationNotifications:
            data.settings.newApplicationNotifications ?? true,

          newBusinessNotifications:
            data.settings.newBusinessNotifications ?? true,
        });
      }
    } catch (err) {
      console.error("Settings loading error:", err);
      setError(err.message || "Could not load settings.");
    } finally {
      setSettingsLoading(false);
    }
  };

  // =========================================================
  // INITIAL ADMIN DATA
  // =========================================================

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    loadAdminData();
    loadSettings();
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [dashboardResponse, usersResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/dashboard`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
      ]);

      const dashboardData = await dashboardResponse.json();
      const usersData = await usersResponse.json();

      if (!dashboardResponse.ok) {
        throw new Error(
          dashboardData.message || "Could not load admin dashboard."
        );
      }

      if (!usersResponse.ok) {
        throw new Error(usersData.message || "Could not load users.");
      }

      setStats(dashboardData.statistics);
      setUsers(usersData.users || []);

      await Promise.all([
        loadOpportunities(),
        loadApplications(),
        loadBusinesses(),
      ]);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOpportunities = async () => {
    try {
      setOpportunitiesLoading(true);

      const response = await fetch(
        `${API_URL}/api/opportunities/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load opportunities."
        );
      }

      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setOpportunitiesLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);

      const response = await fetch(
        `${API_URL}/api/applications/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load applications."
        );
      }

      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const loadBusinesses = async () => {
    try {
      setBusinessesLoading(true);

      const response = await fetch(
        `${API_URL}/api/businesses/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load businesses."
        );
      }

      setBusinesses(data.businesses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusinessesLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSearchTerm("");
    setError("");
    setSidebarOpen(false);
  };

  // =========================================================
  // USERS
  // =========================================================

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userName}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete user.");
      }

      setUsers((current) =>
        current.filter((account) => account._id !== userId)
      );

      setStats((current) => {
        if (!current) return current;

        return {
          ...current,
          totalUsers: Math.max(0, current.totalUsers - 1),
          totalAccounts: Math.max(0, current.totalAccounts - 1),
        };
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // APPLICATIONS
  // =========================================================

  const handleUpdateApplicationStatus = async (
    application,
    status
  ) => {
    try {
      setApplicationStatusId(application._id);

      const response = await fetch(
        `${API_URL}/api/applications/admin/${application._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update application."
        );
      }

      setApplications((current) =>
        current.map((item) =>
          item._id === application._id ? data.application : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setApplicationStatusId(null);
    }
  };

  const handleDeleteApplication = async (application) => {
    if (
      !window.confirm(
        `Delete the application from ${
          application.name || "this applicant"
        }?`
      )
    ) {
      return;
    }

    try {
      setDeletingApplicationId(application._id);

      const response = await fetch(
        `${API_URL}/api/applications/admin/${application._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not delete application."
        );
      }

      setApplications((current) =>
        current.filter((item) => item._id !== application._id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingApplicationId(null);
    }
  };

  // =========================================================
  // OPPORTUNITIES
  // =========================================================

  const openCreateOpportunityForm = () => {
    setEditingOpportunity(null);
    setOpportunityForm(emptyOpportunityForm);
    setShowOpportunityForm(true);
  };

  const openEditOpportunityForm = (opportunity) => {
    setEditingOpportunity(opportunity);

    setOpportunityForm({
      title: opportunity.title || "",
      description: opportunity.description || "",
      category: opportunity.category || "Job",
      location: opportunity.location || "Ethiopia",
      organization: opportunity.organization || "",
      deadline: opportunity.deadline
        ? new Date(opportunity.deadline).toISOString().split("T")[0]
        : "",
      applicationUrl: opportunity.applicationUrl || "",
      skills: (opportunity.skills || []).join(", "),
      interests: (opportunity.interests || []).join(", "),
      isActive: opportunity.isActive !== false,
    });

    setShowOpportunityForm(true);
  };

  const closeOpportunityForm = () => {
    setShowOpportunityForm(false);
    setEditingOpportunity(null);
    setOpportunityForm(emptyOpportunityForm);
  };

  const handleOpportunityFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setOpportunityForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpportunitySubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingOpportunity(true);
      setError("");

      const payload = {
        title: opportunityForm.title.trim(),
        description: opportunityForm.description.trim(),
        category: opportunityForm.category.trim(),
        location: opportunityForm.location.trim(),
        organization: opportunityForm.organization.trim(),
        deadline: opportunityForm.deadline || null,
        applicationUrl: opportunityForm.applicationUrl.trim(),
        skills: opportunityForm.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        interests: opportunityForm.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isActive: opportunityForm.isActive,
      };

      const url = editingOpportunity
        ? `${API_URL}/api/opportunities/admin/${editingOpportunity._id}`
        : `${API_URL}/api/opportunities/admin`;

      const response = await fetch(url, {
        method: editingOpportunity ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not save opportunity."
        );
      }

      if (editingOpportunity) {
        setOpportunities((current) =>
          current.map((item) =>
            item._id === editingOpportunity._id
              ? data.opportunity
              : item
          )
        );
      } else {
        setOpportunities((current) => [
          data.opportunity,
          ...current,
        ]);
      }

      closeOpportunityForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingOpportunity(false);
    }
  };

  const handleDeleteOpportunity = async (opportunity) => {
    if (
      !window.confirm(
        `Delete "${opportunity.title}" permanently?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(opportunity._id);

      const response = await fetch(
        `${API_URL}/api/opportunities/admin/${opportunity._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not delete opportunity."
        );
      }

      setOpportunities((current) =>
        current.filter((item) => item._id !== opportunity._id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleOpportunityStatus = async (opportunity) => {
    try {
      setStatusId(opportunity._id);

      const response = await fetch(
        `${API_URL}/api/opportunities/admin/${opportunity._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not change status."
        );
      }

      setOpportunities((current) =>
        current.map((item) =>
          item._id === opportunity._id
            ? data.opportunity
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusId(null);
    }
  };

  // =========================================================
  // BUSINESSES
  // =========================================================

  const openCreateBusinessForm = () => {
    setEditingBusiness(null);
    setBusinessForm(emptyBusinessForm);
    setShowBusinessForm(true);
  };

  const openEditBusinessForm = (business) => {
    setEditingBusiness(business);

    setBusinessForm({
      name: business.name || "",
      description: business.description || "",
      category: business.category || "Technology",
      location: business.location || "Addis Ababa, Ethiopia",
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
      image: business.image || "",
      isActive: business.isActive !== false,
    });

    setShowBusinessForm(true);
  };

  const closeBusinessForm = () => {
    setShowBusinessForm(false);
    setEditingBusiness(null);
    setBusinessForm(emptyBusinessForm);
  };

  const handleBusinessFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setBusinessForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBusinessSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingBusiness(true);
      setError("");

      const payload = {
        name: businessForm.name.trim(),
        description: businessForm.description.trim(),
        category: businessForm.category.trim(),
        location: businessForm.location.trim(),
        phone: businessForm.phone.trim(),
        email: businessForm.email.trim(),
        website: businessForm.website.trim(),
        image: businessForm.image.trim(),
        isActive: businessForm.isActive,
      };

      const url = editingBusiness
        ? `${API_URL}/api/businesses/admin/${editingBusiness._id}`
        : `${API_URL}/api/businesses/admin`;

      const response = await fetch(url, {
        method: editingBusiness ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not save business."
        );
      }

      if (editingBusiness) {
        setBusinesses((current) =>
          current.map((item) =>
            item._id === editingBusiness._id
              ? data.business
              : item
          )
        );
      } else {
        setBusinesses((current) => [
          data.business,
          ...current,
        ]);
      }

      closeBusinessForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingBusiness(false);
    }
  };

  const handleToggleBusinessStatus = async (business) => {
    try {
      setBusinessStatusId(business._id);

      const response = await fetch(
        `${API_URL}/api/businesses/admin/${business._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            isActive: !business.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not change status."
        );
      }

      setBusinesses((current) =>
        current.map((item) =>
          item._id === business._id
            ? data.business
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusinessStatusId(null);
    }
  };

  const handleDeleteBusiness = async (business) => {
    if (
      !window.confirm(
        `Delete "${business.name}" permanently?`
      )
    ) {
      return;
    }

    try {
      setDeletingBusinessId(business._id);

      const response = await fetch(
        `${API_URL}/api/businesses/admin/${business._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not delete business."
        );
      }

      setBusinesses((current) =>
        current.filter((item) => item._id !== business._id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingBusinessId(null);
    }
  };

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase();

    if (!search) return users;

    return users.filter((item) =>
      [item.name, item.email, item.role]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [users, searchTerm]);

  const filteredOpportunities = useMemo(() => {
    const search = searchTerm.toLowerCase();

    if (!search) return opportunities;

    return opportunities.filter((item) =>
      [
        item.title,
        item.description,
        item.category,
        item.organization,
        item.location,
        ...(item.skills || []),
        ...(item.interests || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [opportunities, searchTerm]);

  const filteredApplications = useMemo(() => {
    const search = searchTerm.toLowerCase();

    if (!search) return applications;

    return applications.filter((item) =>
      [
        item.name,
        item.email,
        item.user?.name,
        item.user?.email,
        item.opportunity?.title,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [applications, searchTerm]);

  const filteredBusinesses = useMemo(() => {
    const search = searchTerm.toLowerCase();

    if (!search) return businesses;

    return businesses.filter((item) =>
      [
        item.name,
        item.description,
        item.category,
        item.location,
        item.phone,
        item.email,
        item.website,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [businesses, searchTerm]);

  // =========================================================
  // REVENUE
  // =========================================================

  const activeBusinesses = businesses.filter(
    (business) => business.isActive
  ).length;

  const activeOpportunities = opportunities.filter(
    (opportunity) => opportunity.isActive
  ).length;

  const pendingApplications = applications.filter(
    (application) =>
      application.status === "Submitted" ||
      application.status === "Under Review"
  ).length;

  const renderRevenue = () => (
    <section className="admin-section">
      <div className="section-heading">
        <div>
          <p className="admin-eyebrow">MONETIZATION</p>
          <h2>Revenue Center</h2>
          <p>
            Track the platform activity that can become
            future MelaHub revenue.
          </p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon">🏢</div>
          <span>Active Businesses</span>
          <strong>{activeBusinesses}</strong>
          <small>Potential paid listings</small>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">💼</div>
          <span>Active Opportunities</span>
          <strong>{activeOpportunities}</strong>
          <small>Published listings</small>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📝</div>
          <span>Applications</span>
          <strong>{applications.length}</strong>
          <small>Total applications</small>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <span>Pending</span>
          <strong>{pendingApplications}</strong>
          <small>Applications awaiting review</small>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-heading">
          <div>
            <p className="admin-eyebrow">FUTURE INCOME</p>
            <h2>Monetization Plans</h2>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-icon">⭐</div>
            <span>Featured Business</span>
            <strong>Coming</strong>
            <small>
              Businesses can pay to appear at the top.
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">🚀</div>
            <span>Promoted Opportunity</span>
            <strong>Coming</strong>
            <small>
              Organizations can promote opportunities.
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">💎</div>
            <span>Premium Business</span>
            <strong>Coming</strong>
            <small>
              Advanced business profiles and analytics.
            </small>
          </div>
        </div>
      </div>
    </section>
  );

  // =========================================================
  // SETTINGS
  // =========================================================

  const handleSettingChange = (event) => {
    const { name, value, type, checked } = event.target;

    setPlatformSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSettingsSaved(false);
  };

  const saveSettings = async () => {
    try {
      setSettingsSaving(true);
      setError("");
      setSettingsSaved(false);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(platformSettings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not save settings."
        );
      }

      if (data.settings) {
        setPlatformSettings({
          siteName:
            data.settings.siteName || "MelaHub",

          supportEmail:
            data.settings.supportEmail ||
            "support@melahub.com",

          maintenanceMode:
            data.settings.maintenanceMode ?? false,

          emailNotifications:
            data.settings.emailNotifications ?? true,

          newApplicationNotifications:
            data.settings.newApplicationNotifications ?? true,

          newBusinessNotifications:
            data.settings.newBusinessNotifications ?? true,
        });
      }

      setSettingsSaved(true);

      setTimeout(() => {
        setSettingsSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Settings saving error:", err);
      setError(err.message || "Could not save settings.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const renderSettings = () => (
    <section className="admin-section">
      <div className="section-heading">
        <div>
          <p className="admin-eyebrow">SYSTEM SETTINGS</p>
          <h2>Settings</h2>
          <p>
            Manage your MelaHub administrator and platform
            preferences.
          </p>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-heading">
          <div>
            <p className="admin-eyebrow">ADMIN ACCOUNT</p>
            <h2>Account Information</h2>
          </div>
        </div>

        <div className="form-grid">
          <label>
            <span>Admin Name</span>

            <input
              value={user?.name || ""}
              disabled
            />
          </label>

          <label>
            <span>Admin Email</span>

            <input
              value={user?.email || ""}
              disabled
            />
          </label>

          <label>
            <span>Role</span>

            <input
              value="Administrator"
              disabled
            />
          </label>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-heading">
          <div>
            <p className="admin-eyebrow">PLATFORM</p>
            <h2>Platform Settings</h2>
          </div>
        </div>

        {settingsLoading && (
          <div className="admin-loading">
            Loading platform settings...
          </div>
        )}

        <div className="form-grid">
          <label>
            <span>Platform Name</span>

            <input
              name="siteName"
              value={platformSettings.siteName}
              onChange={handleSettingChange}
              disabled={settingsLoading}
            />
          </label>

          <label>
            <span>Support Email</span>

            <input
              type="email"
              name="supportEmail"
              value={platformSettings.supportEmail}
              onChange={handleSettingChange}
              disabled={settingsLoading}
            />
          </label>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={platformSettings.maintenanceMode}
              onChange={handleSettingChange}
              disabled={settingsLoading}
            />

            <span>
              Enable maintenance mode
            </span>
          </label>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-heading">
          <div>
            <p className="admin-eyebrow">NOTIFICATIONS</p>
            <h2>Notification Settings</h2>
          </div>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={platformSettings.emailNotifications}
            onChange={handleSettingChange}
            disabled={settingsLoading}
          />

          <span>
            Enable email notifications
          </span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="newApplicationNotifications"
            checked={
              platformSettings.newApplicationNotifications
            }
            onChange={handleSettingChange}
            disabled={settingsLoading}
          />

          <span>
            Notify me about new applications
          </span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="newBusinessNotifications"
            checked={
              platformSettings.newBusinessNotifications
            }
            onChange={handleSettingChange}
            disabled={settingsLoading}
          />

          <span>
            Notify me about new businesses
          </span>
        </label>
      </div>

      <div className="modal-actions">
        {settingsSaved && (
          <span className="status-badge active-status">
            ✓ Settings Saved
          </span>
        )}

        <button
          className="admin-primary-button"
          onClick={saveSettings}
          disabled={settingsSaving || settingsLoading}
        >
          {settingsSaving
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>
    </section>
  );

  // =========================================================
  // AUTH CHECK
  // =========================================================

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const navItems = [
    ["overview", "📊", "Overview"],
    ["users", "👥", "Users"],
    ["opportunities", "💼", "Opportunities"],
    ["applications", "📝", "Applications"],
    ["businesses", "🏢", "Businesses"],
    ["revenue", "💰", "Revenue"],
    ["settings", "⚙️", "Settings"],
  ];

  // =========================================================
  // MAIN RENDER
  // =========================================================

  return (
    <div className="admin-page">
      <button
        className="admin-mobile-menu"
        onClick={() =>
          setSidebarOpen((current) => !current)
        }
      >
        {sidebarOpen ? "×" : "☰"}
      </button>

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "mobile-open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-logo">M</div>

          <div>
            <h2>MelaHub</h2>
            <span>Administration</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(([key, icon, label]) => (
            <button
              key={key}
              className={`admin-nav-item ${
                activeSection === key ? "active" : ""
              }`}
              onClick={() => handleNavigation(key)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-back-row">
          <BackButton />
        </div>

        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">
              MELAHUB ADMINISTRATION
            </p>

            <h1>
              Welcome, {user?.name || "Admin"} 👋
            </h1>

            <p>
              Manage your MelaHub platform from one place.
            </p>
          </div>

          <div className="admin-account">
            <div className="admin-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>
              <strong>
                {user?.name || "MelaHub Admin"}
              </strong>

              <span>{user?.email}</span>
            </div>
          </div>
        </header>

        {loading && (
          <div className="admin-loading">
            Loading admin dashboard...
          </div>
        )}

        {error && (
          <div className="admin-error">
            <strong>Something went wrong:</strong>
            <span>{error}</span>

            <button onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {!loading && (
          <>
            {activeSection === "overview" && (
              <section className="admin-section">
                <div className="admin-stats">
                  <div className="admin-stat-card">
                    <div className="stat-icon">👥</div>
                    <span>Total Users</span>
                    <strong>{stats?.totalUsers ?? 0}</strong>
                    <small>
                      Registered MelaHub users
                    </small>
                  </div>

                  <div className="admin-stat-card">
                    <div className="stat-icon">🛡️</div>
                    <span>Total Admins</span>
                    <strong>{stats?.totalAdmins ?? 0}</strong>
                    <small>
                      Platform administrators
                    </small>
                  </div>

                  <div className="admin-stat-card">
                    <div className="stat-icon">💼</div>
                    <span>Opportunities</span>
                    <strong>
                      {opportunities.length}
                    </strong>
                    <small>
                      Platform opportunities
                    </small>
                  </div>

                  <div className="admin-stat-card">
                    <div className="stat-icon">📝</div>
                    <span>Applications</span>
                    <strong>
                      {applications.length}
                    </strong>
                    <small>
                      Submitted applications
                    </small>
                  </div>

                  <div className="admin-stat-card">
                    <div className="stat-icon">🏢</div>
                    <span>Businesses</span>
                    <strong>
                      {businesses.length}
                    </strong>
                    <small>
                      Business listings
                    </small>
                  </div>
                </div>

                <div className="admin-section">
                  <div className="section-heading">
                    <div>
                      <p className="admin-eyebrow">
                        PLATFORM USERS
                      </p>
                      <h2>Recent Accounts</h2>
                    </div>
                  </div>

                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.slice(0, 8).map((account) => (
                          <tr key={account._id}>
                            <td>
                              <div className="user-name-cell">
                                <div className="user-small-avatar">
                                  {account.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </div>

                                <strong>
                                  {account.name}
                                </strong>
                              </div>
                            </td>

                            <td>{account.email}</td>

                            <td>
                              <span className="role-badge user-role">
                                {account.role}
                              </span>
                            </td>

                            <td>
                              {account.createdAt
                                ? new Date(
                                    account.createdAt
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "users" && (
              <section className="admin-section">
                <div className="section-heading">
                  <div>
                    <p className="admin-eyebrow">
                      ACCOUNT MANAGEMENT
                    </p>
                    <h2>All Users</h2>
                  </div>
                </div>

                <div className="users-toolbar">
                  <div className="admin-search">
                    <span>🔎</span>

                    <input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((account) => (
                        <tr key={account._id}>
                          <td>
                            <div className="user-name-cell">
                              <div className="user-small-avatar">
                                {account.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>

                              <strong>
                                {account.name}
                              </strong>
                            </div>
                          </td>

                          <td>{account.email}</td>

                          <td>
                            <span className="role-badge user-role">
                              {account.role}
                            </span>
                          </td>

                          <td>
                            {account.createdAt
                              ? new Date(
                                  account.createdAt
                                ).toLocaleDateString()
                              : "-"}
                          </td>

                          <td>
                            {account._id === user?._id ? (
                              "Protected"
                            ) : (
                              <button
                                className="delete-user-button"
                                onClick={() =>
                                  handleDeleteUser(
                                    account._id,
                                    account.name
                                  )
                                }
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeSection === "opportunities" && (
              <section className="admin-section">
                <div className="section-heading">
                  <div>
                    <p className="admin-eyebrow">
                      CONTENT MANAGEMENT
                    </p>
                    <h2>Opportunities</h2>
                  </div>

                  <button
                    className="admin-primary-button"
                    onClick={openCreateOpportunityForm}
                  >
                    + Create Opportunity
                  </button>
                </div>

                <div className="users-toolbar">
                  <div className="admin-search">
                    <span>🔎</span>

                    <input
                      placeholder="Search opportunities..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                    />
                  </div>

                  <button
                    className="admin-refresh-button"
                    onClick={loadOpportunities}
                  >
                    ↻ Refresh
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Opportunity</th>
                        <th>Category</th>
                        <th>Organization</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOpportunities.map(
                        (opportunity) => (
                          <tr key={opportunity._id}>
                            <td>
                              <strong>
                                {opportunity.title}
                              </strong>
                            </td>

                            <td>
                              {opportunity.category}
                            </td>

                            <td>
                              {opportunity.organization ||
                                "-"}
                            </td>

                            <td>
                              <span
                                className={
                                  opportunity.isActive
                                    ? "status-badge active-status"
                                    : "status-badge inactive-status"
                                }
                              >
                                {opportunity.isActive
                                  ? "Published"
                                  : "Unpublished"}
                              </span>
                            </td>

                            <td>
                              <div className="opportunity-actions">
                                <button
                                  className="edit-button"
                                  onClick={() =>
                                    openEditOpportunityForm(
                                      opportunity
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="status-button"
                                  onClick={() =>
                                    handleToggleOpportunityStatus(
                                      opportunity
                                    )
                                  }
                                >
                                  {opportunity.isActive
                                    ? "Unpublish"
                                    : "Publish"}
                                </button>

                                <button
                                  className="delete-user-button"
                                  onClick={() =>
                                    handleDeleteOpportunity(
                                      opportunity
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeSection === "applications" && (
              <section className="admin-section">
                <div className="section-heading">
                  <div>
                    <p className="admin-eyebrow">
                      APPLICATION MANAGEMENT
                    </p>
                    <h2>Applications</h2>
                  </div>
                </div>

                <div className="users-toolbar">
                  <div className="admin-search">
                    <span>🔎</span>

                    <input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                    />
                  </div>

                  <button
                    className="admin-refresh-button"
                    onClick={loadApplications}
                  >
                    ↻ Refresh
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Opportunity</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map(
                        (application) => (
                          <tr key={application._id}>
                            <td>
                              <strong>
                                {application.name ||
                                  application.user?.name ||
                                  "Unknown"}
                              </strong>

                              <small>
                                {application.email ||
                                  application.user?.email ||
                                  ""}
                              </small>
                            </td>

                            <td>
                              {application.opportunity
                                ?.title || "-"}
                            </td>

                            <td>
                              <select
                                value={
                                  application.status ||
                                  "Submitted"
                                }
                                onChange={(e) =>
                                  handleUpdateApplicationStatus(
                                    application,
                                    e.target.value
                                  )
                                }
                                disabled={
                                  applicationStatusId ===
                                  application._id
                                }
                              >
                                <option>
                                  Submitted
                                </option>
                                <option>
                                  Under Review
                                </option>
                                <option>
                                  Accepted
                                </option>
                                <option>
                                  Rejected
                                </option>
                              </select>
                            </td>

                            <td>
                              <button
                                className="delete-user-button"
                                onClick={() =>
                                  handleDeleteApplication(
                                    application
                                  )
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeSection === "businesses" && (
              <section className="admin-section">
                <div className="section-heading">
                  <div>
                    <p className="admin-eyebrow">
                      BUSINESS MANAGEMENT
                    </p>
                    <h2>Businesses</h2>
                  </div>

                  <button
                    className="admin-primary-button"
                    onClick={openCreateBusinessForm}
                  >
                    + Add Business
                  </button>
                </div>

                <div className="users-toolbar">
                  <div className="admin-search">
                    <span>🔎</span>

                    <input
                      placeholder="Search businesses..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                    />
                  </div>

                  <button
                    className="admin-refresh-button"
                    onClick={loadBusinesses}
                  >
                    ↻ Refresh
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Business</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredBusinesses.map((business) => (
                        <tr key={business._id}>
                          <td>
                            <strong>{business.name}</strong>
                          </td>

                          <td>{business.category}</td>

                          <td>{business.location}</td>

                          <td>
                            <span
                              className={
                                business.isActive
                                  ? "status-badge active-status"
                                  : "status-badge inactive-status"
                              }
                            >
                              {business.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <div className="opportunity-actions">
                              <button
                                className="edit-button"
                                onClick={() =>
                                  openEditBusinessForm(
                                    business
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="status-button"
                                onClick={() =>
                                  handleToggleBusinessStatus(
                                    business
                                  )
                                }
                              >
                                {business.isActive
                                  ? "Disable"
                                  : "Activate"}
                              </button>

                              <button
                                className="delete-user-button"
                                onClick={() =>
                                  handleDeleteBusiness(
                                    business
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeSection === "revenue" &&
              renderRevenue()}

            {activeSection === "settings" &&
              renderSettings()}
          </>
        )}
      </main>

      {/* =====================================================
          OPPORTUNITY MODAL
          ===================================================== */}

      {showOpportunityForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <p className="admin-eyebrow">
                  OPPORTUNITY
                </p>

                <h2>
                  {editingOpportunity
                    ? "Edit Opportunity"
                    : "Create Opportunity"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={closeOpportunityForm}
              >
                ×
              </button>
            </div>

            <form
              className="opportunity-form"
              onSubmit={handleOpportunitySubmit}
            >
              <div className="form-grid">
                <label>
                  <span>Title *</span>

                  <input
                    name="title"
                    value={opportunityForm.title}
                    onChange={handleOpportunityFormChange}
                    required
                  />
                </label>

                <label>
                  <span>Category *</span>

                  <select
                    name="category"
                    value={opportunityForm.category}
                    onChange={handleOpportunityFormChange}
                  >
                    <option>Job</option>
                    <option>Scholarship</option>
                    <option>Internship</option>
                    <option>Training</option>
                    <option>Grant</option>
                    <option>Competition</option>
                    <option>Fellowship</option>
                    <option>Volunteer</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  <span>Organization</span>

                  <input
                    name="organization"
                    value={
                      opportunityForm.organization
                    }
                    onChange={handleOpportunityFormChange}
                  />
                </label>

                <label>
                  <span>Location *</span>

                  <input
                    name="location"
                    value={opportunityForm.location}
                    onChange={handleOpportunityFormChange}
                    required
                  />
                </label>

                <label>
                  <span>Deadline</span>

                  <input
                    type="date"
                    name="deadline"
                    value={opportunityForm.deadline}
                    onChange={handleOpportunityFormChange}
                  />
                </label>

                <label>
                  <span>Application URL</span>

                  <input
                    name="applicationUrl"
                    value={
                      opportunityForm.applicationUrl
                    }
                    onChange={handleOpportunityFormChange}
                  />
                </label>
              </div>

              <label>
                <span>Description</span>

                <textarea
                  name="description"
                  rows="5"
                  value={opportunityForm.description}
                  onChange={handleOpportunityFormChange}
                />
              </label>

              <label>
                <span>Skills</span>

                <input
                  name="skills"
                  value={opportunityForm.skills}
                  onChange={handleOpportunityFormChange}
                  placeholder="React, JavaScript, Python"
                />
              </label>

              <label>
                <span>Interests</span>

                <input
                  name="interests"
                  value={opportunityForm.interests}
                  onChange={handleOpportunityFormChange}
                  placeholder="AI, Technology, Research"
                />
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={opportunityForm.isActive}
                  onChange={handleOpportunityFormChange}
                />

                <span>Publish opportunity</span>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeOpportunityForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={savingOpportunity}
                >
                  {savingOpportunity
                    ? "Saving..."
                    : "Save Opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          BUSINESS MODAL
          ===================================================== */}

      {showBusinessForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <p className="admin-eyebrow">
                  BUSINESS
                </p>

                <h2>
                  {editingBusiness
                    ? "Edit Business"
                    : "Add Business"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={closeBusinessForm}
              >
                ×
              </button>
            </div>

            <form
              className="opportunity-form"
              onSubmit={handleBusinessSubmit}
            >
              <div className="form-grid">
                <label>
                  <span>Business Name *</span>

                  <input
                    name="name"
                    value={businessForm.name}
                    onChange={handleBusinessFormChange}
                    placeholder="Business name"
                    required
                  />
                </label>

                <label>
                  <span>Category *</span>

                  <select
                    name="category"
                    value={businessForm.category}
                    onChange={handleBusinessFormChange}
                  >
                    <option>Technology</option>
                    <option>Restaurant</option>
                    <option>Education</option>
                    <option>Healthcare</option>
                    <option>Retail</option>
                    <option>Finance</option>
                    <option>Transportation</option>
                    <option>Hotel</option>
                    <option>Professional Services</option>
                    <option>Beauty</option>
                    <option>Agriculture</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  <span>Location *</span>

                  <input
                    name="location"
                    value={businessForm.location}
                    onChange={handleBusinessFormChange}
                    required
                  />
                </label>

                <label>
                  <span>Phone</span>

                  <input
                    name="phone"
                    value={businessForm.phone}
                    onChange={handleBusinessFormChange}
                  />
                </label>

                <label>
                  <span>Email</span>

                  <input
                    type="email"
                    name="email"
                    value={businessForm.email}
                    onChange={handleBusinessFormChange}
                  />
                </label>

                <label>
                  <span>Website</span>

                  <input
                    name="website"
                    value={businessForm.website}
                    onChange={handleBusinessFormChange}
                  />
                </label>
              </div>

              <label>
                <span>Image URL</span>

                <input
                  name="image"
                  value={businessForm.image}
                  onChange={handleBusinessFormChange}
                  placeholder="https://..."
                />
              </label>

              <label>
                <span>Description</span>

                <textarea
                  name="description"
                  rows="5"
                  value={businessForm.description}
                  onChange={handleBusinessFormChange}
                  placeholder="Describe the business..."
                />
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={businessForm.isActive}
                  onChange={handleBusinessFormChange}
                />

                <span>
                  Show business publicly
                </span>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeBusinessForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={savingBusiness}
                >
                  {savingBusiness
                    ? "Saving..."
                    : "Save Business"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;