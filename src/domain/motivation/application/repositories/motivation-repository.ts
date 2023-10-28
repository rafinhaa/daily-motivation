import { Motivation } from "@motivation/enterprise/entities/motivation";

export interface MotivationRepository {
  create(motivation: Motivation): Promise<void>;
  findById(motivationId: string): Promise<Motivation | null>;
}
