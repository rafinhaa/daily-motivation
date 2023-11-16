import { RoleRepository } from "@motivation/application/repositories/role-repository";
import { Role } from "@motivation/enterprise/entities/value-objects/role";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export class InMemoryRoleRepository implements RoleRepository {
  private roles: Role[] = [
    Role.create(
      {
        type: "admin",
        createdAt: new Date(),
      },
      new UniqueEntityID("1"),
    ),
    Role.create(
      {
        type: "moderator",
        createdAt: new Date(),
      },
      new UniqueEntityID("2"),
    ),
    Role.create(
      {
        type: "member",
        createdAt: new Date(),
      },
      new UniqueEntityID("3"),
    ),
  ];

  getRoleByType(type: string): Promise<Role> {
    return Promise.resolve(this.roles.find((role) => role.type === type)!);
  }
}
