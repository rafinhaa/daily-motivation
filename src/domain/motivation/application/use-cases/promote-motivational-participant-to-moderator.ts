import { MotivationalParticipant } from "@motivation/enterprise/entities/motivational-participant";

import { left, right } from "@core/either";
import { Either } from "@core/types";

import { MotivationalParticipantRepository } from "../repositories/motivational-participant";
import { NotAllowedError, ResourceNotFoundError } from "./errors";

export interface PromoteMotivationalParticipantToModeratorRequest {
  promoterId: string;
  memberId: string;
}

type PromoteMotivationalParticipantToModeratorResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { motivationalParticipant: MotivationalParticipant }
>;

export class PromoteMotivationalParticipantToModeratorUseCase {
  constructor(
    private motivationalParticipant: MotivationalParticipantRepository,
  ) {}

  async execute({
    promoterId,
    memberId,
  }: PromoteMotivationalParticipantToModeratorRequest): Promise<PromoteMotivationalParticipantToModeratorResponse> {
    const motivationalParticipant =
      await this.motivationalParticipant.findById(memberId);

    if (!motivationalParticipant) {
      return left(
        new ResourceNotFoundError("Motivational participant not found"),
      );
    }

    if (motivationalParticipant.getOffice() !== "member") {
      return left(
        new NotAllowedError("Motivational participant is not a member"),
      );
    }

    const promoter = await this.motivationalParticipant.findById(promoterId);

    if (!promoter) {
      return left(
        new ResourceNotFoundError("Motivational participant not found"),
      );
    }

    if (!promoter.hasPermissionToPromoteToModerator()) {
      return left(
        new NotAllowedError("You cannot promote this motivational participant"),
      );
    }

    motivationalParticipant.promoteToModerator();

    await this.motivationalParticipant.save(motivationalParticipant);

    return right({
      motivationalParticipant,
    });
  }
}
