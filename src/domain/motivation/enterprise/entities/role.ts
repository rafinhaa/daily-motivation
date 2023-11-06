import { Entity } from "@core/entities/entity";
import { DateAt, Optional } from "@core/types";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

type RoleType = "admin" | "moderator" | "member";

export interface RoleProps extends DateAt {
  type: RoleType;
}

export class Role extends Entity<RoleProps> {
  get type(): RoleType {
    return this.props.type;
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

  static create(props: Optional<RoleProps, "createdAt">, id?: UniqueEntityID) {
    return new Role({ ...props, createdAt: props.createdAt || new Date() }, id);
  }
}
