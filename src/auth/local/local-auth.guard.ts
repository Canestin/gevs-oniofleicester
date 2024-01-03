import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Test if the request can hit the route handler,
 * using our Passport local authentication strategy
 *
 * @see LocalStrategy
 * @see https://docs.nestjs.com/guards
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
