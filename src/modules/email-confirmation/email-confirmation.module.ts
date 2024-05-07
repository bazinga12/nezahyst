import { Module } from '@nestjs/common';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { User } from 'modules/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from 'modules/user/verification.entity';
import { ConfigModule, ConfigService } from 'modules/config';

@Module({
  imports:[MailerModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: (configService:ConfigService) => {
      return {
        transport: {
          host: configService.get("SMTP_HOST"),
          port: Number(configService.get("SMTP_HOST")),
          auth: {
            user: configService.get("SMTP_USER"),
            pass: configService.get("SMTP_PASS"),
          },  
        }
      }
    }
  }),
  TypeOrmModule.forFeature([User, Verification]),
  ConfigModule
],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService]
})
export class EmailConfirmationModule {
}
