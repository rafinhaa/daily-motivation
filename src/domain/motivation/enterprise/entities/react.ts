import { Entity } from "@core/entities/entity";
import { DateAt } from "@core/types/date-at";
import { Optional } from "@core/types/optional";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { Reaction } from "./reaction";

export interface ReactProps extends DateAt {
  authorId: UniqueEntityID;
  motivationId: UniqueEntityID;
  reaction: Reaction;
}

export class React extends Entity<ReactProps> {
  get authorId(): UniqueEntityID {
    return this.props.authorId;
  }

  get motivationId(): UniqueEntityID {
    return this.props.motivationId;
  }

  get reaction(): Reaction {
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

  static create(props: Optional<ReactProps, "createdAt">, id?: UniqueEntityID) {
    return new React(
      { ...props, createdAt: props.createdAt || new Date() },
      id,
    );
  }
}
