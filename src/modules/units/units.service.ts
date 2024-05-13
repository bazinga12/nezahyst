import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from './unit.entity';
import { Repository } from 'typeorm';
import { HttpCode } from 'exceptions/app-error';
const csv = require("csvtojson")

const CSV_FILE_PATH = "src/modules/units/units.csv"

@Injectable()
export class UnitsService {
    constructor(
        @InjectRepository(Unit) private readonly unitRepository:Repository<Unit>
    ){}

    async getUnits(){
        const res = await this.unitRepository.find({ relations: ['children', 'parent'], where: {
            isVisible: true,
            isPermanentVisible:true
        }})
        return res.map((u)=>this.recursiveHide(u))
    }

    async getAllUnits(){
       return await this.unitRepository.find({relations:['children', 'parent']})
    }

    async visibleTrigger(unitId:string) {
        const unit = await this.unitRepository.findOne(unitId, {relations:['children']})
        if(!unit){
            throw new NotFoundException({
                HttpCode:HttpCode.NOT_FOUND,
                description:"Зазначеного підрозділу не існує"
            })
        }
        unit.isPermanentVisible = !unit.isPermanentVisible
        this.recursiveTrigger(unit, !unit.isVisible)
        return await this.unitRepository.save(unit)
    }

    private  recursiveTrigger(unit:Unit, trigger:boolean){
        unit.isVisible = trigger
        if(unit.children){
            unit.children = unit.children.map((u)=> this.recursiveTrigger(u,trigger))
        }
        return unit
    }

    private recursiveHide(unit:Unit):Unit{
        if(unit.children) {
            const filteredChildrens =  unit.children.filter((u)=>u.isPermanentVisible)
            unit.children = filteredChildrens.map((u)=>this.recursiveHide(u))
        }
        return unit
    }

    async updateParent(unitId:string, parentId:string){
        const unit = await this.unitRepository.findOne({where:{id:unitId}, relations:['parent']})
        const parent = await this.unitRepository.findOne({where: {id:parentId}})

        if(!unit){
            throw new NotFoundException({
                HttpCode:HttpCode.NOT_FOUND,
                description:"Зазначеного підрозділу не існує"
            })
        }

        if(!parent){
            throw new NotFoundException({
                HttpCode:HttpCode.NOT_FOUND,
                description:"Зазначеного батьківського підрозділу не існує"
            })
        }
        
        unit.parent = parent
        return await this.unitRepository.save(unit)
    }

    async loadUnits(){
        const jsonArray = await csv().fromFile(CSV_FILE_PATH);
        for(let u of jsonArray){
            const parent = await this.unitRepository.findOne({ relations: ['children'], where:{
                id:u.parent_id
            }});
            const unit = this.unitRepository.create({id:u.group_id,name:u.group_name})
            unit.parent = parent
            await this.unitRepository.save(unit)
        }
    }

}
