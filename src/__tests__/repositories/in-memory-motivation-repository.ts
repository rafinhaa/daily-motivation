import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

export class InMemoryMotivationRepository implements MotivationRepository {
  private motivations: Motivation[] = [];

  async create(motivation: Motivation): Promise<void> {
    this.motivations.push(motivation);
  }

  async findById(motivationId: string): Promise<Motivation | null> {
    return (
      this.motivations.find(
        (motivation) => motivation.id.toString() === motivationId,
      ) || null
    );
  }

  async delete(motivation: Motivation): Promise<void> {
    const motivationIndex = this.motivations.findIndex(
      (item) => item.id === motivation.id,
    );
    this.motivations.splice(motivationIndex, 1);
  }
}
