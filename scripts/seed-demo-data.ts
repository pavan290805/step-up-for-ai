import { randomBytes } from "node:crypto";
import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: ".env.local" });
config();

const DEMO_COMPANY_SLUG = "step-up-demo-labs";

async function seedDemoData() {
  const [
    { env },
    { createModuleLogger },
    { CompanyModel },
    { CommunityPostModel },
    { EventModel },
    { InternshipModel },
    { RecruiterProfileModel },
    { StudentProfileModel },
    { UserModel },
    { ROLES },
    { hashPassword },
  ] = await Promise.all([
    import("@/config/env"),
    import("@/config/logger.config"),
    import("@/database/models/company.model"),
    import("@/database/models/community-post.model"),
    import("@/database/models/event.model"),
    import("@/database/models/internship.model"),
    import("@/database/models/recruiter-profile.model"),
    import("@/database/models/student-profile.model"),
    import("@/database/models/user.model"),
    import("@/shared/constants/roles"),
    import("@/shared/utils/hash"),
  ]);
  const logger = createModuleLogger("seed:demo");

  await mongoose.connect(env.MONGODB_URI);
  logger.info("Connected to MongoDB for demo-data seeding");

  try {
    const demoRecruiter = await findOrCreateDemoUser(
      UserModel,
      "demo-recruiter@stepup.seed",
      ROLES.RECRUITER,
      hashPassword
    );
    const demoStudent = await findOrCreateDemoUser(
      UserModel,
      "demo-student@stepup.seed",
      ROLES.STUDENT,
      hashPassword
    );

    await RecruiterProfileModel.findOneAndUpdate(
      { userId: demoRecruiter._id },
      {
        $set: {
          fullName: "Jordan Lee",
          designation: "Talent Partner",
          verified: false,
          subscriptionTier: "free",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    await StudentProfileModel.findOneAndUpdate(
      { userId: demoStudent._id },
      {
        $set: {
          fullName: "Taylor Morgan",
          headline: "Computer science student exploring applied AI",
          bio: "Demo profile for sample community content on Step-up for AI.",
          skills: ["Python", "TypeScript", "Machine Learning"],
          subscriptionTier: "free",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    const existingCompany = await CompanyModel.findOne({ slug: DEMO_COMPANY_SLUG }).lean().exec();
    if (existingCompany && String(existingCompany.createdBy) !== String(demoRecruiter._id)) {
      throw new Error(`Company slug "${DEMO_COMPANY_SLUG}" is already owned by another account`);
    }

    const company = await CompanyModel.findOneAndUpdate(
      { slug: DEMO_COMPANY_SLUG },
      {
        $set: {
          name: "Step-up Demo Labs",
          website: "https://example.com",
          industry: "Artificial Intelligence",
          size: "11-50",
          description:
            "A fictional demo company used to showcase sample hiring content. These listings are not real job offers.",
          verifiedByAdmin: false,
          createdBy: demoRecruiter._id,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    const internships = [
      {
        title: "[Demo] AI/ML Engineering Intern",
        description:
          "Sample listing only. Work with a small team to prototype machine-learning features, prepare datasets, and document experiments. This is fictional demo content, not a real job offer.",
        skillsRequired: ["Python", "Machine Learning", "Git"],
        location: "Remote (India)",
        type: "internship",
        stipend: 25000,
      },
      {
        title: "[Demo] Full-Stack Developer Intern",
        description:
          "Sample listing only. Build and test accessible product features using TypeScript, React, and Node.js while learning a collaborative development workflow. This is fictional demo content, not a real job offer.",
        skillsRequired: ["TypeScript", "React", "Node.js"],
        location: "Bengaluru, India (Hybrid)",
        type: "internship",
        stipend: 20000,
      },
      {
        title: "[Demo] Data Analytics Intern",
        description:
          "Sample listing only. Explore product datasets, create clear dashboards, and share evidence-based insights with a cross-functional team. This is fictional demo content, not a real job offer.",
        skillsRequired: ["SQL", "Python", "Data Visualization"],
        location: "Remote (India)",
        type: "internship",
        stipend: 18000,
      },
      {
        title: "[Demo] Product Design Intern",
        description:
          "Sample listing only. Support user research, map product journeys, and create accessible interface prototypes alongside product and engineering teammates. This is fictional demo content, not a real job offer.",
        skillsRequired: ["Figma", "User Research", "Prototyping"],
        location: "Pune, India (Hybrid)",
        type: "internship",
        stipend: 15000,
      },
    ] as const;

    for (const internship of internships) {
      await InternshipModel.findOneAndUpdate(
        { recruiterId: demoRecruiter._id, title: internship.title },
        {
          $set: {
            ...internship,
            companyId: company._id,
            status: "published",
            applicationDeadline: daysFromNow(60),
            viewCount: 0,
            applicationCount: 0,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
      );
    }

    const posts = [
      {
        title: "[Demo] How I am building my first AI portfolio project",
        content:
          "Demo discussion: I am turning a small machine-learning idea into a portfolio project. What helped you keep your first project focused and explain the impact clearly?",
        category: "career",
        tags: ["AI", "portfolio", "students"],
      },
      {
        title: "[Demo] What do you look for in an internship mentor?",
        content:
          "Demo discussion: A supportive mentor can make an internship a much better learning experience. Which habits or kinds of feedback have helped you grow the most?",
        category: "career",
        tags: ["internships", "mentorship", "career"],
      },
      {
        title: "[Demo] Small steps for a stronger technical interview",
        content:
          "Demo discussion: I am practicing by explaining one problem-solving decision out loud each day. Share a simple interview-preparation habit that has worked for you.",
        category: "interviews",
        tags: ["interviews", "preparation", "students"],
      },
    ] as const;

    for (const post of posts) {
      await CommunityPostModel.findOneAndUpdate(
        { authorId: demoStudent._id, title: post.title },
        {
          $set: {
            ...post,
            status: "published",
            likeCount: 0,
            commentCount: 0,
            bookmarkCount: 0,
            moderatedBy: null,
            moderationReason: null,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
      );
    }

    const events = [
      {
        title: "[Demo] Getting started with practical generative AI",
        description:
          "Sample online workshop covering practical generative-AI concepts, responsible prototyping, and a guided starter exercise. This is fictional demo event content.",
        type: "workshop",
        startAt: daysFromNow(14),
        endAt: daysFromNow(14, 2),
        location: "Online",
        isOnline: true,
        capacity: 100,
        isFeatured: true,
        tags: ["generative AI", "workshop", "beginner"],
        category: "technology",
      },
      {
        title: "[Demo] Student AI project showcase",
        description:
          "Sample online community showcase for students to present AI projects, share lessons learned, and meet peers. This is fictional demo event content.",
        type: "networking",
        startAt: daysFromNow(21),
        endAt: daysFromNow(21, 2),
        location: "Online",
        isOnline: true,
        capacity: 150,
        isFeatured: false,
        tags: ["students", "AI", "networking"],
        category: "community",
      },
    ] as const;

    for (const event of events) {
      await EventModel.findOneAndUpdate(
        { organizerId: demoRecruiter._id, title: event.title },
        {
          $set: {
            ...event,
            status: "published",
            registeredCount: 0,
            waitlistCount: 0,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
      );
    }

    logger.info(
      {
        internships: internships.length,
        communityPosts: posts.length,
        events: events.length,
        company: "Step-up Demo Labs",
      },
      "Demo data seeded successfully"
    );
  } finally {
    await mongoose.disconnect();
  }
}

async function findOrCreateDemoUser(
  userModel: typeof import("@/database/models/user.model").UserModel,
  email: string,
  role: string,
  hashPassword: typeof import("@/shared/utils/hash").hashPassword
) {
  const existing = await userModel.findOne({ email }).exec();
  if (existing) {
    if (existing.role !== role) {
      throw new Error(`Demo email "${email}" is already registered with a different role`);
    }
    return existing;
  }

  const passwordHash = await hashPassword(randomBytes(32).toString("hex"));
  return userModel.create({
    email,
    passwordHash,
    role,
    status: "active",
    emailVerified: true,
  });
}

function daysFromNow(days: number, hours = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  return date;
}

seedDemoData().catch((error: unknown) => {
  console.error("Demo-data seeding failed:", error);
  process.exitCode = 1;
});
