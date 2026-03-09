import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { Rol } from "../../auth/enums/rol.enum";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class CreateArtistDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio y no debe estar vacío' })
    nombre: string;

    @ApiProperty({ example: 'john.doe@gmail.com' })
    @IsEmail({}, { message: 'El email no tiene un formato válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email: string;

    @ApiProperty({ example: 'Estados Unidos' })
    @IsString({ message: 'El país debe ser texto' })
    @IsNotEmpty({ message: 'El país es obligatorio' })
    pais: string;

    @ApiProperty({
        enum: Rol,
        example: Rol.ARTIST
    })
    @IsEnum(Rol, { message: `El rol debe ser uno de los siguientes: ${Object.values(Rol).join(', ')}` })
    rol?: Rol;

    @ApiProperty({ example: 'Rock' })
    @IsString({ message: 'El género debe ser texto' })
    @IsNotEmpty({ message: 'El género es obligatorio' })
    genero: string;

    @ApiProperty({ example: 1990 })
    @IsNumber({}, { message: 'El año de debut debe ser un número' })
    anioDebut: number;

    @ApiProperty({ example: 'password123456'})
    @IsString({ message: 'La contraseña debe ser texto' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Transform(({ value }) => value.trim())
    password: string;
}