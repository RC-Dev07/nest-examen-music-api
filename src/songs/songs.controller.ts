import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateSongDto } from './dto/create-song.dto';
import { SongResponseDto } from './dto/response/song-response.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

@Auth()
@ApiBearerAuth()
@ApiTags('Canciones Controller')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva canción' })
  @ApiResponse({
    status: 201,
    description: 'Canción creada correctamente',
    type: SongResponseDto
  })
  create(@Body() createSongDto: CreateSongDto, @Req() req: Request) {
    const user = req['user'];
    return this.songsService.create(createSongDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos canciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de canciones',
    type: SongResponseDto,
    isArray: true
  })
  findAll(@Req() req: Request) {
    const user = req['user'];
    return this.songsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una canción por id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Canción encontrada',
    type: SongResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una canción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la canción',
    example: 16
  })
  @ApiResponse({
    status: 200,
    description: 'Canción actualizada correctamente',
    type: SongResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para modificar esta canción'
  })
  @ApiResponse({
    status: 404,
    description: 'La canción o el artista no existe'
  })
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto, @Req() req: Request) {
    const user = req['user'];
    return this.songsService.update(+id, updateSongDto, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una canción'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la canción',
    example: 16
  })
  @ApiResponse({
    status: 200,
    description: 'Canción eliminada correctamente',
    schema: {
      example: {
        message: 'La canción fue eliminada correctamente'
      }
    }
  })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return this.songsService.remove(+id, user);
  }
}
