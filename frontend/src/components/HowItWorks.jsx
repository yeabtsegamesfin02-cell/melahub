const steps = [
  {
    number: "01",
    icon: "🔎",
    title: "Discover",
    description:
      "Search through jobs, services, businesses, education and other opportunities.",
  },
  {
    number: "02",
    icon: "🎯",
    title: "Choose",
    description:
      "Compare opportunities and choose the one that best matches your needs.",
  },
  {
    number: "03",
    icon: "🤝",
    title: "Connect",
    description:
      "Connect directly with people and businesses and take the next step.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="section-container">

        <div className="section-heading">
          <span>HOW MELAHUB WORKS</span>

          <h2>
            Simple. Fast. Connected.
          </h2>

          <p>
            Finding the right opportunity shouldn't be complicated.
            MelaHub makes the process simple.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>

              <div className="step-number">
                {step.number}
              </div>

              <div className="step-icon">
                {step.icon}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;