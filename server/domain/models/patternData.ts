import { PatternModel } from "@/server/domain/models/patternModel";

export type PatternData = Omit<PatternModel, "id">;
