import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Rol } from 'src/auth/enums/rol.enum';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {

  constructor(
    @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>
  ) { }

  private readonly artistSelect = [
    'artist.id',
    'artist.nombre',
    'artist.email',
    'artist.pais',
    'artist.genero',
    'artist.anioDebut',
    'artist.rol'
  ];

  // Hasear la contraseña antes de guardar el artista
  async create(createArtistDto: CreateArtistDto) {
    if (createArtistDto.password) {
      createArtistDto.password = await bcrypt.hash(createArtistDto.password, 10);
    }
    const newArtist = this.artistRepository.create(createArtistDto);
    const savedArtist = await this.artistRepository.save(newArtist);
    return await this.findOne(savedArtist.id);
  }

  async findAll() {
    return this.artistRepository
      .createQueryBuilder('artist')
      .select(this.artistSelect)
      .where('artist.deletedAt IS NULL')
      .getMany();
  }

  async findOne(id: number) {
    const artist = await this.artistRepository
      .createQueryBuilder('artist')
      .select(this.artistSelect)
      .where('artist.id = :id', { id })
      .andWhere('artist.deletedAt IS NULL')
      .getOne();
    if (!artist) throw new NotFoundException(`El artista con el id ${id} no existe`)
    return artist;
  }

  async update(id: number, updateArtistDto: UpdateArtistDto, user: JwtPayload) {
    const artist = await this.findOne(id);
    // ARTIST solo puede actualizarse a si mismo
    if (user.rol === Rol.ARTIST && artist.id !== user.id) {
      throw new ForbiddenException('No puedes actualizar otros artistas');
    }

    // si envia password, se hashea antes de actualizar
    if (updateArtistDto.password) {
      updateArtistDto.password = await bcrypt.hash(updateArtistDto.password, 10);
    }

    const result = await this.artistRepository.update(id, updateArtistDto);
    if (result.affected === 0) throw new NotFoundException(`El artista con el id ${id} no existe`)
    return await this.findOne(id);
  }

  async remove(id: number, user: JwtPayload) {
    const artist = await this.findOne(id);
    // ARTIST solo puede eliminarse a si mismo
    if (user.rol === Rol.ARTIST && artist.id !== user.id) {
      throw new ForbiddenException('No puedes eliminar otros artistas');
    }
    const result = await this.artistRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException(`El artista con el id ${id} no existe`)
    return { message: `El artista eliminado correctamente` };
  }

  async findOneByEmail(email: string) {
    return this.artistRepository
      .createQueryBuilder('artist')
      .select(['artist.id', 'artist.email', 'artist.password', 'artist.rol'])
      .where('artist.email = :email', { email })
      .andWhere('artist.deletedAt IS NULL')
      .getOne();
  }
}