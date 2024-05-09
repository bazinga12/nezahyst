import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError, HttpCode } from 'exceptions/app-error';
import { ConfigService } from 'modules/config';
import { User } from 'modules/user';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        private readonly mailService:MailerService,
        private readonly configService:ConfigService
    ){}

    public async resetPassword(userId:string){
            const user = await this.userRepository.findOneOrFail(userId)
            if(!user){
                throw new AppError({
                    httpCode:HttpCode.NO_CONTENT,
                    description:`Користувача з відповідним ID ${userId} не існує!`
                })
            }

            if(!user.email) {
                throw new AppError({
                    httpCode:HttpCode.NO_CONTENT,
                    description:`У користувача не вказана пошта`
                })
            }

            const newPass = this.generateRandomPassword()

            this.mailService.sendMail({
                from:this.configService.get("SMTP_USER"),
                to:user.email,
                subject:"Скидання паролю",
                text:`Ваш пароль скинуто. Тимчасовий пароль - ${newPass}. При вході обовязково його змініть`
            })
            user.password = newPass
            await this.userRepository.save(user)
            return "Пароль успішно скинуто"
    }

    private generateRandomPassword():string{
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
        let password = ""

        for(let i = 0; i< 8; i++){
            const randomIndex = Math.floor(Math.random() * chars.length)
            password += chars.charAt(randomIndex);
        }
        return password
    }
}
