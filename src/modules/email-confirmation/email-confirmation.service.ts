import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError, HttpCode } from 'exceptions/app-error';
import { User } from 'modules/user';
import { Verification } from 'modules/user/verification.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from 'modules/config';
import * as dayjs from 'dayjs';

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly mailService:MailerService,
        private readonly configService:ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>
    ){}

  

    public async sendConfirmationEmail(userId: string):Promise<{
      previousVerificaitonDates: Date[]
    }>  {
        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ["verifications"]
        });
        
        if (!user) {
          throw new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: `User with id - ${userId} does not exist`,
          });
        }
    
        const getRandomInt = (min: number, max: number) => 
          Math.floor(Math.random() * (max - min)) + min;
        const generateCode = () =>
          new Array(6).fill('').reduce(prev => prev + getRandomInt(0, 9), '');

        const previousVerifications = await this.verificationRepository.createQueryBuilder("verification")
          .where("verification.userId = :userId", { userId: user.id })
          .orderBy("verification.createdAt", "DESC")
          .limit(10)
          .getMany();
        const verification = Verification.create({
          code: generateCode(),
          email: user.email,
          user,
        });
        user.verifications.push(verification);
        
        await this.verificationRepository.save(verification);

        this.mailService.sendMail({
          from:this.configService.get("SMTP_USER"),
          to:user.email,
          subject: 'Please confirm your email',
          text: `Your verification code is ${verification.code}`,
        })
      
        await this.userRepository.save(user);
        return {
            previousVerificaitonDates: previousVerifications.map(v => v.createdAt)
        }
      }

      public confirmEmail = async (confirmEmailDTO: {email:string, verification_code:string}) => {
        const user = await this.userRepository.findOneOrFail({where: {email: confirmEmailDTO.email}});
        if (!user) {
          throw new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: `User with email ${confirmEmailDTO.email} does not exist`,
          });
        }
    
        const latestVerification = await this.verificationRepository.createQueryBuilder("verification")
          .where("verification.userId = :userId", { userId: user.id })
          .orderBy("verification.createdAt", "DESC")
          .getOne();
    
        if (!latestVerification) {
          throw new AppError({
            httpCode: HttpCode.FORBIDDEN,
            description: `Incorrect code`,
          });
        }
        
        if (latestVerification.code === confirmEmailDTO.verification_code) {
          const date1 = dayjs(new Date())
          const date2 = dayjs(latestVerification.createdAt)
          if (date1.diff(date2, 'hour') >= 1 ) {
            throw new AppError({
              httpCode: HttpCode.FORBIDDEN,
              description: `Code is expired`,
            });
          }
          user.is_email_verified = true;
          await this.userRepository.save(user);
        } else {
          throw new AppError({
            httpCode: HttpCode.FORBIDDEN,
            description: `Verification code doesn't match`,
          });
        }
        
        return user
      }
}
