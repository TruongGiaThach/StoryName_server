import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users.',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userAddress')
  @ApiOperation({ summary: 'Retrieve a user by their address' })
  @ApiParam({
    name: 'userAddress',
    description: 'The address of the user to retrieve',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('userAddress') userAddress: string) {
    return this.userService.findOneByAddress(userAddress);
  }
}
