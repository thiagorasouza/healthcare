import { PatternData } from "@/lib/schemas/patternsSchema";
import { Models } from "node-appwrite";

// Still missing availabilities and appointements
export type DoctorDocumentSchema = {
  name: string;
  specialty: string;
  bio: string;
  authId: string;
  pictureId: string;
} & Models.Document;

export type DoctorDocumentListSchema = Models.DocumentList<DoctorDocumentSchema>;

export type PatternDocumentSchema = PatternData & Models.Document;
export type PatternDocumentListSchema = Models.DocumentList<PatternDocumentSchema>;

export type UserDocumentSchema = Models.User<Models.Preferences>;
