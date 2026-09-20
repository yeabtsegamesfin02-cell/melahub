import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import "./MyBusiness.css";

const API_URL = "http://localhost:5000";

const emptyForm = {
  name: "",
  description: "",
  category: "Technology",
  location: "Addis Ababa, Ethiopia",
  phone: "",
  email: "",
  website: "",
  image: "",
};

const CATEGORIES = [
  "Technology",
  "Restaurant",
  "Education",
  "Healthcare",
  "Retail",
  "Finance",
  "Transportation",
  "Hotel",
  "Professional Services",
  "Beauty",
  "Agriculture",
  "Other",
];

function getToken() {
  return (
    localStorage.getItem("melahubToken") ||
    localStorage.getItem("token")
  );
}

function StatusBadge({ status }) {
  const map = {
    active: { label: "Active", cls: "mb-badge-active" },
    pending: { label: "Pending Review", cls: "mb-badge-pending" },
    expired: { label: "Expired", cls: "mb-badge-expired" },
    none: { label: "No Plan", cls: "mb-badge-none" },
    rejected: { label: "Rejected", cls: "mb-badge-expired" },
  };

  const entry = map[status] || map.none;

  return <span className={`mb-badge ${entry.cls}`}>{entry.label}</span>;
}

export default function MyBusiness() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("telebirr");
  const [transactionReference, setTransactionReference] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = getToken();

  useEffect(() => {
    loadEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEverything = async () => {
    try {
      setLoading(true);
      setError("");

      const [businessRes, plansRes] = await Promise.all([
        fetch(`${API_URL}/api/businesses/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/subscriptions/plans`),
      ]);

      const businessData = await businessRes.json();
      const plansData = await plansRes.json();

      if (!businessRes.ok) {
        throw new Error(businessData.message || "Could not load your business.");
      }

      setPlans(plansData.plans || []);

      const myBusiness = (businessData.businesses || [])[0] || null;
      setBusiness(myBusiness);

      if (myBusiness) {
        await loadHistory();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscriptions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setHistory(data.subscriptions || []);
      }
    } catch {
      // non-fatal
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateBusiness = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      const response = await fetch(`${API_URL}/api/businesses/my`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create business.");
      }

      setBusiness(data.business);
      setNotice("Your business is now listed on MelaHub!");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSubscribe = async (planKey) => {
    if (planKey === "Free") {
      await submitSubscription("Free", "none", "", "");
      return;
    }

    setSelectedPlan(planKey);
    setTransactionReference("");
    setReceiptUrl("");
  };

  const submitSubscription = async (
    planKey,
    method,
    reference,
    receipt
  ) => {
    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      const response = await fetch(`${API_URL}/api/subscriptions/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: business._id,
          plan: planKey,
          paymentMethod: method,
          transactionReference: reference,
          receiptUrl: receipt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit subscription.");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setNotice(data.message || "Subscription submitted.");
      setSelectedPlan(null);

      if (data.business) setBusiness(data.business);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaidSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === "chapa") {
      submitSubscription(selectedPlan, "chapa", "", "");
      return;
    }

    if (!transactionReference.trim()) {
      setError("Please enter your payment reference / confirmation code.");
      return;
    }

    submitSubscription(selectedPlan, paymentMethod, transactionReference, receiptUrl);
  };

  if (loading) {
    return (
      <main className="mb-page">
        <BackButton />
        <div className="mb-loading">Loading your business dashboard...</div>
      </main>
    );
  }

  return (
    <main className="mb-page">
      <BackButton />

      <section className="mb-hero">
        <span className="mb-badge-tag">🏢 For Business Owners</span>
        <h1>Grow Your Business on MelaHub</h1>
        <p>
          List your business, reach thousands of students and job seekers
          across Ethiopia, and unlock premium visibility with a paid plan.
        </p>
      </section>

      {error && (
        <div className="mb-alert mb-alert-error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {notice && (
        <div className="mb-alert mb-alert-success">
          {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      {!business && (
        <section className="mb-card">
          <h2>List Your Business</h2>
          <p className="mb-muted">
            Create your free listing in under a minute. You can upgrade to a
            paid plan any time.
          </p>

          <form className="mb-form" onSubmit={handleCreateBusiness}>
            <div className="mb-form-grid">
              <label>
                <span>Business Name *</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                <span>Category *</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Location *</span>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                <span>Phone</span>
                <input name="phone" value={form.phone} onChange={handleFormChange} />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                <span>Website</span>
                <input name="website" value={form.website} onChange={handleFormChange} />
              </label>
            </div>

            <label>
              <span>Image URL</span>
              <input name="image" value={form.image} onChange={handleFormChange} placeholder="https://..." />
            </label>

            <label>
              <span>Description</span>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleFormChange}
              />
            </label>

            <button className="mb-primary-button" disabled={creating}>
              {creating ? "Creating..." : "Create My Business Listing"}
            </button>
          </form>
        </section>
      )}

      {business && (
        <>
          <section className="mb-card mb-status-card">
            <div className="mb-status-row">
              <div>
                <p className="mb-eyebrow">YOUR BUSINESS</p>
                <h2>{business.name}</h2>
                <p className="mb-muted">
                  {business.category} · {business.location}
                </p>
              </div>

              <div className="mb-status-right">
                <StatusBadge status={business.subscriptionStatus} />
                <strong className="mb-plan-name">
                  {business.subscriptionPlan} Plan
                </strong>
                {business.subscriptionExpiresAt && (
                  <span className="mb-expiry">
                    Renews/expires{" "}
                    {new Date(business.subscriptionExpiresAt).toLocaleDateString()}
                  </span>
                )}
                {business.featured && (
                  <span className="mb-featured-tag">⭐ Featured</span>
                )}
              </div>
            </div>
          </section>

          <section className="mb-card">
            <h2>Plans</h2>
            <p className="mb-muted">
              Upgrade to reach more customers with featured placement and
              unlimited listings.
            </p>

            <div className="mb-plans-grid">
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`mb-plan-card ${
                    business.subscriptionPlan === plan.key ? "mb-plan-current" : ""
                  }`}
                >
                  <h3>{plan.label}</h3>
                  <div className="mb-plan-price">
                    {plan.price === 0 ? "Free" : `${plan.price} ETB`}
                    {plan.price > 0 && <span>/month</span>}
                  </div>
                  <ul>
                    <li>
                      {plan.listingLimit === "Unlimited"
                        ? "Unlimited listings"
                        : `${plan.listingLimit} listing${plan.listingLimit > 1 ? "s" : ""}`}
                    </li>
                    <li>{plan.featured ? "⭐ Featured placement" : "Standard placement"}</li>
                  </ul>

                  <button
                    className="mb-secondary-button"
                    disabled={business.subscriptionPlan === plan.key || submitting}
                    onClick={() => handleSubscribe(plan.key)}
                  >
                    {business.subscriptionPlan === plan.key
                      ? "Current Plan"
                      : `Choose ${plan.label}`}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {selectedPlan && (
            <section className="mb-card">
              <h2>Pay for {selectedPlan} Plan</h2>

              <form className="mb-form" onSubmit={handlePaidSubmit}>
                <label>
                  <span>Payment Method</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="telebirr">Telebirr</option>
                    <option value="chapa">Chapa (pay online now)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </label>

                {paymentMethod !== "chapa" ? (
                  <>
                    <div className="mb-pay-instructions">
                      {paymentMethod === "telebirr" ? (
                        <p>
                          Send payment via Telebirr, then enter the
                          confirmation code below. Your plan activates once
                          an admin verifies it.
                        </p>
                      ) : (
                        <p>
                          Transfer to MelaHub's bank account, then enter the
                          transaction reference below. Your plan activates
                          once an admin verifies it.
                        </p>
                      )}
                    </div>

                    <label>
                      <span>Transaction Reference / Confirmation Code *</span>
                      <input
                        value={transactionReference}
                        onChange={(e) => setTransactionReference(e.target.value)}
                        required
                      />
                    </label>

                    <label>
                      <span>Receipt Screenshot URL (optional)</span>
                      <input
                        value={receiptUrl}
                        onChange={(e) => setReceiptUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </label>
                  </>
                ) : (
                  <p className="mb-pay-instructions">
                    You'll be redirected to Chapa's secure checkout to
                    complete payment by card or mobile money.
                  </p>
                )}

                <div className="mb-form-actions">
                  <button
                    type="button"
                    className="mb-secondary-button"
                    onClick={() => setSelectedPlan(null)}
                  >
                    Cancel
                  </button>

                  <button className="mb-primary-button" disabled={submitting}>
                    {submitting
                      ? "Submitting..."
                      : paymentMethod === "chapa"
                      ? "Continue to Chapa"
                      : "Submit Payment"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {history.length > 0 && (
            <section className="mb-card">
              <h2>Payment History</h2>

              <div className="mb-history-table-wrapper">
                <table className="mb-history-table">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id}>
                        <td>{item.plan}</td>
                        <td>{item.amount} ETB</td>
                        <td>{item.paymentMethod}</td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
