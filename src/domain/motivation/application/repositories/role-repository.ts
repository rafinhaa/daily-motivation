import { Role } from "@motivation/enterprise/entities/role";

export interface RoleRepository {
  getRoleByType(type: string): Promise<Role>;
}
