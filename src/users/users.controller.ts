import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Param,
	Query,
	NotFoundException,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'

@Controller('auth')
@Serialize(UserDto)
// Can use @Serialize(UserDto) in any specific request if we want to c (if we have request handlers and we want to customize the response of each of them)
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService
		) {}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		// console.log(body)
		return this.authService.signup(body.email, body.password)
	}
	//							ClassSerializerInterceptor 2 lines below
	// Param is used to extract information from incoming request route
	@Get('/:id')
	async findUser(@Param('id') id: string) {
		console.log(`Handler is running`)
		const user = await this.usersService.findOne(parseInt(id))
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return user
	}

	@Get()
	findAllUsers(@Query('email') email: string) {
		return this.usersService.find(email)
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id))
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(parseInt(id), body)
	}
}

//********** DEPENDENCY INJECTION */
