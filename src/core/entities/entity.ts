import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export class Entity<Props> {
  private _id: UniqueEntityID;
  protected props: Props;

  get id(): string {
    return this._id.toString();
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID();
  }
}
