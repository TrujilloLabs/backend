import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret',
        });
    }

    async validate(payload: any) {
        // payload: { sub: user_id, email, role, store_id? }
        return { userId: payload.sub, email: payload.email, role: payload.role, store_id: payload.store_id };
    }
}
