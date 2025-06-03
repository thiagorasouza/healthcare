import { createDoctor } from "@/server/actions/createDoctor";
import fs from "node:fs/promises";
import path from "node:path";

export const mockDoctors = [
  {
    name: "Claire Dunlap",
    email: "claire@mail.com",
    phone: "+351910100200",
    specialty: "Cardiologist",
    bio: "Claire, a seasoned cardiologist in Lisbon, brings years of expertise in hospital settings. She holds a medical degree from the University of Lisbon and a cardiology specialization from the University of Porto. Claire is dedicated to heart health and patient care.",
    picturePath: "/doctors/fdoctor1.png",
  },
  {
    name: "Carmen Berzatto",
    email: "carmen@mail.com",
    phone: "+351910100201",
    specialty: "Surgeon",
    bio: "Carmen Berzatto is a skilled surgeon with over 15 years of experience in complex surgical procedures. She is known for her precision and dedication to patient safety, having trained at some of the top medical institutions in Europe.",
    picturePath: "/doctors/mdoctor1.png",
  },
  {
    name: "Richard Jerimovich",
    email: "richard@mail.com",
    phone: "+351910100202",
    specialty: "Dermatologist",
    bio: "Richard Jerimovich is a renowned dermatologist specializing in skin disorders, cosmetic treatments, and laser therapy. He holds a medical degree from the University of Coimbra and has published numerous articles on skincare.",
    picturePath: "/doctors/mdoctor2.png",
  },
  {
    name: "Sydney Adamu",
    email: "sydney@mail.com",
    phone: "+351910100203",
    specialty: "General Practitioner",
    bio: "Sydney Adamu is a compassionate General Practitioner who focuses on preventive care and holistic patient treatment. With a diverse background in community health, she strives to provide comprehensive and empathetic care to her patients.",
    picturePath: "/doctors/fdoctor2.png",
  },
  {
    name: "Michael Berzatto",
    email: "michael@mail.com",
    phone: "+351910100204",
    specialty: "Neurologist",
    bio: "Dr. Michael Berzatto is a dedicated neurologist specializing in neurodegenerative disorders. With a background in neuroscience, he is committed to advancing treatments for neurological diseases and providing patient-centered care.",
    picturePath: "/doctors/mdoctor1.png",
  },
  {
    name: "Natalie Berzatto",
    email: "natalie@mail.com",
    phone: "+351910100205",
    specialty: "Pediatrician",
    bio: "Dr. Natalie Berzatto is a compassionate pediatrician focused on child health and development. With over a decade of experience, she emphasizes preventive medicine and early childhood care.",
    picturePath: "/doctors/fdoctor1.png",
  },
  {
    name: "Ebraheim Mian",
    email: "ebraheim@mail.com",
    phone: "+351910100206",
    specialty: "Psychiatrist",
    bio: "Dr. Ebraheim Mian is an experienced psychiatrist specializing in adult and adolescent mental health. He combines a modern clinical approach with empathy to provide evidence-based treatments.",
    picturePath: "/doctors/mdoctor2.png",
  },
  {
    name: "Marcus Brooks",
    email: "marcus@mail.com",
    phone: "+351940100207",
    specialty: "Gynecologist",
    bio: "Dr. Marcus Brooks is a dedicated gynecologist focused on women’s health and reproductive medicine. Known for his compassionate approach, Marcus creates a welcoming environment for his patients.",
    picturePath: "/doctors/fdoctor2.png",
  },
];

async function createFileObj(webPath: string) {
  const fullPath = path.join(__dirname, "../../public", webPath);
  const buffer = await fs.readFile(fullPath);
  const filename = webPath.split("/").pop();
  const file = new File([buffer], filename!, {
    type: "image/png",
  });
  return file;
}

async function createDoctorFormData(data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("specialty", data.specialty);
  formData.append("bio", data.bio);
  const picture = await createFileObj(data.picturePath);
  formData.append("picture", picture);
  return formData;
}

export async function createMockDoctors() {
  for (const doctor of mockDoctors) {
    const formData = await createDoctorFormData(doctor);
    await createDoctor(formData, true);
  }
}
