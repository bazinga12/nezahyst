import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { UserFillableFields, UserStatus } from './base-user.entity';
import { User } from './user.entity';
import FindUsersDTO from './find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async get(id: string) {
    return this.userRepository.findOne({ id });
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async create(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }

    return await this.userRepository.save(payload);
  }

  async findMany(findUsersDTO:FindUsersDTO){
    const {filters, search, page, perPage, sort} = findUsersDTO
    const query = this.userRepository.createQueryBuilder('data').where('1 = 1');

    if(search) query.andWhere(new Brackets((qb)=>{
        qb.andWhere('data.firstName ILIKE :q', {q:`%${search}%`})
        .orWhere('data.lastName ILIKE :q', {q:`%${search}%`})
        .orWhere('data.email ILIKE :q', {q:`%${search}%`})
        // .orWhere('data.id ILIKE :q', {q:`%${search}%`})
    }))

    if (sort) {
      Object.entries(sort).forEach(([key, value]) => {
        query.addOrderBy(`data.${key}`, value);
      });
    } else {
      query.orderBy('data.createdAt', 'DESC');
    }
    try {
      const activatedCount = await query.where('data.status = :status', {status:UserStatus.Active}).getCount()
      const blockedCount = await query.where('data.status = :status', {status:UserStatus.Blocked}).getCount()
      const newCount = await query.where('data.status = :status', {status:UserStatus.New}).getCount()
  
      if(filters.status) query.andWhere('data.status =:status', {status:`%${filters.status}%`})
  
      const [users, count] = await query.skip((page) * perPage).take(perPage).getManyAndCount()
  
  
      return {
        users,
        count,
        counters: {
          activated:activatedCount,
          blocked:blockedCount,
          new:newCount
        }
      }
    } catch(e){
      throw Error(e)
    }

  }
}
