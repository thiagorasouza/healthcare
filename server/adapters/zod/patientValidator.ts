import { allowedFileTypes } from "@/lib/schemas/patientsSchema";
import { maxFileSize } from "@/server/config/constants";
import { PatientData } from "@/server/domain/models/patientData";
import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { z } from "zod";

export const patientsZodSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().refine((val) => /^\+[0-9]{5,15}$/.test(val)),
  birthdate: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(2).max(200),
  insuranceProvider: z.string().min(2).max(100),
  insuranceNumber: z.string().min(2).max(100),
  identificationType: z.enum(["passport", "identityCard", "driversLicense", "other"]),
  identificationNumber: z.string().min(2).max(100),
  identification: z.instanceof(File).refine((file) => {
    return (
      file.name !== "" && file.size <= maxFileSize && allowedFileTypes.includes(file.type.trim())
    );
  }),
  usageConsent: z.coerce
    .boolean()
    .refine((val) => val === true, { message: "You must agree to continue" }),
  privacyConsent: z.coerce
    .boolean()
    .refine((val) => val === true, { message: "You must agree to continue" }),
});

export const patientValidator = new GenericValidator<PatientData>(patientsZodSchema);
