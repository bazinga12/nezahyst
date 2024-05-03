import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError, HttpCode } from 'exceptions/app-error';
import { User } from 'modules/user';
import { Verification } from 'modules/user/verification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailConfirmationService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>
    ){}

  

    public async sendConfirmationEmail(userId: string): Promise<{
        previousVerificaitonDates: Date[]
      }> {
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
    
        const mailConfig = {
            host: process.env.SMTP_HOST,
            // port: Number(process.env.SMTP_PORT) || 587,
            port: Number(process.env.SMTP_PORT),
           
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          };
      
          const transporter = nodemailer.createTransport(mailConfig);
      
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Please confirm your email',
            text: `Your verification code is ${verification.code}`,
          });
      
          await this.userRepository.save(user);
          return {
            previousVerificaitonDates: previousVerifications.map(v => v.createdAt)
          }
        }
      
    
}
