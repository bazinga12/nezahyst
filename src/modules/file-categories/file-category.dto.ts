import { IsOptional, IsString } from "class-validator";


export class FileCategoryDTO {
    @IsString()
    name:string

    @IsOptional()
    isVisible?:boolean
}
