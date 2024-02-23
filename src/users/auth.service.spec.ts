import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common'

//*** Comment: All tests related to AuthService are defined inside the callback function provided to describe. Organizes the test into categories or tests component in isolation***///
describe('AuthService', () => {
	let service: AuthService
	let fakeUsersService: Partial<UsersService>

	//*** Comment: Runs some setup code before each test in the enclosing describe block is executed. Ensures that tests do not affect each other and are isolated. ***//
	beforeEach(async () => {
		const users: User[] = []
		// Create a fake copy of the user service
		fakeUsersService = {
			find: (email: string) => {
				const filteredUsers = users.filter((user) => user.email === email)
				return Promise.resolve(filteredUsers)
			},
			create: (email: string, password: string) => {
				const user = {
					id: Math.floor(Math.random() * 999999),
					email,
					password,
				} as User
				users.push(user)
				return Promise.resolve(user)
			},
		}
		const module = await Test.createTestingModule({
			//*** Comment: 'providers' is used for including classes that we want to use in our dependency injection ***//
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: fakeUsersService,
					//*** Comment: if anyone asks for a copy of 'UserService', then give them the value of 'fakeUserService' === { find, create} ***//
				},
			],
		}).compile()

		service = module.get(AuthService)
		// will throw an error for now
	})
	//*** Comment: Each 'it statement will test 1 aspect of the code ***//
	it('can create an instance of auth service', async () => {
		expect(service).toBeDefined()
		//*** Comment:  successfully created a service and defined it in some way ***//
	})

	it('creates a new user with salted and hashed password', async () => {
		const user = await service.signup('asdf@asdf.com', 'asdf')

		expect(user.password).not.toEqual('asdf')
		const [salt, hash] = user.password.split('.')
		expect(salt).toBeDefined()
		expect(hash).toBeDefined()
	})

	it('throws an error if user signs up with email that is in use', async () => {
		//*** Comment: calling the signup service directly rather than customizing the find() method*/
 
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

	it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

	  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

	it('returns a user if correct password is provided', async () => {
		// fakeUsersService.find = () =>
		//   Promise.resolve([
		//     { email: 'asdf@asdf.com', password: 'abed87bb12211477.f8647e131518c8aef20a4a8b4c78a67cc0eab724918411ec3341cfb2a719a602' } as User,
		//   ]);
		await service.signup('asdf@asdf.com', 'myPassword')

		const user = await service.signin('asdf@asdf.com', 'myPassword')
		expect(user).toBeDefined()
		//*** Comment: the code below is necessary to get the hashed string(password) when user signs up o check the validity of the user password when they sign in ***//
		// const user = await service.signup('asdf@asdf.com', 'myPassword')
		// console.log(user)
	})
})
