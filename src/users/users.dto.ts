import { User } from './users.entity';

export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;

  static fromEntity(user: User): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.email = user.email;
    dto.status = user.status;
    return dto;
  }
}