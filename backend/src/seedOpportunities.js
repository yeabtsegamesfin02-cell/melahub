require("dotenv").config();

const mongoose = require("mongoose");
const Opportunity = require("./models/Opportunity");

const opportunities = [
  {
    title: "Frontend Developer",
    description:
      "Build modern web interfaces using React and JavaScript.",
    category: "Jobs & Careers",
    location: "Addis Ababa",
    skills: ["JavaScript", "React", "HTML", "CSS"],
    interests: ["technology", "programming", "jobs"],
    organization: "MelaTech",
    deadline: new Date("2026-09-30"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Graphic Design Service",
    description:
      "Freelance graphic design opportunity for creative professionals.",
    category: "Local Services",
    location: "Addis Ababa",
    skills: ["Design", "Photoshop", "Canva"],
    interests: ["design", "creative", "freelance"],
    organization: "MelaHub Services",
    deadline: new Date("2026-10-15"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "University Scholarship",
    description:
      "Scholarship opportunity for Ethiopian students.",
    category: "Scholarships",
    location: "Nationwide / Ethiopia",
    skills: ["Education", "Academic Achievement"],
    interests: ["education", "scholarships", "students"],
    organization: "Ethiopian Education Program",
    deadline: new Date("2026-10-10"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Digital Skills Training",
    description:
      "Improve your computer and digital skills through online training.",
    category: "Training & Courses",
    location: "Online / Ethiopia",
    skills: [
      "Computer Skills",
      "Technology",
      "Digital Literacy",
    ],
    interests: [
      "technology",
      "training",
      "education",
    ],
    organization: "Digital Ethiopia",
    deadline: new Date("2026-11-01"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Small Business Startup Grant",
    description:
      "Funding opportunity for Ethiopian entrepreneurs and small businesses.",
    category: "Grants & Funding",
    location: "Ethiopia",
    skills: [
      "Business",
      "Entrepreneurship",
      "Innovation",
    ],
    interests: [
      "business",
      "startup",
      "entrepreneurship",
    ],
    organization: "MelaHub Enterprise",
    deadline: new Date("2026-10-25"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Agriculture Innovation Program",
    description:
      "Opportunity supporting modern farming and agricultural innovation.",
    category: "Agriculture & Farming",
    location: "Nationwide / Ethiopia",
    skills: [
      "Agriculture",
      "Farming",
      "Innovation",
    ],
    interests: [
      "agriculture",
      "farming",
      "business",
    ],
    organization: "Ethiopia Agriculture Initiative",
    deadline: new Date("2026-11-15"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Software Engineering Internship",
    description:
      "Internship for students interested in software development.",
    category: "Internships",
    location: "Addis Ababa",
    skills: [
      "JavaScript",
      "Programming",
      "Git",
    ],
    interests: [
      "technology",
      "programming",
      "internships",
    ],
    organization: "Ethio Digital",
    deadline: new Date("2026-10-05"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Community Volunteer Program",
    description:
      "Volunteer opportunity supporting communities across Ethiopia.",
    category: "Volunteering & NGOs",
    location: "Nationwide / Ethiopia",
    skills: [
      "Communication",
      "Teamwork",
      "Community Service",
    ],
    interests: [
      "volunteering",
      "community",
      "social impact",
    ],
    organization: "MelaHub Community",
    deadline: new Date("2026-12-01"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Women in Digital Business Fellowship",
    description:
      "A practical fellowship helping Ethiopian women grow digital businesses through mentorship, training, and peer support.",
    category: "Fellowships",
    location: "Addis Ababa / Online",
    skills: ["Digital Marketing", "Business", "Communication"],
    interests: ["women", "business", "technology"],
    organization: "SheTech Ethiopia",
    deadline: new Date("2026-12-10"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Rural Health Outreach Assistant",
    description:
      "Support mobile health teams with community education, registration, and local outreach in underserved areas.",
    category: "Jobs & Careers",
    location: "Oromia / Amhara / SNNPR",
    skills: ["Community Outreach", "Amharic", "Teamwork"],
    interests: ["health", "community", "social impact"],
    organization: "HealthBridge Ethiopia",
    deadline: new Date("2026-10-20"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Youth Climate Action Microgrant",
    description:
      "Small grants for youth-led projects focused on clean energy, recycling, water protection, and climate resilience.",
    category: "Grants & Funding",
    location: "Nationwide / Ethiopia",
    skills: ["Project Planning", "Environment", "Leadership"],
    interests: ["climate", "youth", "innovation"],
    organization: "Green Future Ethiopia",
    deadline: new Date("2026-11-20"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Smallholder Farmer Market Linkage Program",
    description:
      "Connect smallholder farmers with training, buyers, and better market information for stronger local livelihoods.",
    category: "Agriculture & Farming",
    location: "Tigray / Oromia / Somali",
    skills: ["Agriculture", "Cooperatives", "Market Research"],
    interests: ["farming", "food systems", "business"],
    organization: "Ethiopian Farmers Network",
    deadline: new Date("2026-12-05"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Creative Storytelling Lab",
    description:
      "Learn photography, video, and digital storytelling while creating stories that celebrate communities across Ethiopia.",
    category: "Training & Courses",
    location: "Dire Dawa / Online",
    skills: ["Photography", "Video", "Storytelling"],
    interests: ["creative", "media", "culture"],
    organization: "Addis Creative House",
    deadline: new Date("2026-10-30"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "TVET Skills Apprenticeship Placement",
    description:
      "Paid apprenticeship placements for young people trained in construction, electrical work, mechanics, and manufacturing.",
    category: "Internships",
    location: "Bahir Dar / Hawassa / Mekelle",
    skills: ["Technical Skills", "Problem Solving", "Safety"],
    interests: ["trades", "manufacturing", "employment"],
    organization: "Ethiopia Skills Network",
    deadline: new Date("2026-11-12"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Accessible Learning Support Fund",
    description:
      "Education support for Ethiopian learners with disabilities, including assistive materials, transport, and digital access.",
    category: "Scholarships",
    location: "Nationwide / Ethiopia",
    skills: ["Education", "Accessibility", "Academic Achievement"],
    interests: ["students", "disability inclusion", "education"],
    organization: "Inclusive Ethiopia Foundation",
    deadline: new Date("2026-12-15"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Local Language Digital Literacy Tour",
    description:
      "Join a traveling team that teaches practical digital skills in Amharic, Afaan Oromo, Tigrinya, and Somali.",
    category: "Volunteering & NGOs",
    location: "Regional cities / Ethiopia",
    skills: ["Digital Literacy", "Training", "Local Languages"],
    interests: ["technology", "volunteering", "education"],
    organization: "Connected Ethiopia",
    deadline: new Date("2026-11-28"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Women Farmers Cooperative Accelerator",
    description:
      "Training, market access, and business support for women-led farming cooperatives and food producers.",
    category: "Agriculture & Farming",
    location: "Nationwide / Ethiopia",
    skills: ["Agriculture", "Cooperatives", "Business Planning"],
    interests: ["women", "farming", "livelihoods"],
    organization: "Ethiopian Food Systems Lab",
    deadline: new Date("2027-01-15"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Youth Civic Innovation Challenge",
    description:
      "Build practical solutions for public services, local communities, and inclusive participation with mentorship and prizes.",
    category: "Competitions",
    location: "Online / Ethiopia",
    skills: ["Problem Solving", "Research", "Presentation"],
    interests: ["youth", "civic technology", "innovation"],
    organization: "MelaHub Civic Lab",
    deadline: new Date("2027-01-25"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Clean Energy Technician Training",
    description:
      "Hands-on training for young people interested in solar installation, maintenance, and clean energy entrepreneurship.",
    category: "Training & Courses",
    location: "Hawassa / Bahir Dar / Online",
    skills: ["Solar Energy", "Electrical Work", "Entrepreneurship"],
    interests: ["clean energy", "technical skills", "employment"],
    organization: "Bright Ethiopia Initiative",
    deadline: new Date("2027-02-05"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Ethiopian Language Content Fellowship",
    description:
      "Create useful digital content in Amharic, Afaan Oromo, Tigrinya, Somali, and other Ethiopian languages.",
    category: "Fellowships",
    location: "Remote / Ethiopia",
    skills: ["Writing", "Translation", "Digital Media"],
    interests: ["languages", "culture", "media"],
    organization: "Open Knowledge Ethiopia",
    deadline: new Date("2027-01-30"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Small Business Digital Marketplace",
    description:
      "Help local makers, retailers, and service providers reach customers through digital storefronts and business coaching.",
    category: "Local Services",
    location: "Addis Ababa / Dire Dawa / Ethiopia",
    skills: ["Sales", "Digital Marketing", "Customer Service"],
    interests: ["small business", "retail", "entrepreneurship"],
    organization: "MelaHub Enterprise",
    deadline: new Date("2027-02-15"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Inclusive Sports Leadership Program",
    description:
      "Develop leadership and coaching skills while creating safer sports opportunities for girls and young people with disabilities.",
    category: "Volunteering & NGOs",
    location: "Nationwide / Ethiopia",
    skills: ["Leadership", "Coaching", "Inclusion"],
    interests: ["sports", "girls", "disability inclusion"],
    organization: "Play For Every Ethiopian",
    deadline: new Date("2027-02-20"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Regional Public Health Data Fellowship",
    description:
      "Support public health teams by collecting, cleaning, and explaining community health data for better local decisions.",
    category: "Fellowships",
    location: "Addis Ababa / Regional bureaus",
    skills: ["Data Analysis", "Excel", "Public Health"],
    interests: ["health", "data", "research"],
    organization: "Ethiopia Health Data Initiative",
    deadline: new Date("2027-03-01"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Construction Skills Apprenticeship",
    description:
      "Paid practical experience for young people learning masonry, plumbing, carpentry, and site safety.",
    category: "Internships",
    location: "Addis Ababa / Hawassa / Adama",
    skills: ["Construction", "Carpentry", "Safety"],
    interests: ["trades", "construction", "employment"],
    organization: "Build Ethiopia Network",
    deadline: new Date("2027-02-28"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Ethiopian Creators Equipment Grant",
    description:
      "Small grants and mentorship for filmmakers, photographers, podcasters, and digital artists creating local stories.",
    category: "Grants & Funding",
    location: "Nationwide / Ethiopia",
    skills: ["Film", "Photography", "Digital Production"],
    interests: ["creative", "culture", "media"],
    organization: "Creative Ethiopia Fund",
    deadline: new Date("2027-03-15"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Last-Mile Delivery Coordinator",
    description:
      "Coordinate local delivery routes and customer support for growing businesses serving cities and nearby communities.",
    category: "Jobs & Careers",
    location: "Addis Ababa / Adama / Dire Dawa",
    skills: ["Logistics", "Customer Service", "Organization"],
    interests: ["transport", "business", "operations"],
    organization: "EthioLink Logistics",
    deadline: new Date("2027-02-25"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Rural Women Financial Literacy Training",
    description:
      "Facilitate practical sessions on saving, budgeting, mobile money, and small business planning for women in rural communities.",
    category: "Volunteering & NGOs",
    location: "Amhara / Oromia / Sidama",
    skills: ["Training", "Financial Literacy", "Community Outreach"],
    interests: ["women", "finance", "community"],
    organization: "Women Thrive Ethiopia",
    deadline: new Date("2027-03-05"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Remote Customer Support Associate",
    description:
      "Join a remote customer care team supporting Ethiopian and international users through chat, email, and phone.",
    category: "Jobs & Careers",
    location: "Remote / Ethiopia",
    skills: ["English", "Customer Support", "Computer Skills"],
    interests: ["remote work", "communication", "technology"],
    organization: "Nile Connect",
    deadline: new Date("2027-02-18"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Girls in STEM Scholarship",
    description:
      "Scholarships, mentorship, and learning materials for Ethiopian girls studying science, technology, engineering, or mathematics.",
    category: "Scholarships",
    location: "Nationwide / Ethiopia",
    skills: ["STEM", "Academic Achievement", "Leadership"],
    interests: ["girls", "education", "technology"],
    organization: "Ethiopian Women in Technology",
    deadline: new Date("2027-03-20"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Water Systems Maintenance Training",
    description:
      "Learn how to inspect, repair, and maintain community water systems while working with local technicians.",
    category: "Training & Courses",
    location: "Tigray / Afar / Somali",
    skills: ["Water Systems", "Maintenance", "Technical Skills"],
    interests: ["water", "engineering", "community"],
    organization: "WaterWorks Ethiopia",
    deadline: new Date("2027-03-10"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Ethiopian Food Processing Startup Challenge",
    description:
      "Pitch practical food processing and packaging ideas for local farmers and receive business coaching and seed support.",
    category: "Competitions",
    location: "Bahir Dar / Online",
    skills: ["Food Processing", "Business", "Pitching"],
    interests: ["agriculture", "food", "startups"],
    organization: "AgriValue Ethiopia",
    deadline: new Date("2027-03-25"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Sign Language Digital Access Project",
    description:
      "Help create accessible digital learning materials and community information resources for Deaf Ethiopians.",
    category: "Projects",
    location: "Addis Ababa / Remote",
    skills: ["Sign Language", "Content Creation", "Accessibility"],
    interests: ["disability inclusion", "education", "technology"],
    organization: "Access Ethiopia Lab",
    deadline: new Date("2027-03-18"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Community Tourism Guide Program",
    description:
      "Train local young people to guide visitors, protect cultural heritage, and build responsible tourism businesses.",
    category: "Training & Courses",
    location: "Lalibela / Harar / Arba Minch",
    skills: ["Tourism", "Languages", "Storytelling"],
    interests: ["culture", "tourism", "youth employment"],
    organization: "Heritage Routes Ethiopia",
    deadline: new Date("2027-03-08"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Urban Gardening Community Grant",
    description:
      "Support neighborhood gardens that improve food access, create green spaces, and generate income for local residents.",
    category: "Grants & Funding",
    location: "Addis Ababa / Hawassa / Mekelle",
    skills: ["Urban Farming", "Project Planning", "Community Work"],
    interests: ["food security", "environment", "community"],
    organization: "Green Cities Ethiopia",
    deadline: new Date("2027-03-12"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Sales Representative",
    description:
      "Join a growing sales team helping customers discover useful products and services across local communities.",
    category: "Jobs & Careers",
    location: "Addis Ababa / Adama",
    skills: ["Sales", "Communication", "Customer Service"],
    interests: ["sales", "business", "customer service"],
    organization: "Habesha Market Group",
    deadline: new Date("2027-03-30"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Nurse Assistant",
    description:
      "Support nurses and patients with daily care, records, and compassionate service in a community health facility.",
    category: "Jobs & Careers",
    location: "Bahir Dar / Gondar",
    skills: ["Patient Care", "Teamwork", "Health Support"],
    interests: ["healthcare", "nursing", "community"],
    organization: "Blue Nile Community Clinic",
    deadline: new Date("2027-03-28"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Hotel Front Desk Officer",
    description:
      "Welcome guests, manage reservations, and provide professional customer service in a busy hospitality team.",
    category: "Jobs & Careers",
    location: "Addis Ababa / Lalibela",
    skills: ["Customer Service", "English", "Computer Skills"],
    interests: ["hospitality", "tourism", "communication"],
    organization: "Highland Hospitality Group",
    deadline: new Date("2027-04-05"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Motorcycle Delivery Driver",
    description:
      "Deliver meals, documents, and packages safely while serving customers in a fast-moving city operation.",
    category: "Jobs & Careers",
    location: "Addis Ababa",
    skills: ["Driving License", "Navigation", "Time Management"],
    interests: ["delivery", "transport", "logistics"],
    organization: "Swift Addis Delivery",
    deadline: new Date("2027-04-01"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Solar Installation Technician",
    description:
      "Install and maintain small solar power systems for homes, shops, schools, and community facilities.",
    category: "Jobs & Careers",
    location: "Nationwide / Ethiopia",
    skills: ["Solar Installation", "Electrical Work", "Maintenance"],
    interests: ["clean energy", "engineering", "technical work"],
    organization: "Sunrise Energy Ethiopia",
    deadline: new Date("2027-04-10"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Bookkeeper and Office Assistant",
    description:
      "Support a small business with invoices, records, scheduling, and daily office administration.",
    category: "Jobs & Careers",
    location: "Hawassa / Addis Ababa",
    skills: ["Bookkeeping", "Excel", "Administration"],
    interests: ["finance", "office work", "small business"],
    organization: "Rift Valley Enterprise",
    deadline: new Date("2027-04-08"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Primary School Teacher",
    description:
      "Teach foundational subjects, support children’s development, and work with families in a welcoming school community.",
    category: "Jobs & Careers",
    location: "Jimma / Nekemte / Ethiopia",
    skills: ["Teaching", "Lesson Planning", "Child Development"],
    interests: ["education", "children", "community"],
    organization: "Bright Futures Schools",
    deadline: new Date("2027-04-15"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Agricultural Extension Assistant",
    description:
      "Help farmers adopt improved practices, record field data, and connect cooperatives with agricultural support.",
    category: "Jobs & Careers",
    location: "Oromia / Amhara / Tigray",
    skills: ["Agriculture", "Field Work", "Communication"],
    interests: ["farming", "food security", "rural development"],
    organization: "Harvest Ethiopia",
    deadline: new Date("2027-04-12"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Graphic Designer and Social Media Officer",
    description:
      "Create visual content and manage social media campaigns for an Ethiopian youth-focused organization.",
    category: "Jobs & Careers",
    location: "Remote / Addis Ababa",
    skills: ["Graphic Design", "Canva", "Social Media"],
    interests: ["design", "marketing", "creative work"],
    organization: "Impact Hub Ethiopia",
    deadline: new Date("2027-04-03"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Plumber and Building Maintenance Worker",
    description:
      "Handle plumbing repairs, inspections, and basic building maintenance for homes and business facilities.",
    category: "Jobs & Careers",
    location: "Dire Dawa / Harar",
    skills: ["Plumbing", "Repair", "Building Maintenance"],
    interests: ["trades", "construction", "maintenance"],
    organization: "Eastern Facilities Services",
    deadline: new Date("2027-04-18"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Women-Led Microbusiness Manager",
    description:
      "Manage daily operations, suppliers, and customer relationships for a women-owned retail and production business.",
    category: "Jobs & Careers",
    location: "Mekelle / Online",
    skills: ["Business Management", "Inventory", "Leadership"],
    interests: ["women", "entrepreneurship", "retail"],
    organization: "Mekelle Makers Cooperative",
    deadline: new Date("2027-04-20"),
    applicationUrl: "",
    isActive: true,
  },

  {
    title: "Remote Data Entry Assistant",
    description:
      "Accurately enter and organize business records while working remotely with a supportive operations team.",
    category: "Jobs & Careers",
    location: "Remote / Ethiopia",
    skills: ["Typing", "Excel", "Attention to Detail"],
    interests: ["remote work", "office work", "technology"],
    organization: "Digital Work Ethiopia",
    deadline: new Date("2027-04-25"),
    applicationUrl: "",
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("🍃 MongoDB connected");

    await Opportunity.deleteMany({});

    await Opportunity.insertMany(
      opportunities
    );

    console.log(
      `✅ ${opportunities.length} opportunities added to MongoDB`
    );

    await mongoose.disconnect();

    console.log("🔌 MongoDB disconnected");

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Seed failed:",
      error.message
    );

    process.exit(1);
  }
};

seedDatabase();