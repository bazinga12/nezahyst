import { Body, Controller, Next, Post, Res, } from '@nestjs/common';
import { UsersService } from './user.service';
import FindUsersDTO from './find-user.dto';
import { JwtAuthGuard } from 'modules/auth';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService){}

  @Post("find")
  async findMany(@Body() body: FindUsersDTO) {
    return  await this.userService.findMany(body)
  }
}