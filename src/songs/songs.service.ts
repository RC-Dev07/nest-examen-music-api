import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistsService } from '.././artists/artists.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Rol } from 'src/auth/enums/rol.enum';

@Injectable()
export class SongsService {

  constructor(
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
    private readonly artistsService: ArtistsService
  ) { }

  private readonly songSelect = [
    'song.id',
    'song.titulo',
    'song.duracion',
    'song.album',
    'song.anioLanzamiento',
    'song.reproducciones',

    'artist.id',
    'artist.nombre',
    'artist.pais',
    'artist.genero',
    'artist.anioDebut',
  ]

  async create(createSongDto: CreateSongDto, user: JwtPayload) {
    // El artista solo puede crear canciones para sí mismo, a menos que sea admin
    if (user.rol === Rol.ARTIST && createSongDto.artistaId) {
      throw new ForbiddenException('Solo el admin puede asignar canciones a otros artistas');
    }

    const artistaId = user.rol === Rol.ADMIN ? createSongDto.artistaId : user.id;

    if (user.rol === Rol.ADMIN && !artistaId) {
      throw new BadRequestException('artistId es requerido para admin');
    }

    const { artistaId: _, ...data } = createSongDto;

    const newSong = this.songRepository.create({
      ...data,
      artist: { id: artistaId }
    });
    const savedSong = await this.songRepository.save(newSong);
    return await this.findOne(savedSong.id);
  }

  async findAll(user: JwtPayload) {
    const query = this.songRepository
      .createQueryBuilder('song')
      .leftJoin('song.artist', 'artist')
      .select(this.songSelect)
      .where('song.deletedAt IS NULL');

    if (user.rol !== Rol.ADMIN) {
      query.andWhere('artist.id = :id', { id: user.id });
    }
    return query.getMany();
  }

  async findOne(id: number) {
    const song = await this.songRepository
      .createQueryBuilder('song')
      .select(this.songSelect)
      .leftJoin('song.artist', 'artist')
      .where('song.id = :id', { id })
      .andWhere('song.deletedAt IS NULL')
      .getOne();
    if (!song) throw new NotFoundException(`La canción con el id ${id} no existe`);
    return song;
  }

  async update(id: number, updateSongDto: UpdateSongDto, user: JwtPayload) {
    // El artista solo puede editar sus propias canciones para sí mismo, a menos que sea admin
    const songExists = await this.songRepository.findOne({
      where: { id },
      relations: ['artist']
    });

    if (!songExists) {
      throw new NotFoundException(`La canción con el id ${id} no existe`);
    }

    if (user.rol === Rol.ARTIST && songExists.artist.id !== user.id) {
      throw new ForbiddenException('No puedes modificar canciones de otros artistas');
    }

    if (user.rol === Rol.ARTIST && updateSongDto.artistaId) {
      throw new ForbiddenException('Solo el admin puede reasignar canciones a otro artista');
    }

    const updateData: any = { ...updateSongDto };

    if (user.rol === Rol.ADMIN && updateSongDto.artistaId) {

      const artistExists = await this.artistsService.findOne(updateSongDto.artistaId);

      if (!artistExists) {
        throw new NotFoundException(
          `El artista con el id ${updateSongDto.artistaId} no existe`
        );
      }

      updateData.artist = { id: updateSongDto.artistaId };
      delete updateData.artistaId;
    }
    await this.songRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number, user: JwtPayload) {
    const songExists = await this.songRepository.findOne({
      where: { id },
      relations: ['artist']
    });

    if (!songExists) {
      throw new NotFoundException(`La canción con el id ${id} no existe`);
    }
    // Artist solo puede borrar sus canciones
    if (user.rol === Rol.ARTIST && songExists.artist.id !== user.id) {
      throw new ForbiddenException('No puedes eliminar canciones de otros artistas');
    }
    await this.songRepository.softDelete(id);

    return { message: `La canción fue eliminada correctamente` };
  }
}