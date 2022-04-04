import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/token/tokenAuth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private usersService: UserService) {}

	@UseGuards(TokenAuthGuard)
	@Post()
	createUser(@Body() userDto: CreateUserDto): Promise<User[]> {
		return this.usersService.getAllUsers();
	}
}
