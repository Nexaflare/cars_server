import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { NotFoundException } from '@nestjs/common'

describe('UsersController', () => {
	let controller: UsersController
	let fakeUsersService: Partial<UsersService>
	let fakeAuthService: Partial<AuthService>

	beforeEach(async () => {
		fakeUsersService = {
			findOne: (id: number) => {
				return Promise.resolve({
					id,
					email: 'asdf@asdf.com',
					password: 'asdf',
				} as User)
			},
			find: (email: string) => {
				return Promise.resolve([{ id: 1, email, password: 'asdf' } as User])
			},
			// remove: () => {},
			// update: () => {}
		}

		fakeAuthService = {
			// signup: () => {},
			// signin: () => {},
		}

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			//*** Comment: whenever 'UsersController' is created and we want to pass something to use for its users service dependency, it will return the object that we are putting together below rather than the actual copy of 'UsersService'
			providers: [
				{
					//*** Comment: Whenever we ask for 'UsersService, we will get data from 'fakeUsersService'
					provide: UsersService,
					useValue: fakeUsersService,
				},
				{
					provide: AuthService,
					useValue: fakeAuthService,
				},
			],
		}).compile()

		controller = module.get<UsersController>(UsersController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
	it('findAllUsers returns a list of users with the given email', async () => {
		const users = await controller.findAllUsers('asdf@asdf.com')
    	//*** Comment: to check the validity of the test, change the number in toEqual(1) and get an error when testing
		expect(users.length).toEqual(1)
		expect(users[0].email).toEqual('asdf@asdf.com')
	})

	it('findUser throws an error if user with given id is not found', async () => {
		fakeUsersService.findOne = () => null
		await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
	})
})
