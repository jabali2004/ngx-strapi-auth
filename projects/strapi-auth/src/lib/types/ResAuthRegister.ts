import { UserDTO } from './UserDTO';

export interface IResAuthRegister {
  jwt: string;
  user: UserDTO;
}
