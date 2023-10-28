import { Entity } from "@core/entities/entity";
import { DateAt } from "@core/types/date-at";
import { Optional } from "@core/types/optional";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface MotivatorProps extends DateAt {
  name: string;
}

export class Motivator extends Entity<MotivatorProps> {
  get name(): string {
    return this.props.name;
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
    props: Optional<MotivatorProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Motivator({ ...props, createdAt: new Date() }, id);
  }
}
