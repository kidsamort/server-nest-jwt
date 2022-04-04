import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import { AuthResponse } from './dto/AuthResponse.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	login(
		@Body() userDto: AuthRequestDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<AuthResponse> {
		return this.authService.login(userDto, response);
	}

	@Post('/signup')
	async signUp(
		@Body() userDto: AuthRequestDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<AuthResponse> {
		return await this.authService.signUp(userDto, response);
	}
}
