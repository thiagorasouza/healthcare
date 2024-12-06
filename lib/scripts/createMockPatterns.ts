import { createPattern } from "@/lib/actions/createPattern";
import { databases, Query } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { objectToFormData } from "@/lib/utils";
import { addMonths, setHours } from "date-fns";

const mockPattern = {
  startDate: new Date(),
  endDate: addMonths(new Date(), 3),
  startTime: new Date(new Date().setHours(8, 0, 0, 0)),
  endTime: new Date(new Date().setHours(16, 0, 0, 0)),
  duration: 30,
  recurring: true,
  weekdays: ["tue", "wed", "thu"],
};
// console.log("🚀 ~ mockPattern:", mockPattern);

async function createMockPatterns() {
  const query = await databases.listDocuments(env.databaseId, env.doctorsCollectionId, [
    Query.equal("name", "Claire Dunlap"),
  ]);
  // console.log("🚀 ~ query:", query);

  const doctor = query.documents[0];
  const formData = objectToFormData(mockPattern);
  formData.append("doctorId", doctor.$id);
  const result = await createPattern(formData);

  // console.log("🚀 ~ result:", result);
}

createMockPatterns();
