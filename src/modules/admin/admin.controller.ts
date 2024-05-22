import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'guards/roles.guard';


import { IGetUserAuthInfoRequest } from 'modules/email-confirmation/email-confirmation.controller';
import { UserRole } from 'modules/user';
import { AdminService } from './admin.service';


@UseGuards(new RolesGuard([UserRole.ADMIN]))
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService:AdminService
    ){}
    
    @Get()
    whoAmI(@Req() req: IGetUserAuthInfoRequest){
        return req.user
    }

    @Patch('/reset-password/:userId')
    resetUserPasswrod(@Param() params:{userId:string}){
        return this.adminService.resetPassword(params.userId)
    }

}
