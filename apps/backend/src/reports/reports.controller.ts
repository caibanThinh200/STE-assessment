import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { CreateReportDto } from './dto/create-report.dto';
import type { Report } from './reports.schema';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll(@Query() query): Promise<Report[]> {
    return this.reportsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Report> {
    return this.reportsService.findOne(id);
  }

  @Get('compare/:ids')
  findByIds(@Param('ids') ids: string): Promise<Report[]> {
    const idArray = ids.split(',');
    return this.reportsService.findByIds(idArray);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Report> {
    return this.reportsService.remove(id);
  }
}
