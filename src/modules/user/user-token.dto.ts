import { UserRole } from './base-user.entity';

interface UserTokenDTO {
  id: string;
  role: UserRole;
  email:string
}

export default UserTokenDTO;
