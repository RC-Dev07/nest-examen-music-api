import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '../../enums/rol.enum';

export class RegisterResponseDto {

    @ApiProperty({ example: 'Rodrigo' })
    nombre: string;

    @ApiProperty({ example: 'rodrigo@gmail.com' })
    email: string;

    @ApiProperty({
        enum: Rol,
        example: Rol.ARTIST
    })
    rol: Rol;
}