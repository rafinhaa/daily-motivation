import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";

export interface EditMotivationRequest {
  authorId: string;
  motivationId: string;
  content: string;
}

interface EditMotivationResponse {}

export class EditMotivationUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    authorId,
    motivationId,
    content,
  }: EditMotivationRequest): Promise<EditMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    if (motivation.authorId.toString() !== authorId) {
      throw new Error("Not allowed to edit this motivation");
    }

    motivation.content = content;

    await this.motivationRepository.save(motivation);

    return {};
  }
}
