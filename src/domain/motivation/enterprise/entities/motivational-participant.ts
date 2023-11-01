import { Entity } from "@core/entities/entity";
import { DateAt } from "@core/types/date-at";
import { Optional } from "@core/types/optional";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface MotivationalParticipantProps extends DateAt {
  surname: string;
}

export class MotivationalParticipant extends Entity<MotivationalParticipantProps> {
  get surname(): string {
    return this.props.surname;
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
    props: Optional<MotivationalParticipantProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new MotivationalParticipant({ ...props, createdAt: new Date() }, id);
  }
}
