import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from 'express';

import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { AuthResponse } from '../dto/AuthResponse.dto';
import { Token } from './token.model';

export interface jwtPayload {
	id: number;
	email: string;
	name: string;
}
export interface IToken {
	accessToken: string;
	refreshToken: string;
}

@Injectable()
export class TokenService {
	constructor(
		@InjectModel(Token) private tokenRepository: typeof Token,
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	// TODO: Усложнить paylod
	createToken(user: User): IToken {
		const payload = { id: user.id, email: user.email, name: user.name };

		const accessToken = this.jwtService.sign(payload, {
			secret: process.env.JWT_ACCES_SECRET,
			expiresIn: '15m',
		});

		const refreshToken = this.jwtService.sign(payload, {
			secret: process.env.JWT_REFRESH_SECRET,
			expiresIn: '7d',
		});

		return { accessToken, refreshToken };
	}

	async saveToken(userId, token): Promise<Token> {
		const { refreshToken, accessToken } = token;
		const tokenData = await this.tokenRepository.findOne({ where: { refreshToken } });
		if (!tokenData) {
			return await this.tokenRepository.create({
				userId: userId,
				refreshToken: refreshToken,
				accessToken: accessToken,
			});
		}
		return tokenData;
	}

	async getAllTokenByUserId(userId: number): Promise<Token[]> {
		return await this.tokenRepository.findAll({ where: { userId } });
	}

	async removeToken(refreshToken): Promise<number> {
		return this.tokenRepository.destroy({ where: { refreshToken } });
	}

	async findRefreshToken(refreshToken): Promise<Token> {
		return await this.tokenRepository.findOne({ where: { refreshToken } });
	}
	async findAccessToken(accessToken): Promise<Token> {
		return await this.tokenRepository.findOne({ where: { accessToken } });
	}
	async cleanExpiredToken(userId): Promise<void> {
		const allToken = await this.getAllTokenByUserId(userId);
		allToken.map((token) => {
			!this.validateRefreshToken(token.refreshToken) && this.removeToken(token.refreshToken);
		});
	}

	validateAccessToken(token): jwtPayload | null {
		try {
			const userData = this.jwtService.verify<jwtPayload>(token, {
				secret: process.env.JWT_ACCES_SECRET,
			});
			return userData;
		} catch (e) {
			return null;
		}
	}
	validateRefreshToken(refreshToken): jwtPayload | null {
		try {
			const userData = this.jwtService.verify<jwtPayload>(refreshToken, {
				secret: process.env.JWT_REFRESH_SECRET,
			});

			return userData;
		} catch (e) {
			return null;
		}
	}

	async refresh(token, response: Response): Promise<AuthResponse> {
		if (!token) {
			throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
		}
		const userData = this.validateRefreshToken(token);
		if (!userData) {
			this.removeToken(token);
			throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
		}
		const tokenDb = this.findRefreshToken(token);
		if (!tokenDb) {
			throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
		}
		this.removeToken(token);
		const user = await this.userService.getUserByEmail(userData.email);
		const tokens = this.createToken(user);

		await this.saveToken(user.id, tokens);

		response.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return { name: user.name, email: user.email, accessToken: tokens.accessToken };
	}
}
