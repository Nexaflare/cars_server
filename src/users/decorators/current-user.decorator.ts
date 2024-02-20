import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
	(data: never, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		return request.currentUser 
	}
)

//*** Comment: can't use dependency injection with param decorator. interceptor solves this problem  *//
