import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm'
import {PermissionEntity} from './permission.entity'

@Entity()
export class RoleEntity {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column({ type: 'varchar'})
    public discordId: string

    @ManyToMany(() => PermissionEntity)
    @JoinTable()
    public permissions: PermissionEntity
}
