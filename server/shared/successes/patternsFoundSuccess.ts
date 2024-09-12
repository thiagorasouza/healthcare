import { Success } from "@/server/core/success";
import { PatternModel } from "@/server/domain/models/patternModel";

export class PatternsFoundSuccess extends Success<PatternModel[]> {
  constructor(patterns: PatternModel[]) {
    super(patterns);
  }
}
