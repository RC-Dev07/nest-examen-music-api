import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { Rol } from './enums/rol.enum';
@ApiTags('Autenticación Controller')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Un endpoint para registrar solo artistas, ya que un artista registrado con rol ARTIST 
    // no puede registrar a administradores ni a otros artistas, solo puede registrar su propia cuenta
    @Post('register')
    @ApiOperation({ summary: 'Registrar un nuevo artista' })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado correctamente',
        type: RegisterResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'El email ya esta registrado'
    })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto, Rol.ARTIST);
    }

    // Un endpoint para registrar administradores, solo accesible para usuarios con rol ADMIN 
    // (Una admin puede registrar a otros admins)
    @Post('register-admin')
    @ApiOperation({ summary: 'Registrar un nuevo artista' })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado correctamente',
        type: RegisterResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'El email ya esta registrado'
    })
    @ApiOperation({ summary: 'Registrar un nuevo administrador' })
    createAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto, Rol.ADMIN);
    }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesion' })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        type: LoginResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Usuario o contraseña incorrectos'
    })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}