import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { left, right } from "@core/either";
import { Either } from "@core/types";

import { ResourceNotFoundError } from "./errors";

export interface GetMotivationRequest {
  motivationId: string;
}

type GetMotivationResponse = Either<
  ResourceNotFoundError,
  { motivation: Motivation }
>;

export class GetMotivationByIdUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    motivationId,
  }: GetMotivationRequest): Promise<GetMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      return left(new ResourceNotFoundError("Motivation not found"));
    }

    return right({ motivation });
  }
}
