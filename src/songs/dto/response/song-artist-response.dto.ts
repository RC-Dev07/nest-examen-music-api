import { ApiProperty } from '@nestjs/swagger';

export class SongArtistResponseDto {

    @ApiProperty({ example: 14 })
    id: number;

    @ApiProperty({ example: 'John Doe Edit' })
    nombre: string;

    @ApiProperty({ example: 'Estados Unidos' })
    pais: string;

    @ApiProperty({ example: 'Rock' })
    genero: string;

    @ApiProperty({ example: 1990 })
    anioDebut: number;

}