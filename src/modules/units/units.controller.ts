import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';
import { RolesGuard } from 'guards/roles.guard';
import { UserRole } from 'modules/user';

@Controller('units')
export class UnitsController {
    constructor(private readonly unitsService:UnitsService){}

    @UseGuards(new RolesGuard([UserRole.ADMIN])) 
    @Get('/all-units')
    getAllUnits(){
        return this.unitsService.getAllUnits()
    }

    @UseGuards(new RolesGuard([UserRole.ADMIN, UserRole.USER, UserRole.VZKB]))
    @Get()
    getUnits(){
        return this.unitsService.getUnits()
    }

    @UseGuards(new RolesGuard([UserRole.ADMIN]))
    @Patch("/update-parent")
    updateUnitParent(@Body() body:{unitId:string, parentId:string}){
        return this.unitsService.updateParent(body.unitId, body.parentId)
    }

    @UseGuards(new RolesGuard([UserRole.ADMIN]))
    @Put("/visibility/")
    triggerVisibility(@Body() body:{units:string[]}){
        return this.unitsService.visibleTrigger(body.units[0])
    }

    @UseGuards(new RolesGuard([UserRole.ADMIN]))
    @Get("/load-units")
    loadUnits(){
        return this.unitsService.loadUnits()
    }
}
