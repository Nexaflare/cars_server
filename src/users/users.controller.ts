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
@Controller('auth')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		// console.log(body)
		this.usersService.create(body.email, body.password)
	}

	// Param is used to extract information from incoming request route
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/:id')
	async findUser(@Param('id') id: string) {
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
