import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import { AuthResponse } from './dto/AuthResponse.dto';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './token/token.service';
import { User } from 'src/user/user.model';
import { Response } from 'express';

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private tokenService: TokenService) {}

	async signUp(userDto: AuthRequestDto, response: Response): Promise<AuthResponse> {
		const candidat = await this.userService.getUserByEmail(userDto.email);
		if (candidat) {
			throw new HttpException('Почта уже используется', HttpStatus.BAD_REQUEST);
		}
		const hashPassword = await bcrypt.hash(userDto.password, 5);
		const user = await this.userService.createUser({ ...userDto, password: hashPassword });

		const token = this.tokenService.createToken(user);
		const tokenDb = await this.tokenService.saveToken(user.id, token);
		response.cookie('refreshToken', token.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		console.log(response.cookie);

		return {
			email: userDto.email,
			name: userDto.name,
			accessToken: tokenDb.accessToken,
		};
	}

	async login(userDto: AuthRequestDto, response: Response): Promise<AuthResponse> {
		const user = await this.validateUser(userDto);
		this.tokenService.cleanExpiredToken(user.id);

		const token = this.tokenService.createToken(user);
		const tokenDB = await this.tokenService.saveToken(user.id, token);
		response.cookie('refreshToken', token.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return {
			name: user.name,
			email: user.email,
			accessToken: tokenDB.accessToken,
		};
	}

	private async validateUser(userDto: AuthRequestDto): Promise<User> {
		const user = await this.userService.getUserByEmail(userDto.email);
		const passwordEquals = await bcrypt.compare(userDto.password, user.password);

		if (user && passwordEquals) {
			return user;
		}
		throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
	}
}
