import { Body, Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthResponse } from '../dto/AuthResponse.dto';
import { RefreshReqToken } from './dto/refreshReqToken.dto';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
	constructor(private tokenServicee: TokenService) {}

	@Get('/refresh')
	refresh(
		@Body() token: RefreshReqToken,
		@Res({ passthrough: true }) response: Response,
	): Promise<AuthResponse> {
		return this.tokenServicee.refresh(token.refreshToken, response);
	}
}
