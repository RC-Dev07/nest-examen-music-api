import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from '../artists/artists.module';
import { Artist } from '../artists/entities/artist.entity';
import { Song } from './entities/song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Artist]),
    ArtistsModule
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}