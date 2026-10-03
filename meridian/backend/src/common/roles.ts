import { UserRole } from '@prisma/client';

/** Roles allowed to use the admin dashboard endpoints. */
export const STAFF_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.STAFF];
