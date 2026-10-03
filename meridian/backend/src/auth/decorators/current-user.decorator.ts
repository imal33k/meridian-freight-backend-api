import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Company, User } from '@prisma/client';

/** The database user attached to the request by SupabaseAuthGuard. */
export type RequestUser = User & {
  company: Company | null;
  /** From Supabase: has this account confirmed its email address? */
  emailVerified: boolean;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as RequestUser;
  },
);
export const OptionalCurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser | undefined => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as RequestUser | undefined;
  },
);