import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/user';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from 'modules/config';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService) => {
        return {
          transport: {
            host:configService.get("SMTP_HOST"),
            port:Number(configService.get("SMTP_HOST")),
            auth: {
              user: configService.get("SMTP_USER"),
              pass: configService.get("SMTP_PASS")
            }
          }
        }
      }
    }),
    ConfigModule
  ],
  controllers: [AdminController],
  providers: [AdminService, Reflector]
})
export class AdminModule {}
