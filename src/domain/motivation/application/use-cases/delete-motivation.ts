import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";

import { MotivationalParticipantRepository } from "../repositories/motivational-participant";

export interface DeleteMotivationRequest {
  authorId: string;
  motivationId: string;
}

interface DeleteMotivationResponse {}

export class DeleteMotivationUseCase {
  constructor(
    private motivationRepository: MotivationRepository,
    private motivationalParticipantRepository: MotivationalParticipantRepository,
  ) {}

  async execute({
    authorId,
    motivationId,
  }: DeleteMotivationRequest): Promise<DeleteMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    const author =
      await this.motivationalParticipantRepository.findById(authorId);

    if (!author) {
      throw new Error("Author not found");
    }

    if (motivation.authorId !== author.id && !author.isAdmin()) {
      throw new Error("Not allowed to delete this motivation");
    }

    await this.motivationRepository.delete(motivation);

    return {};
  }
}
