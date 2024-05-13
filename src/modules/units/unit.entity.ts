import { IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, TableInheritance, Unique, UpdateDateColumn } from "typeorm";

@Entity("unit")
@TableInheritance({column:{type:"varchar", name:"type"}})
export class Unit extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid:string;

    @Column({type:"varchar"})
    id:string

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @Column({type:'boolean', default: false})
    isVisible:boolean

    @Column({type:'boolean', default: false})
    isPermanentVisible:boolean

    @Column({type:"varchar"})
    name:string

    @IsOptional()
    @ManyToOne(() => Unit, unit => unit.children, {cascade:["update"]})
    @JoinColumn({ name: 'parent_id' })
    parent: Unit

    @IsOptional()
    @OneToMany(() => Unit, unit => unit.parent, {cascade:["update"]})
    @JoinTable({name:'children_id'})
    children: Unit[];
}