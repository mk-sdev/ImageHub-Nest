import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { AuthGuard } from './auth.guard';
import { GqlGuard } from './gql.guard';

export const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 15, // 15 minutes
};

export const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60, // 1 hour
};

// access jwt lifespan
export const access_jwt_lifespan = '15m';
// refresh jwt lifespan
export const refresh_jwt_lifespan = '1h';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthGuard, GqlGuard],
  exports: [JwtModule, AuthGuard, GqlGuard],
})
export class AuthModule {}
