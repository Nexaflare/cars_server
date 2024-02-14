import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Param,
	Query,
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
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
	@Get('/:id')
	findUser(@Param('id') id: string) {
		return this.usersService.findOne(parseInt(id))
	}

	@Get()
	findAllUsers(@Query('email') email: string) {
		return this.usersService.find(email)
	}
}

//********** DEPENDENCY INJECTION */
