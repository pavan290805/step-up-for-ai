import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IExternalApplication {
  studentId: Types.ObjectId;
  provider: "jsearch";
  externalJobId: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string | null;
  applyUrl: string;
  sourceUrl: string | null;
  employerLogoUrl: string | null;
  postedAt: string | null;
  status: "external_page_opened";
  firstOpenedAt: Date;
  lastOpenedAt: Date;
  openCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const externalApplicationSchema = new Schema<IExternalApplication>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["jsearch"], required: true },
    externalJobId: { type: String, required: true },
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: { type: String, default: null },
    applyUrl: { type: String, required: true },
    sourceUrl: { type: String, default: null },
    employerLogoUrl: { type: String, default: null },
    postedAt: { type: String, default: null },
    status: { type: String, enum: ["external_page_opened"], default: "external_page_opened" },
    firstOpenedAt: { type: Date, required: true },
    lastOpenedAt: { type: Date, required: true },
    openCount: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

externalApplicationSchema.index({ studentId: 1, provider: 1, externalJobId: 1 }, { unique: true });
externalApplicationSchema.index({ studentId: 1, lastOpenedAt: -1 });

export const ExternalApplicationModel: Model<IExternalApplication> =
  models.ExternalApplication ?? model<IExternalApplication>("ExternalApplication", externalApplicationSchema);
