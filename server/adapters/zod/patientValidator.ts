import { allowedFileTypes, maxFileSize } from "@/server/config/constants";
import { PatientData } from "@/server/domain/models/patientData";
import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { z } from "zod";

export const patientFormSchema = z.object({
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

export const patientDefaultValues = {
  name: "",
  email: "",
  phone: "",
  birthdate: undefined,
  gender: undefined,
  address: "",
  insuranceProvider: "",
  insuranceNumber: "",
  identificationType: undefined,
  identificationNumber: "",
  identification: undefined,
  usageConsent: undefined,
  privacyConsent: undefined,
};

export type PatientFormData = z.infer<typeof patientFormSchema>;

export const updatePatientSchema = patientFormSchema.extend({
  id: z.string(),
});

export type UpdatePatientData = z.infer<typeof updatePatientSchema>;

export const patientValidator = new GenericValidator<PatientData>(patientFormSchema);
export const updatePatientValidator = new GenericValidator<UpdatePatientData>(updatePatientSchema);
