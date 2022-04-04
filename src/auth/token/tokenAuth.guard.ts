import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private tokenService: TokenService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest();
		try {
			const authHeader = req.headers.authorization;
			const bearer = authHeader.split(' ')[0];
			const token = authHeader.split(' ')[1];

			if (bearer !== 'Bearer' || !token) {
				throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
			}

			const user = this.jwtService.verify(token, { secret: process.env.JWT_ACCES_SECRET });
			const tokenDb = this.tokenService.findAccessToken(token);
			if (!tokenDb) {
				throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
			}
			req.user = user;
			return true;
		} catch (e) {
			console.log(e);

			throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
		}
	}
}
