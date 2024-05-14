import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileCategory } from './file-categories.entity';
import { Repository } from 'typeorm';
import { FileCategoryDTO } from './file-category.dto';
import { HttpCode } from 'exceptions/app-error';

@Injectable()
export class FileCategoriesService {
    constructor(@InjectRepository(FileCategory) private readonly fileCategoryRepository:Repository<FileCategory>){}

    public async getCategories(parentId:string|undefined):Promise<FileCategory[]>{
        // if(parentId){
        //     return (await this.fileCategoryRepository.findOne({where:{id:parentId}, relations:['children']})).children
        // } else {
        //     return await this.fileCategoryRepository.find({where:{parent:null},relations:['parent', 'children']})
        // }
        return await this.fileCategoryRepository.find({relations:['parent']})
    }

    public async createFileCategory(body:FileCategoryDTO, parentId:string | undefined){
        let parent:FileCategory
        if(parentId){
            try {
                parent = await this.fileCategoryRepository.findOneOrFail(parentId)
            } catch(e){
                throw new NotFoundException({
                    HttpCode:HttpCode.NOT_FOUND,
                    description:"Батьківської категорії з даним айді не існує"
                })
            }
        }

        const category = this.fileCategoryRepository.create(body)
        if(parent){
            category.parent = parent
        }

        return await this.fileCategoryRepository.save(category)
    }

    public async deleteFileCategory(id:string){
       await this.fileCategoryRepository.createQueryBuilder()
       .delete()
       .from(FileCategory)
       .where("id = :id", { id })
       .execute()
       return "Категорію успішно видалено"
    }

    public async updateFileCategory(id:string, body:Partial<FileCategoryDTO>){
        try {
            const category = await this.fileCategoryRepository.findOneOrFail({where:{id}, relations:['children']})
            const {isVisible, ...rest} = body
            if(typeof isVisible === "boolean"){
                category.isPermanentVisible = isVisible
                category.isVisible = isVisible
                category.children = await Promise.all(category.children.map(async(c)=> await this.recursiveVisibility(c.id, isVisible)))
            }
            Object.entries(rest).forEach(([key, value])=>{
                category[key] = value
            })
            await this.fileCategoryRepository.save(category)
        } catch(e){
            throw new NotFoundException({
                HttpCode:HttpCode.NOT_FOUND,
                description:"Вказаної категорії не існує"
            })
        }
    }

    private async recursiveVisibility(id:string, isVisible:boolean){
        const category = await this.fileCategoryRepository.findOneOrFail({where:{id}, relations:['children']})
        category.isVisible = isVisible
        if(category.children){
            category.children = await Promise.all(category.children.map((c)=>this.recursiveVisibility(c.id, isVisible)))   
        }

        return await this.fileCategoryRepository.save(category)
    }
}
