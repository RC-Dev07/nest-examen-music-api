import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateSongDto {
    @ApiProperty({ example: 'Dreams of the City' })
    @IsString({ message: 'El titulo debe ser un texto' })
    @IsNotEmpty({ message: 'El titulo es obligatorio y no debe estar vacío' })
    titulo: string;

    @ApiProperty({ example: 215 })
    @Type(() => Number)
    @IsNumber({}, { message: 'La duración debe ser un número' })
    @Min(1, { message: 'La duración debe ser mayor a 0' })
    duracion: number;

    @ApiProperty({ example: 'Midnight Echoes' })
    @IsString({ message: 'El album debe ser un texto' })
    @IsNotEmpty({ message: 'El album es obligatorio' })
    album: string;

    @ApiProperty({ example: 2022 })
    @IsNumber({}, { message: 'El año de lanzamiento debe ser un número' })
    anioLanzamiento: number;

    @ApiProperty({ example: 1542300 })
    @Type(() => Number)
    @IsNumber({}, { message: 'Las reproducciones deben ser un número' })
    @IsNotEmpty({ message: 'Las reproducciones son obligatorias y no deben estar vacías' })
    reproducciones: number;

    @Type(() => Number)
    @IsOptional()
    artistaId?: number;
}