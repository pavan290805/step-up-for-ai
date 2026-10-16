import { ApplicationModel, type ApplicationStatus } from "@/database/models/application.model";
import { StudentProfileModel } from "@/database/models/student-profile.model";

export interface CreateApplicationData {
  studentId: string;
  internshipId: string;
  recruiterId: string;
  resumeId: string;
  coverNote?: string;
}

export const applicationRepository = {
  async create(data: CreateApplicationData) {
    const application = await ApplicationModel.create({
      ...data,
      status: "applied",
      timeline: [{ status: "applied", changedAt: new Date(), note: null }],
    });
    return application.toObject();
  },

  async findExisting(studentId: string, internshipId: string) {
    return ApplicationModel.findOne({ studentId, internshipId }).lean().exec();
  },

  async findById(id: string) {
    return ApplicationModel.findById(id).lean().exec();
  },

  async findByStudent(studentId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { studentId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return ApplicationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate({ path: "internshipId", select: "title location type" })
      .lean()
      .exec();
  },

  async findByInternship(internshipId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { internshipId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return ApplicationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate({ path: "internshipId", select: "title location type" })
      .populate({ path: "studentId", select: "email" })
      .lean()
      .exec();
  },

  async findByRecruiter(
    recruiterId: string,
    cursor: string | undefined,
    limit: number,
    status?: string,
    internshipId?: string
  ) {
    const query: Record<string, unknown> = { recruiterId };
    if (status) query.status = status;
    if (internshipId) query.internshipId = internshipId;
    if (cursor) query._id = { $lt: cursor };

    const applications = await ApplicationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate({ path: "internshipId", select: "title location type" })
      .lean()
      .exec();

    const studentIds = applications.map((application) => String(application.studentId));
    const profiles = await StudentProfileModel.find({ userId: { $in: studentIds } })
      .select("userId fullName headline")
      .lean()
      .exec();
    const profilesByUserId = new Map(profiles.map((profile) => [String(profile.userId), profile]));

    return applications.map((application) => ({
      ...application,
      studentProfile: profilesByUserId.get(String(application.studentId)) ?? null,
    }));
  },

  async updateStatus(id: string, status: ApplicationStatus, note?: string) {
    return ApplicationModel.findByIdAndUpdate(
      id,
      {
        status,
        $push: { timeline: { status, changedAt: new Date(), note: note ?? null } },
      },
      { new: true }
    )
      .lean()
      .exec();
  },

  async countByInternship(internshipId: string): Promise<number> {
    return ApplicationModel.countDocuments({ internshipId }).exec();
  },

  async countByStudent(studentId: string): Promise<number> {
    return ApplicationModel.countDocuments({ studentId }).exec();
  },

  async countByRecruiter(recruiterId: string): Promise<number> {
    return ApplicationModel.countDocuments({ recruiterId }).exec();
  },
};

export type ApplicationRepository = typeof applicationRepository;
