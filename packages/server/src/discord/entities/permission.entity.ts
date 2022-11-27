import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column({ type: 'varchar', unique: true})
    public name: string
}
