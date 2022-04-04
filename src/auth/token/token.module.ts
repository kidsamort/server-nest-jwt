import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { UserModule } from 'src/user/user.module';
import { Token } from './token.model';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';

@Module({
	controllers: [TokenController],
	providers: [TokenService],
	imports: [
		forwardRef(() => UserModule),
		SequelizeModule.forFeature([User, Token]),
		JwtModule.register({}),
	],
	exports: [JwtModule, TokenService],
})
export class TokenModule {}
