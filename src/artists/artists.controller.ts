import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Rol } from 'src/auth/enums/rol.enum';
import { ArtistsService } from './artists.service';
import { ArtistResponseDto } from './dto/response/artist-response.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@ApiBearerAuth()
@ApiTags('Artistas Controller')
@Controller('artists')
export class ArtistsController {

  constructor(private readonly artistsService: ArtistsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo artista' })
  @ApiResponse({
    status: 201,
    description: 'Artista creado correctamente',
    type: ArtistResponseDto
  })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  @Auth() // Todos autenticados pueden acceder a este endpoint
  @ApiOperation({ summary: 'Obtener todos los artistas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de artistas',
    type: ArtistResponseDto,
    isArray: true
  })
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Obtener un artista por id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Artista encontrado',
    type: ArtistResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(+id);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Actualizar un artista' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Artista actualizado',
    type: ArtistResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos'
  })
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto, @Req() req: Request) {
    const user = req['user'];
    return this.artistsService.update(+id, updateArtistDto, user);
  }

  @Delete(':id')
  @Auth(Rol.ADMIN)  // Solo los admin pueden eliminar artistas
  @ApiOperation({ summary: 'Eliminar un artista' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Artista eliminado',
    schema: {
      example: {
        message: 'El artista eliminado correctamente'
      }
    }
  })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return this.artistsService.remove(+id, user);
  }
}