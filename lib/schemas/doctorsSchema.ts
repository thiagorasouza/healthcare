import { z } from "zod";
import { AppwriteDocumentProperties } from "./appwriteSchema";

export const doctorsSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().refine((val) => /^\+[0-9]{5,15}$/.test(val)),
  specialty: z.string().min(2).max(100),
  bio: z.string().min(2).max(500),
  picture: z.instanceof(File).refine((file) => file.name !== ""),
});

export type DoctorData = z.infer<typeof doctorsSchema>;

export type AppwriteDoctorData = DoctorData &
  AppwriteDocumentProperties & { authId: string };
