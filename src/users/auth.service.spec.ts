import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'

it('can create an instance of auth service', async () => {
	// Create a fake copy of the user service

	const fakeUserService = {
		find: () => Promise.resolve([]),
		create: (email: string, password: string) =>
			Promise.resolve({ id: 1, email, password }),
	}
	const module = await Test.createTestingModule({
		providers: [
			AuthService,
			{
				provide: UsersService,
				useValue: fakeUserService,
			},
		],
	}).compile()

	const service = module.get(AuthService)
	// will throw an error for now

	expect(service).toBeDefined()
	// successfully created a service and defined it in some way
})
