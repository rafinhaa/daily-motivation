import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { right } from "@core/either";
import { Either } from "@core/types";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface CreateMotivationRequest {
  authorId: string;
  content: string;
}

type CreateMotivationResponse = Either<null, { motivation: Motivation }>;

export class CreateMotivationUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    authorId,
    content,
  }: CreateMotivationRequest): Promise<CreateMotivationResponse> {
    const motivation = Motivation.create({
      content,
      authorId: new UniqueEntityID(authorId),
    });

    await this.motivationRepository.create(motivation);

    return right({ motivation });
  }
}
