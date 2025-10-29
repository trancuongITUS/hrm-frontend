/**
 * User model representing authenticated user data.
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    avatar?: string;
    roles: UserRole[];
    permissions?: string[];
    isActive: boolean;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User role enum for role-based access control.
 */
export enum UserRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
    HR = 'HR',
    GUEST = 'GUEST'
}

/**
 * User profile data for display purposes.
 */
export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar?: string;
    roles: UserRole[];
}

