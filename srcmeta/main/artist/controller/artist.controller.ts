import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  Req,
  Next,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateArtistDto } from '../../../../../service/src/dtos/artist/create-artist.dto';
import { UpdateArtistDto } from '../../../../../service/src/dtos/artist/update-artist.dto';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';
import { ArtistService } from '../service/artist.service';

@ApiTags('Artists')
@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Create Artist' })
  async create(
    @Body() body: CreateArtistDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      let value = await this.artistService.retrieveExistingResource(body);
      if (value === null) {
        value = await this.artistService.create({
          walletAddres: req.walletAddress,
          ...body,
        });
      }
      Object.assign(queryParser.query, {
        id: value[`${this.artistService.identifier}_id`],
      });
      const response = await this.artistService.getResponse({
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
  @ApiOperation({ summary: 'Find all Artist' })
  async findAll(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.artistService.baseUrl,
        this.artistService.itemsPerPage,
      );
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const { value, count } = await this.artistService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.artistService.getResponse({
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

  @Get(':id')
  @ApiOperation({ summary: 'Get Artist' })
  async findOne(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.artistService.get(id, queryParser.query);
      const response = await this.artistService.getResponse({
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
  @ApiOperation({ summary: 'Update Artist' })
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.artistService.update(id, updateArtistDto);
      const response = await this.artistService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
    // return this.artistService.update(+id, updateArtistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Artist' })
  async remove(
    @Param('id') id: string,
    @Res() res,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.artistService.delete(id);
      const response = await this.artistService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
