import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class PlaylistEntity {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column({ type: 'varchar', length: 120})
    public name: string

    @Column({ type: 'varchar'})
    public query: string
}
