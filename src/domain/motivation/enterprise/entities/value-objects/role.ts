import { Entity } from "@core/entities/entity";
import { DateAt, Optional } from "@core/types";
import { RoleType } from "@core/types/role";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export interface RoleProps extends DateAt {
  type: keyof typeof RoleType;
}

export class Role extends Entity<RoleProps> {
  get type(): keyof typeof RoleType {
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

  static createMember() {
    return new Role({ createdAt: new Date(), type: RoleType.member });
  }

  static createModerator() {
    return new Role({ createdAt: new Date(), type: RoleType.moderator });
  }

  static createAdmin() {
    return new Role({ createdAt: new Date(), type: RoleType.admin });
  }
}
