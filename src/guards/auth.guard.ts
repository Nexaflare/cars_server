import { CanActivate, ExecutionContext } from '@nestjs/common'

// *** Comment: CanActivate is an interface similar to Interceptors  to make sure we define all the functions to the class so that it will behave as a guard correctly.
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		//*** Comment: ExecutionContext is similar to a request coming into in HTTP-based application. The reason it is needed is because we might use it with different communication protocols ***//
		const request = context.switchToHttp().getRequest()

		return request.session.userId
		//*** Comment: If userId exists, guard will allow the access across the app. If not, guard will block the access.
	}
}
