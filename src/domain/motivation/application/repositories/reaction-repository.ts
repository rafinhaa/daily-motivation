import { Reaction } from "@motivation/enterprise/entities/reaction";

export interface ReactionRepository {
  findInspiration(): Promise<Reaction | null>;
  findDisinterest(): Promise<Reaction | null>;
}
