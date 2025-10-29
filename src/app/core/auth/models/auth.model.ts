import { User } from './user.model';

/**
 * Login credentials for authentication.
 */
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Authentication response from the server.
 */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    expiresIn: number; // Token expiration time in seconds
}

/**
 * Token refresh request.
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Token refresh response.
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * Authentication state.
 */
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

/**
 * Password reset request.
 */
export interface PasswordResetRequest {
    email: string;
}

/**
 * Password reset confirmation.
 */
export interface PasswordResetConfirmation {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Registration data.
 */
export interface RegistrationData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

/**
 * JWT token payload.
 */
export interface JwtPayload {
    sub: string; // User ID
    email: string;
    roles: string[];
    iat: number; // Issued at
    exp: number; // Expiration time
}

