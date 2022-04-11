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
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateAttributeDto } from '../../../../../service/src/dtos/attributes/update-attribute.dto';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';
import { CreateAttributeDto } from '../../../dtos/attributes/create-attribute.dto';
import { AttributesService } from '../service/attributes.service';

@ApiTags('Attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @ApiOperation({ summary: 'Create Attribute' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async createAttribute(
    @Body() body: CreateAttributeDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      let value = await this.attributesService.retrieveExistingResource(body);
      if (value === null) {
        value = await this.attributesService.create({
          walletAddres: req.walletAddress,
          ...body,
        });
      }
      Object.assign(queryParser.query, {
        id: value[`${this.attributesService.identifier}_id`],
      });
      const response = await this.attributesService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Find Attribute' })
  @Get()
  async findAttributes(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.attributesService.baseUrl,
        this.attributesService.itemsPerPage,
      );
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const { value, count } = await this.attributesService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.attributesService.getResponse({
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

  @ApiOperation({ summary: 'Get Attribute' })
  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.attributesService.get(id, queryParser.query);
      const response = await this.attributesService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Update Attribute' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.attributesService.update(id, updateAttributeDto);
      const response = await this.attributesService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Delete Attribute' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.attributesService.delete(id);
      const response = await this.attributesService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
