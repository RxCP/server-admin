import {
  Context,
  dependency,
  HttpResponseOK,
  Post,
  HttpResponseBadRequest,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { UserService } from '../user/services/user.service';
import { CreateUserDto, LoginUserDto } from '../user/dto/userDto';
import { ValidateDto } from '../../common/util/validator.dto';
import { AuthService } from './auth.services';

export class AuthController {
  @dependency
  userService: UserService;

  @dependency
  authService: AuthService;

  @Post('/login')
  @ValidateDto(LoginUserDto)
  async login(ctx: Context) {
    const userToLogin: LoginUserDto = {
      email: ctx.request.body.email,
      password: ctx.request.body.password,
    };

    try {
      const authToken = await this.authService.loginUser(userToLogin);
      return new HttpResponseOK(authToken);
    } catch (message) {
      return new HttpResponseBadRequest({
        message: 'Invalid email or password',
      });
    }
  }

  @Post('/register')
  @ValidateDto(CreateUserDto)
  async register(
    ctx: Context,
  ): Promise<HttpResponseOK | HttpResponseBadRequest> {
    const newUser: CreateUserDto = {
      email: ctx.request.body.email,
      password: ctx.request.body.password,
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
    };

    try {
      await this.userService.createOne(newUser);
      return new HttpResponseOK({ message: 'Registered!' });
    } catch (message) {
      return new HttpResponseBadRequest({ message });
    }
  }

  @JWTRequired()
  @Post('/check')
  checkToken(ctx: Context) {
    return new HttpResponseOK({message: 'success'});
  }
}
