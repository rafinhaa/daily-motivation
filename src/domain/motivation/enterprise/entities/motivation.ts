import { Entity } from "@core/entities/entity";
import { DateAt } from "@core/types/date-at";
import { Optional } from "@core/types/optional";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface MotivationProps extends DateAt {
  content: string;
  authorId: UniqueEntityID;
}

export class Motivation extends Entity<MotivationProps> {
  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId;
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

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  static create(
    props: Optional<MotivationProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Motivation({ ...props, createdAt: new Date() }, id);
  }
}
