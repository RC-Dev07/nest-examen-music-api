import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Song } from "../../songs/entities/song.entity";
import { Rol } from "../../auth/enums/rol.enum";

@Entity()
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    nombre: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    pais: string;

    @Column()
    genero: string;

    @Column()
    anioDebut: number;

    @Column({
        type: 'enum',
        enum: Rol,
        default: Rol.ARTIST
    })
    rol: string;

    @Column({ nullable: false, length: 255 })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Song, song => song.artist)
    songs: Song[];
}