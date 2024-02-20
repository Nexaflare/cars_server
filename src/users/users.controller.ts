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
	Session,
	BadRequestException,
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'

@Controller('auth')
@Serialize(UserDto)
// Can use @Serialize(UserDto) in any specific request if we want to c (if we have request handlers and we want to customize the response of each of them)
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService
	) {}

	//***TESTING COOKIES***/
	// @Get('/colors/:color')
	// setColor(@Param('color') color: string, @Session() session: any) {
	// 	session.color = color
	// }

	// @Get('/colors')
	// getColor(@Session() session:any) {
	// 	return session.color;
	// }

	// @Get('/whoami')
	// async whoAmI(@Session() session: any) {
	// 	const user = await this.usersService.findOne(session.userId)
	// 	if(!session.userId) {
	// 		throw new BadRequestException('User not found')
	// 	}
	// 	return user
	// }


	@Get('/whoami')
	whoAmI(@CurrentUser() user: string) {
		return user
	}

	@Post('/signout')
	signOut(@Session() session: any) {
		session.userId = null
	}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: any) {
		// console.log(body)
		const user = await this.authService.signup(body.email, body.password)
		session.userId = user.id
		return user
	}

	@Post('/signin')
	async signin(@Body() body: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signin(body.email, body.password)
		session.userId = user.id
		return user
	}
	//							ClassSerializerInterceptor 3-4 lines below
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
