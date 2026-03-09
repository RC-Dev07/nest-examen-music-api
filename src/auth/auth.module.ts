import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ArtistsModule } from '../artists/artists.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants/jwt.constant';

@Module({
  imports: [ArtistsModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }