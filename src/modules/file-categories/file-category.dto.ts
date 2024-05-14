import { IsEnum, IsOptional, IsString } from "class-validator";
import { NetworkType } from "./file-categories.entity";


export class FileCategoryDTO {
    @IsEnum(NetworkType, {each:true})
    networkType:NetworkType[]

    @IsString()
    name:string

    @IsOptional()
    isVisible?:boolean
}
