import { SlotData } from "@/lib/schemas/slotsSchema";
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

export type SlotDocumentSchema = SlotData & Models.Document;
export type SlotDocumentListSchema = Models.DocumentList<SlotDocumentSchema>;

export type UserDocumentSchema = Models.User<Models.Preferences>;
