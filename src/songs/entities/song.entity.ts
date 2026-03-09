import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Artist } from "../../artists/entities/artist.entity";

@Entity()
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    duracion: number;

    @Column()
    album: string;

    @Column()
    anioLanzamiento: number;

    @Column()
    reproducciones: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Artist, artist => artist.songs)
    @JoinColumn({ name: 'artistaId' })
    artist: Artist;
}