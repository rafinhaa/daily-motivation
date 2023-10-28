import { Motivation } from "@domain/entities/motivation";

export interface MotivationRepository {
  create(motivation: Motivation): Promise<void>;
}
