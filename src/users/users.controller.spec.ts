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
			signin: (email: string, password: string) => {
				return Promise.resolve({ id: 1, email, password } as User)
			},
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


  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });


	it('findUser throws an error if user with given id is not found', async () => {
		fakeUsersService.findOne = () => null
		await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
	})

	it(' sign in, updates session object and returns user', async () => {
    //*** Comment: session userId is -10 because we need invalid value to make sure that it work the way we want it to work  if we got -10, it means we didn't update the session correctly, if we updated it correctly, we should get 1
		const session = {userId: -10}
		const user = await controller.signin(
			{ email: 'asdf@asdf.com', password: 'asdf' },
			session
		)

    //*** Comment: user.id is 1 because initially 'signin' method was initialized with that value above***//
    expect(user.id).toEqual(1)

    expect(session.userId).toEqual(1)
	})
})
