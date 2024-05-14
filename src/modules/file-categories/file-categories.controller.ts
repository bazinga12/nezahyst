import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { FileCategoriesService } from './file-categories.service';
import { RolesGuard } from 'guards/roles.guard';
import { FileCategoryDTO } from './file-category.dto';


@Controller('file-categories')
export class FileCategoriesController {
    constructor(private fileCategoriesService:FileCategoriesService){}

    @Get()
    getFileCategories(@Query("parentId") parentId:string | undefined){
        return this.fileCategoriesService.getCategories(parentId)
    }

    @Post()
    createFileCategory(@Body() body:FileCategoryDTO, @Query('parentId') parentId:string | undefined){
        return this.fileCategoriesService.createFileCategory(body, parentId)
    }

    @Delete()
    deleteFileCategory(@Query("id") id:string){
        return this.fileCategoriesService.deleteFileCategory(id)
    }

    @Patch()
    updateFileCategory(@Query("id") id:string, @Body() body:Partial<FileCategoryDTO>){
        return this.fileCategoriesService.updateFileCategory(id, body)
    }

}
