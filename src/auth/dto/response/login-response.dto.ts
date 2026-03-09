import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '../../enums/rol.enum';

export class LoginResponseDto {

    @ApiProperty({ example: 6 })
    id: number;

    @ApiProperty({ example: 'admin@gmail.com' })
    email: string;

    @ApiProperty({ example: Rol.ADMIN })
    rol: Rol;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    token: string;

}