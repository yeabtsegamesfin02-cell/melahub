// =====================================
// MELAHUB SMART MATCHING ENGINE 🧠🇪🇹
// =====================================

const normalize = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim();
};

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalize).filter(Boolean);
  }

  return [];
};

const calculateMatchingScore = (profile, opportunity) => {
  const profileSkills = toArray(profile.skills);
  const profileInterests = toArray(profile.interests);

  const opportunitySkills = toArray(opportunity.skills);
  const opportunityInterests = toArray(
    opportunity.interests
  );

  let score = 0;

  // =====================================
  // 1. SKILLS — 45%
  // =====================================

  const matchedSkills = profileSkills.filter((skill) =>
    opportunitySkills.some(
      (requiredSkill) =>
        requiredSkill.includes(skill) ||
        skill.includes(requiredSkill)
    )
  );

  const skillScore =
    opportunitySkills.length > 0
      ? (matchedSkills.length / opportunitySkills.length) * 45
      : 0;

  score += skillScore;

  // =====================================
  // 2. INTERESTS — 20%
  // =====================================

  const matchedInterests = profileInterests.filter(
    (interest) =>
      opportunityInterests.some(
        (opportunityInterest) =>
          opportunityInterest.includes(interest) ||
          interest.includes(opportunityInterest)
      )
  );

  const interestScore =
    opportunityInterests.length > 0
      ? (matchedInterests.length /
          opportunityInterests.length) *
        20
      : 0;

  score += interestScore;

  // =====================================
  // 3. FIELD / PROFESSION — 15%
  // =====================================

  const profileField = normalize(profile.field);
  const opportunityCategory = normalize(
    opportunity.category
  );

  let fieldScore = 0;

  if (
    profileField &&
    opportunityCategory &&
    (profileField.includes(opportunityCategory) ||
      opportunityCategory.includes(profileField))
  ) {
    fieldScore = 15;
  }

  score += fieldScore;

  // =====================================
  // 4. LOCATION — 10%
  // =====================================

  const profileLocation = normalize(profile.location);
  const opportunityLocation = normalize(
    opportunity.location
  );

  let locationScore = 0;

  if (
    opportunityLocation.includes("remote") ||
    opportunityLocation.includes("nationwide") ||
    opportunityLocation.includes("ethiopia")
  ) {
    locationScore = 10;
  } else if (
    profileLocation &&
    opportunityLocation.includes(profileLocation)
  ) {
    locationScore = 10;
  }

  score += locationScore;

  // =====================================
  // 5. EXPERIENCE — 10%
  // =====================================

  const experience = normalize(profile.experience);

  let experienceScore = 0;

  if (
    experience.includes("student") ||
    experience.includes("entry")
  ) {
    experienceScore = 10;
  } else if (experience) {
    experienceScore = 5;
  }

  score += experienceScore;

  // =====================================
  // FINAL SCORE
  // =====================================

  const finalScore = Math.min(
    100,
    Math.round(score)
  );

  return {
    score: finalScore,

    breakdown: {
      skills: Math.round(skillScore),
      interests: Math.round(interestScore),
      field: fieldScore,
      location: locationScore,
      experience: experienceScore,
    },

    matchedSkills,
    matchedInterests,
  };
};

module.exports = {
  calculateMatchingScore,
};