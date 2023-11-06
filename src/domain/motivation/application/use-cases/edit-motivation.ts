import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";

import { left, right } from "@core/either";
import { Either } from "@core/types/either";

import { NotAllowedError, ResourceNotFoundError } from "./errors";

export interface EditMotivationRequest {
  authorId: string;
  motivationId: string;
  content: string;
}

type EditMotivationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class EditMotivationUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    authorId,
    motivationId,
    content,
  }: EditMotivationRequest): Promise<EditMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      return left(new ResourceNotFoundError("Motivation not found"));
    }

    if (motivation.authorId.toString() !== authorId) {
      return left(new NotAllowedError("Not allowed to edit this motivation"));
    }

    motivation.content = content;

    await this.motivationRepository.save(motivation);

    return right(null);
  }
}
