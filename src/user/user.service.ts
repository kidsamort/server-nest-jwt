import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(User) private userRepository: typeof User) {}

	async createUser(userDto: CreateUserDto): Promise<User> {
		return await this.userRepository.create(userDto);
	}

	async getUserByEmail(email: string): Promise<User> {
		return await this.userRepository.findOne({ where: { email } });
	}

	async getAllUsers(): Promise<User[]> {
		return await this.userRepository.findAll({ include: { all: true } });
	}
}
