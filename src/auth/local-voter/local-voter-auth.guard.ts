import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Test if the request can hit the route handler,
 * using our Passport local authentication strategy
 *
 * @see LocalSellerStrategy
 * @see https://docs.nestjs.com/guards|NestJS
 */
@Injectable()
export class LocalVoterAuthGuard extends AuthGuard('local-voter') {}
