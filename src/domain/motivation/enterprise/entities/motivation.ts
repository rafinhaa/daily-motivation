import { Entity } from "@core/entities/entity";
import { DateAt } from "@core/types/date-at";
import { Optional } from "@core/types/optional";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface MotivationProps extends DateAt {
  content: string;
  dailyMotivation: Date | null;
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

  get dailyMotivation(): Date | null | undefined {
    return this.props.dailyMotivation;
  }

  setDailyMotivation() {
    this.props.dailyMotivation = new Date();
  }

  removeDailyMotivation() {
    this.props.dailyMotivation = null;
  }

  static create(
    props: Optional<MotivationProps, "createdAt" | "dailyMotivation">,
    id?: UniqueEntityID,
  ) {
    const dailyMotivation = props.dailyMotivation || null;

    return new Motivation(
      { ...props, createdAt: props.createdAt || new Date(), dailyMotivation },
      id,
    );
  }
}
