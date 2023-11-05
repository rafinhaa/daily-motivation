import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface CreateMotivationRequest {
  authorId: string;
  content: string;
}

interface CreateMotivationResponse {
  motivation: Motivation;
}

export class CreateMotivationUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    authorId,
    content,
  }: CreateMotivationRequest): Promise<CreateMotivationResponse> {
    const motivation = Motivation.create({
      content,
      authorId: new UniqueEntityID(authorId),
      dailyMotivation: null,
    });

    await this.motivationRepository.create(motivation);

    return { motivation };
  }
}
