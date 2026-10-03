import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as open to unauthenticated callers. Everything else requires a valid token. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
