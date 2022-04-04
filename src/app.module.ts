import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { User } from './user/user.model';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './auth/token/token.module';
import { Token } from './auth/token/token.model';

@Module({
	controllers: [],
	providers: [],
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
		}),
		SequelizeModule.forRoot({
			dialect: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			dialectOptions: {
				ssl: {
					require: true,
					rejectUnauthorized: false,
				},
			},
			models: [User, Token],
			autoLoadModels: true,
		}),
		UserModule,
		TokenModule,
		AuthModule,
	],
})
export class AppModule {}
