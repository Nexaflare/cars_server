import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const cookieSession = require('cookie-session');

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = new DocumentBuilder()
    .setTitle('Cars server')
    .setDescription('The cars API description')
    .setVersion('1.0')
    .addTag('cars')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

	app.use(cookieSession({
		keys: ['aleksey']
	})) 
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			//*** Comment: doesn't take properties that we are not expecting (see CreateUserDto imported to user.controller) ***//
		})
	)
	await app.listen(3000)
}
bootstrap()
