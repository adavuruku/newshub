import { CreateSaleOptionDto } from './../../../dtos/sale-option/create-sale-option.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  Res,
  Req,
  Next,
} from '@nestjs/common';
import { SaleOptionService } from '../service/sale-option.service';
import { UpdateSaleOptionDto } from '../../../../../service/src/dtos/sale-option/update-sale-option.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';

@ApiTags('Sale Option')
@Controller('sale-option')
export class SaleOptionController {
  constructor(private readonly saleOptionService: SaleOptionService) {}

  @ApiOperation({ summary: 'Create Sale Option' })
  @Post()
  async create(
    @Body() body: CreateSaleOptionDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.saleOptionService.create({
        walletAddres: req.walletAddress,
        ...body,
      });

      Object.assign(queryParser.query, {
        id: value[`${this.saleOptionService.identifier}_id`],
      });
      const response = await this.saleOptionService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Find All Sale Option' })
  @Get()
  async findAll(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.saleOptionService.baseUrl,
        this.saleOptionService.itemsPerPage,
      );
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const { value, count } = await this.saleOptionService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.saleOptionService.getResponse({
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

  @ApiOperation({ summary: 'Find Sale Option' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.saleOptionService.get(id, queryParser.query);
      const response = await this.saleOptionService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Update Sale Option' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSaleOptionDto: UpdateSaleOptionDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.saleOptionService.update(
        id,
        updateSaleOptionDto,
      );
      const response = await this.saleOptionService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Delete Sale Option' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.saleOptionService.delete(id);
      const response = await this.saleOptionService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
