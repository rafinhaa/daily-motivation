import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { constants } from "@core/constants";
import { FetchDataParams } from "@core/types/fetch-data";
import { Optional } from "@core/types/optional";

export interface FetchRecentMotivationsByAuthorIdRequest
  extends Optional<FetchDataParams, "page" | "limitPerPage"> {
  authorId: string;
}

interface FetchRecentMotivationsByAuthorIdResponse {
  motivations: Motivation[];
}

export class FetchRecentMotivationsByAuthorIdUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    authorId,
    page = constants.PAGE,
    limitPerPage = constants.LIMIT_PER_PAGE,
  }: FetchRecentMotivationsByAuthorIdRequest): Promise<FetchRecentMotivationsByAuthorIdResponse> {
    const motivations =
      await this.motivationRepository.findManyRecentByAuthorId(authorId, {
        page,
        limitPerPage,
      });

    return { motivations };
  }
}
