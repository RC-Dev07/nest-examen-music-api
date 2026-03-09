import { applyDecorators, UseGuards } from "@nestjs/common";
import { Rol } from "../enums/rol.enum";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./role.decorator";

export function Auth(role?: Rol) {
    if (role) {
        return applyDecorators(
            Roles(role),
            UseGuards(AuthGuard, RolesGuard)
        );
    }
    return applyDecorators(UseGuards(AuthGuard));
}