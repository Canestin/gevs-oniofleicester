import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Test if the request can hit the route handler,
 * using our Passport jwt authentication strategy
 *
 * @see JwtStrategy
 * @see https://github.com/mikenicholson/passport-jwt
 * @see https://docs.nestjs.com/guards
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
