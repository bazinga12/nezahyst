import { 
    Entity, 
    Column, 
    ManyToOne,
    RelationId,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
  } from 'typeorm';
  
  import {
    Length,
    IsEmail,
    IsNumberString,
  } from 'class-validator';
  
  import { User } from './user.entity';
  
  
  @Entity('verification')
  export class Verification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    @IsEmail(undefined, { message: 'Invalid email' })
    email: string;
  
    @Column()
    @Length(6)
    @IsNumberString()
    code: string;
  
    @ManyToOne(() => User, {onDelete: "CASCADE"})
    user: User;
  
    @RelationId((verification: Verification) => verification.user)
    userId: string;
  
    @Column({type: 'boolean', nullable: true})
    isConfirmed: boolean
  }
  