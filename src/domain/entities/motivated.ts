import { Entity } from "@core/entities/entity";
import { DateAt } from "@core/types/date-at";
import { Optional } from "@core/types/optional";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface MotivatedProps extends DateAt {
  name: string;
}

export class Motivated extends Entity<MotivatedProps> {
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
    props: Optional<MotivatedProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Motivated({ ...props, createdAt: new Date() }, id);
  }
}
