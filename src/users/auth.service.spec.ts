import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'


//*** Comment: All tests related to AuthService are defined inside the callback function provided to describe. ***///
describe('AuthService', () => {

	let service: AuthService

	beforeEach(async () => {
		// Create a fake copy of the user service
		const fakeUserService: Partial<UsersService> = {
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
					useValue: fakeUserService,
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
		// successfully created a service and defined it in some way
	})
})
