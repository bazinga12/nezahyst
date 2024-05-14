import { IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("file-category")
export class FileCategory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @Column({type:"boolean", default:false})
    isVisible:boolean

    @Column({type:"boolean", default:false})
    isPermanentVisible:boolean

    @Column({type:"varchar"})
    name:string

    @IsOptional()
    @ManyToOne(()=>FileCategory, fileCategory => fileCategory.children, {cascade:["update",], onDelete:"CASCADE"})
    @JoinColumn({name:"parent_id"})
    parent:FileCategory

    @IsOptional()
    @OneToMany(()=>FileCategory, fileCategory=>fileCategory.parent, {cascade:["update"]})
    @JoinTable({name:"children_id"})
    children:FileCategory[]
}