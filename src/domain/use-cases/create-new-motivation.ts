import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { Motivation } from "@domain/entities/motivation";
import { MotivationRepository } from "@domain/repositories/motivation-repository";

export interface CreateNewMotivationRequest {
  authorId: string;
  content: string;
}

export class CreateNewMotivation {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    authorId,
    content,
  }: CreateNewMotivationRequest): Promise<Motivation> {
    const motivation = Motivation.create({
      content,
      authorId: new UniqueEntityID(authorId),
    });

    await this.motivationRepository.create(motivation);

    return motivation;
  }
}
