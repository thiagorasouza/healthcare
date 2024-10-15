import { env } from "@/server/config/env";
import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { Repository } from "@/server/frameworks/appwrite/repository";
import { PatternsRepositoryInterface } from "@/server/repositories/patternsRepository";
import { Query } from "@/server/frameworks/appwrite/nodeClient";
import { Appwritify } from "@/server/frameworks/appwrite/helpers";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";

export class PatternsRepository
  extends Repository<PatternModel>
  implements PatternsRepositoryInterface
{
  constructor() {
    super(env.patternsCollectionId);
  }

  public async getPatternsByDoctorId(doctorId: string) {
    const result = await this.listDocuments([Query.equal("doctorId", doctorId)]);
    if (result.total === 0) {
      return new NotFoundFailure(doctorId);
    }

    const patterns = result.documents.map((pattern) =>
      this.map(pattern as Appwritify<PatternModel>),
    );

    return new FoundSuccess<PatternModel[]>(patterns);
  }

  public map(data: Appwritify<PatternModel>): PatternModel {
    return {
      id: data.$id,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      duration: data.duration,
      recurring: data.recurring,
      weekdays: data.weekdays as Weekday[],
      doctorId: data.doctorId,
    };
  }
}
