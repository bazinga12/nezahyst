import { Body, Controller, Get, Post, Req, Res, Response } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
    constructor(private emailConfirmationService:EmailConfirmationService){}


    @Post()
    async requestEmailConfirmation(@Body() req){
        return await this.emailConfirmationService.
    }

    @Post()
    confirmEmail(){
        
    }
}
