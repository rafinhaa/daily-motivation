import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

export interface GetDailyMotivationRequest {}

interface GetDailyMotivationResponse {
  motivation: Motivation | null;
}

export class GetDailyMotivationByIdUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute(): Promise<GetDailyMotivationResponse> {
    const existingMotivation =
      await this.motivationRepository.getDailyMotivation();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    if (!existingMotivation || !existingMotivation.dailyMotivation)
      throw new Error("Daily motivation not found");

    if (existingMotivation.dailyMotivation.getDate() !== currentDay) {
      existingMotivation.removeDailyMotivation();
      await this.motivationRepository.save(existingMotivation);

      const newDailyMotivation =
        await this.motivationRepository.getNewDailyMotivation();

      newDailyMotivation.setDailyMotivation();
      await this.motivationRepository.save(newDailyMotivation);

      return {
        motivation: newDailyMotivation,
      };
    }

    return { motivation: existingMotivation };
  }
}
