import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { CreateReportDto } from './dto/create-report.dto';
import type { Report } from './reports.schema';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/users/users.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user,
  ): Promise<Report> {
    return this.reportsService.create(createReportDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query, @CurrentUser() user): Promise<Report[]> {
    return this.reportsService.findAll(query, user);
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Report> {
    return this.reportsService.remove(id);
  }
}
