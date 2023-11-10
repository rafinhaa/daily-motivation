import { MotivationalParticipant } from "@motivation/enterprise/entities/motivational-participant";

import { left, right } from "@core/either";
import { Either } from "@core/types";

import { MotivationalParticipantRepository } from "../repositories/motivational-participant";
import { NotAllowedError, ResourceNotFoundError } from "./errors";

export interface DemoteMotivationalParticipantToMemberRequest {
  disqualifierId: string;
  memberId: string;
}

type DemoteMotivationalParticipantToMemberResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { motivationalParticipant: MotivationalParticipant }
>;

export class DemoteMotivationalParticipantToMemberUseCase {
  constructor(
    private motivationalParticipant: MotivationalParticipantRepository,
  ) {}

  async execute({
    disqualifierId,
    memberId,
  }: DemoteMotivationalParticipantToMemberRequest): Promise<DemoteMotivationalParticipantToMemberResponse> {
    const motivationalParticipant =
      await this.motivationalParticipant.findById(memberId);

    if (!motivationalParticipant) {
      return left(
        new ResourceNotFoundError("Motivational participant not found"),
      );
    }

    if (motivationalParticipant.getOffice() !== "moderator") {
      return left(
        new NotAllowedError("Motivational participant is not a moderator"),
      );
    }

    const demote = await this.motivationalParticipant.findById(disqualifierId);

    if (!demote) {
      return left(
        new ResourceNotFoundError("Motivational participant not found"),
      );
    }

    if (!demote.isAdmin()) {
      return left(
        new NotAllowedError("You cannot demote this motivational participant"),
      );
    }

    motivationalParticipant.demoteToMember();

    await this.motivationalParticipant.save(motivationalParticipant);

    return right({
      motivationalParticipant,
    });
  }
}
