import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { AuthGuard } from '@nestjs/passport';
import UserTokenDTO from 'modules/user/user-token.dto';

export interface IGetUserAuthInfoRequest extends Request {
    user?: UserTokenDTO;
}
  

@UseGuards(AuthGuard("jwt"))
@Controller('email-confirmation')
export class EmailConfirmationController {
    constructor(private readonly emailConfirmationService:EmailConfirmationService){}
    @Get('request-email-confirmation')
    requestEmailConfirmation(@Req()req:IGetUserAuthInfoRequest){
        return this.emailConfirmationService.sendConfirmationEmail(req.user.id)
    }

    @Post()
    submitEmailConfirmationPassword(@Req() req:IGetUserAuthInfoRequest, @Body() body:{verification_code:string}){
        return this.emailConfirmationService.confirmEmail({email:req.user.email, ...body})
    }
}
