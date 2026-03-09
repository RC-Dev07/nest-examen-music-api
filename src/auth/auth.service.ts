import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ArtistsService } from '../artists/artists.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Rol } from './enums/rol.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly artistsService: ArtistsService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto, rolUser: Rol) {

        const { email } = registerDto;

        const existEmail = await this.artistsService.findOneByEmail(email);
        if (existEmail) throw new BadRequestException('El email ya está registrado');

        const artist = await this.artistsService.create({
            ...registerDto,
            rol: rolUser
        });

        return {
            nombre: artist.nombre,
            email: artist.email,
            rol: artist.rol
        };
    }

    async login({ email, password }: LoginDto) {
        const artistValidate = await this.artistsService.findOneByEmail(email);

        if (!artistValidate) throw new BadRequestException('Usuario no encontrado');

        const isPasswordValid = await bcrypt.compare(password, artistValidate.password);

        if (!isPasswordValid) throw new BadRequestException('Contraseña incorrecta');

        const payload = { id: artistValidate.id, email: artistValidate.email, rol: artistValidate.rol };
        const token = await this.jwtService.signAsync(payload);
        return {
            id: artistValidate.id,
            email: artistValidate.email,
            rol: artistValidate.rol,
            token
        };
    }
}