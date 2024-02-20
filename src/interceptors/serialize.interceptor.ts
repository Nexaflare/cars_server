import {
	UseInterceptors,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'
// import { UserDto } from '../users/dtos/user.dto'
// implements

interface ClassConstructor {
	new (...args: any[]): {}
	//*** Comment: using ClassConstructor instead of any prevents errors from passing. if we use ClassConstructor and pass a string or a number in @Serialize('num/str') in user.controller, for example, it will throw an error ***//
}
export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto))
}
export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: any) {}
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		//*** Comment: Run something before a request is handled by the request handler ***//
		// console.log(`I'm running before the handler`, context)
		return handler.handle().pipe(
			map((data: any) => {
				//*** Comment: Run something before the response is sent out ***//
				// console.log(`I'm running before response is sent out`, data)
				return plainToClass(this.dto, data, {
					excludeExtraneousValues: true,
					//*** Comment: only going to share data that is marked with @Expose directive  the rest will be ignored ***//
				})
			})
		)
	}
}
