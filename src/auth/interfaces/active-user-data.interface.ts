import { RoleType } from '../enums/role-types.enum';

export interface ActiveUserData {
  sub: string;
  email: string;
  role: RoleType;
}
