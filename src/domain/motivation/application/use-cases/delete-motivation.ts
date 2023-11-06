import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";

import { left, right } from "@core/either";
import { Either } from "@core/types/either";

import { MotivationalParticipantRepository } from "../repositories/motivational-participant";
import { NotAllowedError, ResourceNotFoundError } from "./errors";

export interface DeleteMotivationRequest {
  authorId: string;
  motivationId: string;
}

type DeleteMotivationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

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
      return left(new ResourceNotFoundError("Motivation not found"));
    }

    const author =
      await this.motivationalParticipantRepository.findById(authorId);

    if (!author) {
      return left(new ResourceNotFoundError("Author not found"));
    }

    if (motivation.authorId !== author.id && !author.isAdmin()) {
      return left(new NotAllowedError("Not allowed to delete this motivation"));
    }

    await this.motivationRepository.delete(motivation);

    return right(null);
  }
}
