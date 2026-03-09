import { Rol } from '../enums/rol.enum';

export interface JwtPayload {
    id: number;
    email: string;
    rol: Rol;
}