import { ApiProperty } from '@nestjs/swagger';
import { SongArtistResponseDto } from './song-artist-response.dto';

export class SongResponseDto {

    @ApiProperty({ example: '15'})
    id: number;

    @ApiProperty({ example: 'Dreams of the City' })
    titulo: string;

    @ApiProperty({ example: 215 })
    duracion: number;

    @ApiProperty({ example: 'Midnight Echoes' })
    album: string;

    @ApiProperty({ example: 2022 })
    anioLanzamiento: number;

    @ApiProperty({ example: 1542300 })
    reproducciones: number;

    @ApiProperty({ type: SongArtistResponseDto })
    artist: SongArtistResponseDto;
}