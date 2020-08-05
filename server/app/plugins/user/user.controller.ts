import {
  Context,
  dependency,
  Get,
  HttpResponseBadRequest,
  HttpResponseOK,
  Post,
} from '@foal/core';
import { ValidateDto } from '../../common/hooks/validate-dto.hook';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

export class UserController {
  @dependency
  userService: UserService;

  @Get('/')
  async index(ctx: Context) {
    const query = {
      take: (ctx.request.query && ctx.request.query.take) || '',
      skip: (ctx.request.query && ctx.request.query.skip) || '',
    };

    try {
      const res = (await this.userService.findAll(query)) || {};

      return new HttpResponseOK(res);
    } catch (error) {
      return new HttpResponseBadRequest({ error });
    }
  }

  @Get('/:id')
  async findOne(ctx: Context) {
    const userId = ctx.request.params.id;

    try {
      const res = (await this.userService.findById(userId)) || {};

      return new HttpResponseOK(res);
    } catch (error) {
      return new HttpResponseBadRequest({ error });
    }
  }

  @Post('/')
  @ValidateDto(CreateUserDto)
  async createOne(ctx: Context) {
    const newUser: CreateUserDto = ctx.request.body;
    try {
      await this.userService.createOne(newUser);
      return new HttpResponseOK({ message: 'Registered!' });
    } catch (message) {
      return new HttpResponseBadRequest({ message });
    }
  }
}
