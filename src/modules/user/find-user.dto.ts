import {
    Length,
    ValidateNested,
    IsString,
    IsEmail,
    IsBoolean,
    IsOptional,
    IsNumber,
    IsNotEmpty,
    IsEnum,
  } from 'class-validator';
  import { Type } from 'class-transformer';
import { UserStatus } from './base-user.entity';

export enum SortValue {
    ASC = 'ASC',
    DESC = 'DESC',
  }
  
  class FiltersDTO {
    @IsOptional()
    @Length(4, 20)
    firstName?: string;
  
    @IsOptional()
    @Length(4, 20)
    lastName?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
  }
  
  class SortDTO {
    @IsOptional()
    @IsEnum(SortValue)
    firstName?: SortValue;
  
    @IsOptional()
    @IsEnum(SortValue)
    lastName?: SortValue;
  
    @IsOptional()
    @IsEnum(SortValue)
    email?: SortValue;

    @IsOptional()
    @IsEnum(SortValue)
    createdAt?:SortValue;
  }
  
  class FindUsersDTO {
    @ValidateNested()
    @Type(() => FiltersDTO)
    @IsOptional()
    filters?: FiltersDTO;
  
    @ValidateNested()
    @Type(() => SortDTO)
    @IsOptional()
    sort?: SortDTO;
  
    @IsString()
    @IsOptional()
    search?: FiltersDTO;
  
    @IsNotEmpty()
    @IsNumber()
    page: number;
  
    @IsNotEmpty()
    @IsNumber()
    perPage: number;
  }
  
  export default FindUsersDTO;
  