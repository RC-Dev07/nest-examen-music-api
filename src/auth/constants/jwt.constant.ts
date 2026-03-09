export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'default secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
};