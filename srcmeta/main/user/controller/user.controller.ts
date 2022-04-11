import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  Next,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';
import { CreateUserDto } from '../../../dtos/user/create-user.dto';
import { UpdateUserDto } from '../../../dtos/user/update-user.dto';
import { UserService } from '../service/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async create(
    @Body() body: CreateUserDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      let value = await this.userService.retrieveExistingResource(body);
      if (value === null) {
        value = await this.userService.create({
          walletAddres: req.walletAddress,
          ...body,
        });
      }
      Object.assign(queryParser.query, {
        id: value[`${this.userService.identifier}_id`],
      });
      const response = await this.userService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all Users' })
  async findAll(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.userService.baseUrl,
        this.userService.itemsPerPage,
      );
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const { value, count } = await this.userService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.userService.getResponse({
        code: HttpStatus.OK,
        value,
        count,
        queryParser,
        pagination,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
    // return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User' })
  async findOne(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.userService.get(id, queryParser.query);
      const response = await this.userService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update User' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.userService.update(id, updateUserDto);
      const response = await this.userService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  async remove(
    @Param('id') id: string,
    @Res() res,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.userService.delete(id);
      const response = await this.userService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
