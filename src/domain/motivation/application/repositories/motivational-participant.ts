import { MotivationalParticipant } from "@motivation/enterprise/entities/motivational-participant";

export interface MotivationalParticipantRepository {
  create(motivationalParticipantId: MotivationalParticipant): Promise<void>;
  findById(
    motivationalParticipantId: string,
  ): Promise<MotivationalParticipant | null>;
}
