// Static mock data for StepUp for AI dashboard

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  skills: string;
  resume: string;
  appliedCount?: number;
}

export interface Webinar {
  id: number;
  name: string;
  posterBanner: string;
  overview: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  startTime: string;
  endTime: string;
  mode: string;
  venue: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface Hackathon {
  id: number;
  name: string;
  conductedBy: string;
  orgLogo: string;
  posterBanner: string;
  description: string;
  participation: string;
  minTeamSize: number | null;
  maxTeamSize: number | null;
  startDate: string;
  endDate: string;
  timezone: string;
  startTime: string;
  endTime: string;
  mode: string;
  venue: string;
  certificateAvailable: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface PitchEvent {
  id: number;
  name: string;
  posterBanner: string;
  overview: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  startTime: string;
  endTime: string;
  mode: string;
  venue: string;
  ticketName: string;
  ticketPrice: number;
  ticketDescription: string;
  saleStartDate: string;
  saleEndDate: string;
  saleStartTime: string;
  saleEndTime: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface StartupApplication {
  id: number;
  startupName: string;
  founderName: string;
  email: string;
  phone: string;
  industry: string;
  stage: string;
  fundingRequired: string;
  oneLiner: string;
  problemStatement: string;
  solution: string;
  teamMembers: number;
  status: "Pending" | "Approved" | "Rejected";
  appliedDate: string;
  pitchDeck?: string;
}

export interface Recruiter {
  id: string;
  name: string;
  company: string;
  designation: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface Investor {
  id: string;
  name: string;
  organization: string;
  designation: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: "Approved" | "Pending" | "Rejected";
  bio: string;
  interests: string[];
}

export interface Internship {
  id: number;
  title: string;
  company: string;
  recruiterName: string;
  description: string;
  skillsRequired: string;
  location: string;
  duration: string;
  stipend: string;
  postedDate: string;
  deadline: string;
  status: "Active" | "Closed" | "Draft";
}

export interface StartupInterest {
  id: string;
  investorId: string;
  investorName: string;
  startupId: number;
  startupName: string;
  startupIndustry: string;
  startupStage: string;
  interestDate: string;
  status: "Interested" | "Contacted" | "Meeting Scheduled" | "Declined";
}

export interface ContactRequest {
  id: string;
  startupId: number;
  startupName: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  investorId: string;
  investorName: string;
  requestDate: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
}

// ----------------------------------------------------
// 1. Students (including mock application counts)
// ----------------------------------------------------
export const mockStudents: Student[] = [
  { id: "STU001", name: "Rahul Sharma", email: "rahul.sharma.1@stepup.ai", phone: "9876500001", college: "IIT Madras", branch: "Computer Science", year: "3", skills: "React, Node.js, JavaScript, Python, Git", resume: "https://stepup.ai/portfolios/resumes/resume_student_1.pdf", appliedCount: 3 },
  { id: "STU002", name: "Priya Verma", email: "priya.verma.2@stepup.ai", phone: "9876500002", college: "BITS Pilani", branch: "Information Technology", year: "4", skills: "Python, PyTorch, SQL, Machine Learning, Docker", resume: "https://stepup.ai/portfolios/resumes/resume_student_2.pdf", appliedCount: 5 },
  { id: "STU003", name: "Amit Singh", email: "amit.singh.3@stepup.ai", phone: "9876500003", college: "PES University", branch: "Electronics & Communication", year: "2", skills: "UI/UX Design, Figma, HTML, CSS, Wireframing", resume: "https://stepup.ai/portfolios/resumes/resume_student_3.pdf", appliedCount: 2 },
  { id: "STU004", name: "Sneha Kapoor", email: "sneha.kapoor.4@stepup.ai", phone: "9876500004", college: "RV College of Eng", branch: "Computer Science", year: "3", skills: "Java, Spring Boot, MySQL, REST APIs, Git", resume: "https://stepup.ai/portfolios/resumes/resume_student_4.pdf", appliedCount: 4 },
  { id: "STU005", name: "Rohan Mehta", email: "rohan.mehta.5@stepup.ai", phone: "9876500005", college: "IIT Bombay", branch: "Computer Science", year: "4", skills: "React, Node.js, JavaScript, Python, Git", resume: "https://stepup.ai/portfolios/resumes/resume_student_5.pdf", appliedCount: 6 },
  { id: "STU006", name: "Anjali Sen", email: "anjali.sen.6@stepup.ai", phone: "9876500006", college: "IIT Delhi", branch: "Information Technology", year: "3", skills: "Python, PyTorch, SQL, Machine Learning, Docker", resume: "https://stepup.ai/portfolios/resumes/resume_student_6.pdf", appliedCount: 1 },
  { id: "STU007", name: "Karan Gupta", email: "karan.gupta.7@stepup.ai", phone: "9876500007", college: "NIT Trichy", branch: "Mechanical Engineering", year: "3", skills: "Product Management, Agile, Jira, SEO, SQL", resume: "https://stepup.ai/portfolios/resumes/resume_student_7.pdf", appliedCount: 2 },
  { id: "STU008", name: "Neha Iyer", email: "neha.iyer.8@stepup.ai", phone: "9876500008", college: "DTU", branch: "Electronics & Communication", year: "4", skills: "Figma, HTML, CSS, JavaScript", resume: "https://stepup.ai/portfolios/resumes/resume_student_8.pdf", appliedCount: 3 },
  { id: "STU009", name: "Vijay Rao", email: "vijay.rao.9@stepup.ai", phone: "9876500009", college: "VIT Vellore", branch: "Computer Science", year: "3", skills: "Node.js, Express, MongoDB, REST APIs", resume: "https://stepup.ai/portfolios/resumes/resume_student_9.pdf", appliedCount: 0 },
  { id: "STU010", name: "Pooja Joshi", email: "pooja.joshi.10@stepup.ai", phone: "9876500010", college: "SRM University", branch: "Computer Science", year: "2", skills: "Java, Spring Boot, MySQL", resume: "https://stepup.ai/portfolios/resumes/resume_student_10.pdf", appliedCount: 1 },
];

// ----------------------------------------------------
// 2. Webinars
// ----------------------------------------------------
export const mockWebinars: Webinar[] = [
  {
    id: 2001,
    name: "AI Startup Funding Pathways",
    posterBanner: "",
    overview: "Master class on AI Startup Funding",
    description: "Join this expert session to master raising seed capital for AI-driven ventures. We cover valuations, pitch preparation, term sheets, and investor relations.",
    startDate: "2026-06-25",
    endDate: "2026-06-25",
    timezone: "UTC+5:30",
    startTime: "10:00",
    endTime: "12:00",
    mode: "Online",
    venue: "Zoom Video Link",
    contactName: "Speaker 1 Admin",
    contactPhone: "9876543211",
    contactEmail: "webinar1@stepup.ai",
  },
  {
    id: 2002,
    name: "NLP and LLM Architectures Bootcamp",
    posterBanner: "",
    overview: "Deep dive into Transformers and LLMs",
    description: "Hands-on engineering bootcamp introducing model fine-tuning, retrieval-augmented generation (RAG), and deploying open-source models.",
    startDate: "2026-06-28",
    endDate: "2026-06-28",
    timezone: "UTC+5:30",
    startTime: "14:00",
    endTime: "17:00",
    mode: "Online",
    venue: "Zoom Video Link",
    contactName: "Speaker 2 Admin",
    contactPhone: "9876543212",
    contactEmail: "webinar2@stepup.ai",
  },
  {
    id: 2003,
    name: "Generative Designs for Web Interfaces",
    posterBanner: "",
    overview: "UI/UX meets AI generators",
    description: "Explore the cutting-edge intersections of artificial intelligence and digital UI layout, leveraging midjourney and custom code components.",
    startDate: "2026-07-02",
    endDate: "2026-07-02",
    timezone: "UTC+5:30",
    startTime: "11:00",
    endTime: "13:00",
    mode: "Offline",
    venue: "StepUp Seminar Hall Room 302",
    contactName: "Speaker 3 Admin",
    contactPhone: "9876543213",
    contactEmail: "webinar3@stepup.ai",
  },
];

// ----------------------------------------------------
// 3. Hackathons
// ----------------------------------------------------
export const mockHackathons: Hackathon[] = [
  {
    id: 3001,
    name: "IncubateX Global AI Hackathon",
    conductedBy: "StepUp Incubations",
    orgLogo: "",
    posterBanner: "",
    description: "Assemble your teams and build state-of-the-art AI applications for modern agricultural efficiency. Win cash prizes, certificates, and VC incubation slots.",
    participation: "Team",
    minTeamSize: 2,
    maxTeamSize: 4,
    startDate: "2026-07-05",
    endDate: "2026-07-07",
    timezone: "UTC+5:30",
    startTime: "09:00",
    endTime: "18:00",
    mode: "Offline",
    venue: "StepUp Tech Campus, Bangalore",
    certificateAvailable: "Yes",
    contactName: "Coordinator 1",
    contactPhone: "9876543311",
    contactEmail: "hackathon1@stepup.ai",
  },
  {
    id: 3002,
    name: "Solo DevCraft: LLM Challenge",
    conductedBy: "AI Dev Community",
    orgLogo: "",
    posterBanner: "",
    description: "A fast-paced solo hackathon testing your speed-building capacities using pre-trained API layers. Create a complete working agent prototype in 24 hours.",
    participation: "Solo",
    minTeamSize: null,
    maxTeamSize: null,
    startDate: "2026-07-15",
    endDate: "2026-07-16",
    timezone: "UTC+5:30",
    startTime: "09:00",
    endTime: "09:00",
    mode: "Online",
    venue: "Discord & GitHub Classroom",
    certificateAvailable: "Yes",
    contactName: "Coordinator 2",
    contactPhone: "9876543312",
    contactEmail: "hackathon2@stepup.ai",
  },
];

// ----------------------------------------------------
// 4. Pitch Events
// ----------------------------------------------------
export const mockPitchEvents: PitchEvent[] = [
  {
    id: 4001,
    name: "Venture Capital Pitch Night",
    posterBanner: "",
    overview: "Key investor pitch session showcasing AI innovators.",
    description: "Present your startup pitch deck directly to institutional VCs and prominent angel syndicates. 5-minute pitches followed by Q&A.",
    startDate: "2026-07-10",
    endDate: "2026-07-10",
    timezone: "UTC+5:30",
    startTime: "18:00",
    endTime: "21:00",
    mode: "Offline",
    venue: "ITC Gardenia Grand Ballroom, Bangalore",
    ticketName: "Founder Pass",
    ticketPrice: 500,
    ticketDescription: "Access to presentations and networking database",
    saleStartDate: "2026-06-15",
    saleEndDate: "2026-07-09",
    saleStartTime: "09:00",
    saleEndTime: "18:00",
    contactName: "Incubator Lead 1",
    contactPhone: "9876543411",
    contactEmail: "pitches1@stepup.ai",
  },
  {
    id: 4002,
    name: "Angel Investors AI Showcase",
    posterBanner: "",
    overview: "Early stage AI startup pitches.",
    description: "Exclusive showcase for angel syndicates seeking pre-seed and seed rounds in SaaS, Robotics, and Diagnostics tech.",
    startDate: "2026-07-22",
    endDate: "2026-07-22",
    timezone: "UTC+5:30",
    startTime: "17:00",
    endTime: "20:00",
    mode: "Online",
    venue: "Zoom VC Webinar Room",
    ticketName: "VIP Pitch Pass",
    ticketPrice: 1500,
    ticketDescription: "Live stream access and pitch feedback documents",
    saleStartDate: "2026-06-20",
    saleEndDate: "2026-07-21",
    saleStartTime: "09:00",
    saleEndTime: "18:00",
    contactName: "Incubator Lead 2",
    contactPhone: "9876543412",
    contactEmail: "pitches2@stepup.ai",
  },
];

// ----------------------------------------------------
// 5. Startup Applications (featuring Pitch Deck link placeholder)
// ----------------------------------------------------
export const mockStartupApplications: StartupApplication[] = [
  {
    id: 5001,
    startupName: "VisionSmart",
    founderName: "Vijay Rao",
    email: "vijay@visionsmart.com",
    phone: "9876520001",
    industry: "Healthcare AI",
    stage: "Prototype/MVP",
    fundingRequired: "₹50,00,000",
    oneLiner: "AI-powered solution optimizing Healthcare diagnostics workflows.",
    problemStatement: "Current clinical scan review pipelines suffer from heavy backlogs and diagnostic delays.",
    solution: "Deploy a deep learning platform that reads MRI and CT scans in seconds to flag critical cases.",
    teamMembers: 4,
    status: "Pending",
    appliedDate: "2026-06-10",
    pitchDeck: "https://stepup.ai/pitchdecks/visionsmart_deck.pdf",
  },
  {
    id: 5002,
    startupName: "AgriWave",
    founderName: "Amit Singh",
    email: "amit@agriwave.com",
    phone: "9876520002",
    industry: "Agritech IoT",
    stage: "Early Traction",
    fundingRequired: "₹35,00,000",
    oneLiner: "Machine Learning predicting soil fertility and hydration levels.",
    problemStatement: "Farmers lack precise real-time guidance on fertilizer and irrigation schedules.",
    solution: "IoT sensors hooked to neural networks that calculate precise water and nutritional requirements.",
    teamMembers: 3,
    status: "Approved",
    appliedDate: "2026-06-12",
    pitchDeck: "https://stepup.ai/pitchdecks/agriwave_deck.pdf",
  },
  {
    id: 5003,
    startupName: "MediNet",
    founderName: "Pooja Joshi",
    email: "pooja@medinet.com",
    phone: "9876520003",
    industry: "Biotech Diagnostics",
    stage: "Idea Phase",
    fundingRequired: "₹20,00,000",
    oneLiner: "Genetic sequence analysis driven by deep network pipelines.",
    problemStatement: "Genomic sequence profiling is costly, manual, and takes weeks to compile.",
    solution: "An automated cloud sequence processor running pre-trained transformer arrays.",
    teamMembers: 2,
    status: "Pending",
    appliedDate: "2026-06-14",
    pitchDeck: "https://stepup.ai/pitchdecks/medinet_deck.pdf",
  },
  {
    id: 5004,
    startupName: "EduCore",
    founderName: "Sneha Kapoor",
    email: "sneha@educore.com",
    phone: "9876520004",
    industry: "EdTech AI",
    stage: "Scaling Phase",
    fundingRequired: "₹80,00,000",
    oneLiner: "Hyper-personalized curriculum recommendation engines.",
    problemStatement: "Mass-classroom curriculums neglect individual student learning gaps.",
    solution: "A reinforcement learning agent that profiles student speed and structures dynamic learning pathways.",
    teamMembers: 5,
    status: "Rejected",
    appliedDate: "2026-06-15",
    pitchDeck: "https://stepup.ai/pitchdecks/educore_deck.pdf",
  },
  {
    id: 5005,
    startupName: "FinLabs",
    founderName: "Rohan Mehta",
    email: "rohan@finlabs.com",
    phone: "9876520005",
    industry: "Fintech Blockchain",
    stage: "Prototype/MVP",
    fundingRequired: "₹65,00,000",
    oneLiner: "Smart contract risk analyzer powered by deep NLP.",
    problemStatement: "DeFi protocols are constantly exploited due to hidden flaws in solidity contracts.",
    solution: "An automated static analysis pipeline trained on historical hacks and code patterns.",
    teamMembers: 3,
    status: "Approved",
    appliedDate: "2026-06-18",
    pitchDeck: "https://stepup.ai/pitchdecks/finlabs_deck.pdf",
  },
];

// ----------------------------------------------------
// 6. Recruiters
// ----------------------------------------------------
export const mockRecruiters: Recruiter[] = [
  { id: "REC001", name: "Rahul Sharma", company: "TechNova Solutions", designation: "HR Manager", email: "rahul@technova.com", phone: "9876530001", appliedDate: "2026-06-01", status: "Approved" },
  { id: "REC002", name: "Priya Verma", company: "DataMind Analytics", designation: "Senior Recruiter", email: "priya@datamind.com", phone: "9876530002", appliedDate: "2026-06-03", status: "Approved" },
  { id: "REC003", name: "Amit Singh", company: "BrandWave Digital", designation: "Director of HR", email: "amit@brandwave.com", phone: "9876530003", appliedDate: "2026-06-05", status: "Pending" },
  { id: "REC004", name: "Sneha Kapoor", company: "CodeWave Technologies", designation: "HR Manager", email: "sneha@codewave.com", phone: "9876530004", appliedDate: "2026-06-06", status: "Pending" },
  { id: "REC005", name: "Rohan Sen", company: "MindEdge Consulting", designation: "VP Talent", email: "rohan@mindedge.com", phone: "9876530005", appliedDate: "2026-06-08", status: "Rejected" },
];

// ----------------------------------------------------
// 7. Investors (Only display Approved investors inside Investor modules)
// ----------------------------------------------------
export const mockInvestors: Investor[] = [
  {
    id: "INV001",
    name: "Karan Gupta",
    organization: "Peak Fund Partners",
    designation: "Managing Partner",
    email: "karan@peakfund.com",
    phone: "9876540001",
    appliedDate: "2026-06-01",
    status: "Approved",
    bio: "Early-stage tech investor specializing in AI, SaaS, and DeepTech.",
    interests: ["Healthcare AI", "Biotech Diagnostics", "Fintech Blockchain"],
  },
  {
    id: "INV002",
    name: "Neha Iyer",
    organization: "Sequoia India Hub",
    designation: "Investment Director",
    email: "neha@sequoiahub.com",
    phone: "9876540002",
    appliedDate: "2026-06-03",
    status: "Approved",
    bio: "Venture capitalist with 10+ years of experience funding enterprise blockchain and fintech innovations.",
    interests: ["Fintech Blockchain", "Cybersecurity AI"],
  },
  {
    id: "INV003",
    name: "Vijay Rao",
    organization: "Matrix AI Fund",
    designation: "VC Associate",
    email: "vijay@matrixaifund.com",
    phone: "9876540003",
    appliedDate: "2026-06-05",
    status: "Approved",
    bio: "Venture partner focusing on consumer tech, healthtech, and AI-enabled diagnostics solutions.",
    interests: ["EdTech AI", "Logistics MLOps"],
  },
  {
    id: "INV004",
    name: "Arjun Sen",
    organization: "Kalaari Angel Network",
    designation: "Managing Partner",
    email: "arjun@kalaariangel.com",
    phone: "9876540004",
    appliedDate: "2026-06-07",
    status: "Pending",
    bio: "Angel investor passionate about green energy, smart cities, and sustainable agricultural technologies.",
    interests: ["Agritech IoT", "GreenTech Smart Grid"],
  },
  {
    id: "INV005",
    name: "Tanya Joshi",
    organization: "Nexus Venture Partners",
    designation: "Investment Director",
    email: "tanya@nexusvp.com",
    phone: "9876540005",
    appliedDate: "2026-06-09",
    status: "Rejected",
    bio: "Growth-stage VC associate looking for startups scaling rapidly in the South-Asian tech corridor.",
    interests: ["Healthcare AI", "EdTech AI"],
  },
];

// Helper to filter approved investors for display in Investor Management
export const approvedInvestors = mockInvestors.filter(inv => inv.status === "Approved");

// ----------------------------------------------------
// 8. Internships
// ----------------------------------------------------
export const mockInternships: Internship[] = [
  { id: 6001, title: "Frontend Developer Intern", company: "TechNova Solutions", recruiterName: "Rahul Sharma", description: "Excellent opportunity to work as a Frontend Developer Intern at TechNova. You will collaborate with cross-functional teams, contribute to active projects, and receive direct mentorship.", skillsRequired: "React, HTML5, CSS3, JavaScript", location: "Bangalore (Hybrid)", duration: "3 Months", stipend: "₹15,000 / month", postedDate: "2026-06-05", deadline: "2026-07-05", status: "Active" },
  { id: 6002, title: "Data Science Intern", company: "DataMind Analytics", recruiterName: "Priya Verma", description: "Learn real-world data science practices. You will compile training pipelines, clean features, and prepare visual dashboards for executive presentations.", skillsRequired: "Python, Pandas, SQL, Scikit-learn", location: "Remote", duration: "6 Months", stipend: "₹25,000 / month", postedDate: "2026-06-06", deadline: "2026-07-06", status: "Active" },
  { id: 6003, title: "UI/UX Design Intern", company: "BrandWave Digital", recruiterName: "Amit Singh", description: "Design beautiful web structures and mobile workflows. Help mock new visual components inside Figma.", skillsRequired: "Figma, Wireframing, User Research", location: "Mumbai (Office)", duration: "3 Months", stipend: "₹10,000 / month", postedDate: "2026-06-08", deadline: "2026-07-08", status: "Closed" },
  { id: 6004, title: "Backend Engineer Intern", company: "CodeWave Technologies", recruiterName: "Sneha Kapoor", description: "Contribute to scalable API design and database integrations.", skillsRequired: "Node.js, Express, MongoDB, REST APIs", location: "Remote", duration: "4 Months", stipend: "₹20,000 / month", postedDate: "2026-06-10", deadline: "2026-07-10", status: "Draft" },
];

// ----------------------------------------------------
// 9. Startup Interests (Links APPROVED investors and startups)
// ----------------------------------------------------
export const mockStartupInterests: StartupInterest[] = [
  { id: "INT001", investorId: "INV001", investorName: "Karan Gupta", startupId: 5001, startupName: "VisionSmart", startupIndustry: "Healthcare AI", startupStage: "Prototype/MVP", interestDate: "2026-06-12", status: "Interested" },
  { id: "INT002", investorId: "INV002", investorName: "Neha Iyer", startupId: 5002, startupName: "AgriWave", startupIndustry: "Agritech IoT", startupStage: "Early Traction", interestDate: "2026-06-14", status: "Contacted" },
  { id: "INT003", investorId: "INV003", investorName: "Vijay Rao", startupId: 5005, startupName: "FinLabs", startupIndustry: "Fintech Blockchain", startupStage: "Prototype/MVP", interestDate: "2026-06-19", status: "Meeting Scheduled" },
  { id: "INT004", investorId: "INV001", investorName: "Karan Gupta", startupId: 5002, startupName: "AgriWave", startupIndustry: "Agritech IoT", startupStage: "Early Traction", interestDate: "2026-06-15", status: "Declined" },
];

// ----------------------------------------------------
// 10. Contact Requests
// ----------------------------------------------------
export const mockContactRequests: ContactRequest[] = [
  {
    id: "REQ001",
    startupId: 5001,
    startupName: "VisionSmart",
    founderName: "Vijay Rao",
    founderEmail: "vijay@visionsmart.com",
    founderPhone: "9876520001",
    investorId: "INV002",
    investorName: "Neha Iyer",
    requestDate: "2026-06-13",
    status: "Pending",
  },
  {
    id: "REQ002",
    startupId: 5002,
    startupName: "AgriWave",
    founderName: "Amit Singh",
    founderEmail: "amit@agriwave.com",
    founderPhone: "9876520002",
    investorId: "INV001",
    investorName: "Karan Gupta",
    requestDate: "2026-06-14",
    status: "Accepted",
  },
  {
    id: "REQ003",
    startupId: 5005,
    startupName: "FinLabs",
    founderName: "Rohan Mehta",
    founderEmail: "rohan@finlabs.com",
    founderPhone: "9876520005",
    investorId: "INV003",
    investorName: "Vijay Rao",
    requestDate: "2026-06-20",
    status: "Completed",
  },
  {
    id: "REQ004",
    startupId: 5003,
    startupName: "MediNet",
    founderName: "Pooja Joshi",
    founderEmail: "pooja@medinet.com",
    founderPhone: "9876520003",
    investorId: "INV001",
    investorName: "Karan Gupta",
    requestDate: "2026-06-18",
    status: "Rejected",
  },
];

// ----------------------------------------------------
// 11. Recent Activities for Dashboard Overview
// ----------------------------------------------------
export const mockRecentActivities = [
  { id: 1, type: "registration", name: "Sanjay Reddy", description: "registered as Student (RV College of Eng)", date: "2026-06-21" },
  { id: 2, type: "application", name: "FinLabs", description: "submitted startup application for Incubator Round", date: "2026-06-18" },
  { id: 3, type: "interest", name: "Vijay Rao (Investor)", description: "marked high interest in FinLabs", date: "2026-06-19" },
  { id: 4, type: "recruiter", name: "Amit Singh", description: "requested Recruiter Account approval (BrandWave)", date: "2026-06-05" },
  { id: 5, type: "registration", name: "Kiran Das", description: "registered as Student (PES University)", date: "2026-06-20" },
];
