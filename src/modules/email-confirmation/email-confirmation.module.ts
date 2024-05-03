import { Module } from '@nestjs/common';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';

@Module({
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
