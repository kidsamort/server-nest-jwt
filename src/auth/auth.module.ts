import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from './token/token.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [UserModule, TokenModule],
	exports: [AuthService],
})
export class AuthModule {}
