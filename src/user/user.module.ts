import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.model';
import { Token } from 'src/auth/token/token.model';
import { TokenModule } from 'src/auth/token/token.module';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [forwardRef(() => TokenModule), SequelizeModule.forFeature([User, Token])],
	exports: [UserService],
})
export class UserModule {}
