import { ReactionRepository } from "@motivation/application/repositories/reaction-repository";
import { Reaction } from "@motivation/enterprise/entities/reaction";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export class InMemoryReactionRepository implements ReactionRepository {
  private reactions: Reaction[] = [
    Reaction.create(
      {
        reaction: "inspiration",
        createdAt: new Date(),
      },
      new UniqueEntityID("1"),
    ),
    Reaction.create(
      {
        reaction: "disinterest",
        createdAt: new Date(),
      },
      new UniqueEntityID("2"),
    ),
  ];

  async findInspiration(): Promise<Reaction | null> {
    return (
      this.reactions.find((reaction) => reaction.id.toString() === "1") || null
    );
  }

  async findDisinterest(): Promise<Reaction | null> {
    return (
      this.reactions.find((reaction) => reaction.id.toString() === "2") || null
    );
  }
}
