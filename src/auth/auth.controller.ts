import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/models/user.schema';
import { BaseResult } from 'src/utils/base.result';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetNoneceDto } from './dto/auth-query.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('getNonce')
  @ApiOperation({ summary: 'Generate a nonce for the user address' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Nonce successfully generated',
    schema: {
      properties: { nonce: { type: 'string', example: 'random_nonce_value' } },
    },
  })
  async getNonce(@Body() body: GetNoneceDto): Promise<{ nonce: string }> {
    const nonce = await this.authService.generateNonce(body.userAddress);
    return { nonce };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user and return a JWT token' })
  async login(
    @Body() body: { userAddress: string; signature: string; nonce: string },
  ) {
    const { userAddress, signature, nonce } = body;
    const userResult: BaseResult<User> = await this.authService.validateUser(
      userAddress,
      signature,
      nonce,
    );

    if (!userResult.success) {
      throw new UnauthorizedException(userResult.error);
    }
    console.log(nonce);

    const token = await this.authService.login(userResult.data);
    return token;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token using a refresh token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
