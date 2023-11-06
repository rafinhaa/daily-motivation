import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { constants } from "@core/constants";
import { right } from "@core/either";
import { Either } from "@core/types";
import { FetchDataParams } from "@core/types";

export interface FetchRecentMotivationsRequest extends FetchDataParams {}

type FetchRecentMotivationsResponse = Either<
  null,
  {
    motivations: Motivation[];
  }
>;

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

    return right({ motivations });
  }
}
