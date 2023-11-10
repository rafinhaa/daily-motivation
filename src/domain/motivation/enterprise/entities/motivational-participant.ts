import { Entity } from "@core/entities/entity";
import { DateAt, Optional } from "@core/types";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { Role } from "./role";

export interface MotivationalParticipantProps extends DateAt {
  surname: string;
  email: string;
  password: string;
  role: Role;
}

export class MotivationalParticipant extends Entity<MotivationalParticipantProps> {
  get surname(): string {
    return this.props.surname;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  set role(role: Role) {
    this.props.role = role;
    this.touch();
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

  isAdmin(): boolean {
    return this.role.type === "admin";
  }

  hasPermissionToPromoteToModerator(): boolean {
    return this.role.type === "admin" || this.role.type === "moderator";
  }

  getOffice() {
    return this.role.type;
  }

  promoteToModerator() {
    this.role = Role.create({
      type: "moderator",
    });
    this.touch();
  }

  static create(
    props: Optional<MotivationalParticipantProps, "createdAt" | "role">,
    id?: UniqueEntityID,
  ) {
    const role =
      props.role ||
      Role.create({
        type: "member",
      });
    const createdAt = props.createdAt || new Date();

    return new MotivationalParticipant({ ...props, createdAt, role }, id);
  }
}
