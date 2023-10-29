import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { constants } from "@core/constants";
import { FetchDataParams } from "@core/types/fetch-data";

export interface FetchRecentMotivationsRequest extends FetchDataParams {}

interface FetchRecentMotivationsResponse {
  motivations: Motivation[];
}

export class FetchRecentMotivationsUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    page = constants.PAGE,
    limitPerPage = constants.LIMIT_PER_PAGE,
  }: FetchRecentMotivationsRequest = {}): Promise<FetchRecentMotivationsResponse> {
    const motivations = await this.motivationRepository.findManyRecent({
      page,
      limitPerPage,
    });

    return { motivations };
  }
}
