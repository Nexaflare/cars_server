import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			// doesn't take properties that we are not expecting (see CreateUserDto imported to user.controller)
		})
	)
	await app.listen(3000)
}
bootstrap()
