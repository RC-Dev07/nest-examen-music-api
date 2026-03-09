import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/role.decorator";
import { Rol } from "../enums/rol.enum";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<Rol>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        
        if (!requiredRole) {
            return true;
        }
        
        const { user } = context.switchToHttp().getRequest();
        
        if (!user) {
            return false;
        }
        
        return user.rol === requiredRole;
    }
}