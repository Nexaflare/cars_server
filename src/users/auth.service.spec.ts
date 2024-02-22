import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common';

//*** Comment: All tests related to AuthService are defined inside the callback function provided to describe. Organizes the test into categories or tests component in isolation***///
describe('AuthService', () => {
	let service: AuthService
	let fakeUsersService: Partial<UsersService>

	//*** Comment: Runs some setup code before each test in the enclosing describe block is executed. Ensures that tests do not affect each other and are isolated. ***//
	beforeEach(async () => {
		// Create a fake copy of the user service
		 fakeUsersService = {
			find: () => Promise.resolve([]),
			create: (email: string, password: string) =>
				Promise.resolve({ id: 1, email, password } as User),
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
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	})

	it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
 
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
	it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

})
