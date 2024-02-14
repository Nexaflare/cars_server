import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createUser(body: CreateUserDto): void;
}
