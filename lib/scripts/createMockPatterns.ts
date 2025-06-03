import { createMockDoctors, mockDoctors } from "@/lib/scripts/createMockDoctors";
import { databases, ID, Query } from "@/server/adapters/appwrite/nodeClient";
import { weekdays } from "@/server/config/constants";
import { env } from "@/server/config/env";
import { faker } from "@faker-js/faker";
import { addMonths } from "date-fns";

const mockPattern = () => ({
  startDate: new Date(),
  endDate: addMonths(new Date(), 6),
  startTime: new Date(new Date().setHours(8, 0, 0, 0)),
  endTime: new Date(new Date().setHours(16, 0, 0, 0)),
  duration: 30,
  recurring: true,
  weekdays: faker.helpers.arrayElements(weekdays, { min: 2, max: 3 }),
});

async function createMockPatterns(doctorName: string) {
  const doctorResult = await databases.listDocuments(env.databaseId, env.doctorsCollectionId, [
    Query.equal("name", doctorName),
  ]);

  const doctor = doctorResult.documents[0];

  await databases.createDocument(env.databaseId, env.patternsCollectionId, ID.unique(), {
    ...mockPattern(),
    doctorId: doctor.$id,
  });
}

async function main() {
  await createMockDoctors();

  for (const doctor of mockDoctors) {
    await createMockPatterns(doctor.name);
  }
  // createMockPatterns("Claire Dunlap");
}

main();
