import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { left, right } from "@core/either";
import { Either } from "@core/types/either";

import { ResourceNotFoundError } from "./errors";

export interface GetDailyMotivationRequest {}

type GetDailyMotivationResponse = Either<
  ResourceNotFoundError,
  {
    motivation: Motivation;
  }
>;
export class GetDailyMotivationByIdUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute(): Promise<GetDailyMotivationResponse> {
    const existingMotivation =
      await this.motivationRepository.getDailyMotivation();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    if (!existingMotivation || !existingMotivation.dailyMotivation)
      return left(new ResourceNotFoundError("Daily motivation not found"));

    if (existingMotivation.dailyMotivation.getDate() !== currentDay) {
      existingMotivation.removeDailyMotivation();
      await this.motivationRepository.save(existingMotivation);

      const newDailyMotivation =
        await this.motivationRepository.getNewDailyMotivation();

      newDailyMotivation.setDailyMotivation();
      await this.motivationRepository.save(newDailyMotivation);

      return right({
        motivation: newDailyMotivation,
      });
    }

    return right({ motivation: existingMotivation });
  }
}
