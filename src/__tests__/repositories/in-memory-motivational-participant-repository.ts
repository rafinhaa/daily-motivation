import { MotivationalParticipantRepository } from "@motivation/application/repositories/motivational-participant";
import { RoleRepository } from "@motivation/application/repositories/role-repository";
import { MotivationalParticipant } from "@motivation/enterprise/entities/motivational-participant";

export class InMemoryMotivationalParticipantRepository
  implements MotivationalParticipantRepository
{
  private motivationalParticipants: MotivationalParticipant[] = [];

  constructor(private roleRepository: RoleRepository) {}

  async create(
    motivationalParticipant: MotivationalParticipant,
  ): Promise<void> {
    this.motivationalParticipants.push(motivationalParticipant);
  }

  async findById(
    motivationalParticipantId: string,
  ): Promise<MotivationalParticipant | null> {
    const motivationalParticipant = this.motivationalParticipants.find(
      (motivation) => motivation.id.toString() === motivationalParticipantId,
    );

    if (!motivationalParticipant) return null;

    const role = await this.roleRepository.getRoleByType(
      motivationalParticipant.role.type,
    );

    motivationalParticipant.role = role;

    return motivationalParticipant;
  }
}