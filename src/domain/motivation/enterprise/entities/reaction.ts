import { Entity } from "@core/entities/entity";
import { DateAt, Optional } from "@core/types";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface ReactionProps extends DateAt {
  reaction: string;
}

export class Reaction extends Entity<ReactionProps> {
  get reaction(): string {
    return this.props.reaction;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  static create(
    props: Optional<ReactionProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Reaction(
      { ...props, createdAt: props.createdAt || new Date() },
      id,
    );
  }
}
