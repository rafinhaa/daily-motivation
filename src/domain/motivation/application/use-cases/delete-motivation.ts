import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";

export interface DeleteMotivationRequest {
  authorId: string;
  motivationId: string;
}

interface DeleteMotivationResponse {}

export class DeleteMotivationUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    authorId,
    motivationId,
  }: DeleteMotivationRequest): Promise<DeleteMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    if (motivation.authorId.toString() !== authorId) {
      throw new Error("Not allowed to delete this motivation");
    }

    await this.motivationRepository.delete(motivation);

    return {};
  }
}
