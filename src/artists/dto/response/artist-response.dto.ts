import { ApiProperty } from '@nestjs/swagger';
import { Rol } from 'src/auth/enums/rol.enum';

export class ArtistResponseDto {

    @ApiProperty({ example: 14 })
    id: number;

    @ApiProperty({ example: 'John Doe' })
    nombre: string;

    @ApiProperty({ example: 'john.doe@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Estados Unidos' })
    pais: string;

    @ApiProperty({ example: 'Rock' })
    genero: string;

    @ApiProperty({ example: 1990 })
    anioDebut: number;

    @ApiProperty({ example: Rol.ARTIST })
    rol: Rol;
}