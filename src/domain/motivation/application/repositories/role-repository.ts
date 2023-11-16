import { Role } from "@motivation/enterprise/entities/value-objects/role";

export interface RoleRepository {
  getRoleByType(type: string): Promise<Role>;
}
