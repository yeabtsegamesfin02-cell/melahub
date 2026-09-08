function OpportunityCard({ opportunity }) {
  return (
    <article className="opportunity-card">

      <div className="opportunity-top">
        <div className="opportunity-icon">
          {opportunity.icon}
        </div>

        <button className="save-btn" aria-label="Save opportunity">
          ☆
        </button>
      </div>

      <span className="opportunity-category">
        {opportunity.category}
      </span>

      <h3>{opportunity.title}</h3>

      <p className="organization">
        {opportunity.organization}
      </p>

      <p className="opportunity-description">
        {opportunity.description}
      </p>

      <div className="opportunity-info">
        <span>📍 {opportunity.location}</span>
        <span>⏰ {opportunity.deadline}</span>
      </div>

      <button className="view-btn">
        View Opportunity →
      </button>

    </article>
  );
}

export default OpportunityCard;
