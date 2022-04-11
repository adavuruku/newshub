import { BookQueryDto } from './../../../dtos/books/books-query.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Next,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';
import { CreateBookDto } from '../../../dtos/books/create-book.dto';
import { BooksService } from '../service/books.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateBookDto } from '../../../../../service/src/dtos/books/update-book.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Create Book' })
  @Post()
  async create(
    @Body() body: CreateBookDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.booksService.create({
        walletAddess: req.walletAddress,
        ...body,
      });
      Object.assign(queryParser.query, {
        id: value[`${this.booksService.identifier}_id`],
      });
      const response = await this.booksService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find Books' })
  async findBooks(
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
    @Query() query: BookQueryDto,
  ) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.booksService.baseUrl,
        this.booksService.itemsPerPage,
      );

      const queryParser = new QueryParser(Object.assign({}, query));
      const { value, count } = await this.booksService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.booksService.getResponse({
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
  }

  @ApiOperation({ summary: 'Get Book' })
  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Query() query: BookQueryDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(query, req.params);
      const queryParser = new QueryParser(Object.assign({}, query));
      const value = await this.booksService.get(id, queryParser);
      const response = await this.booksService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Update Book' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.booksService.update(id, updateBookDto);
      const response = await this.booksService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Delete Book' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.booksService.delete(id);
      const response = await this.booksService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
