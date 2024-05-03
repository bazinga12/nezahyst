import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, NotContains } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  TableInheritance,
  BaseEntity
} from 'typeorm';
import { PasswordTransformer } from './password.transformer';


export enum UserStatus {
  New = 'new',
  Active = 'active',
  Blocked = 'blocked',
}

export type PhoneData = {
  phone: string;
  phone_type: string;
};

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  VKZB = 'Vkzb'
}


@Entity({
  name: 'base_user',
})
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class BaseUser extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: "varchar", default: "User" })
  type: "User" | "Admin";

  @Column({nullable: true})
  @Length(1, 100)
  firstName: string;

  @Column({nullable: true})
  @Length(1, 100)
  lastName: string;

  @Column({ default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @Column()
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  patronymic: string;

  @Column({ nullable: true })
  @IsOptional()
  unit: string;

  @Column({ nullable: true })
  @IsOptional()
  military_rank: string;

  @Column({ nullable: true })
  @IsOptional()
  phone: string;

  @Column({type: 'varchar', nullable: true})
  @IsOptional()
  phone_type: string;

  @Column({type: 'json', nullable: true})
  @IsOptional()
  phones: PhoneData[];

  @Column({type: 'boolean', nullable: true})
  @IsBoolean()
  is_email_verified: boolean;

  @Column({ type: 'varchar', nullable: true, default: UserStatus.New })
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;


  // @BeforeInsert()
  // hashPassword() {
  //   this.password = bcrypt.hashSync(this.password, 8);
  // }

  // checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
  //   return bcrypt.compareSync(unencryptedPassword, this.password);
  // }

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}

export class UserFillableFields {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
