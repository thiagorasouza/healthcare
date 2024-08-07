import { AvailabilityData } from "@/lib/schemas/availabilitySchema";
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

export type AvDocumentSchema = AvailabilityData & Models.Document;
export type AvDocumentListSchema = Models.DocumentList<AvDocumentSchema>;

export type UserDocumentSchema = Models.User<Models.Preferences>;
