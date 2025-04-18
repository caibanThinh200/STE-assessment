import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateReportDto } from './dto/create-report.dto';
import { Report, type ReportDocument } from './reports.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const createdReport = new this.reportModel(createReportDto);
    return createdReport.save();
  }

  async findAll(query): Promise<Report[]> {
    let queryParams: { [x: string]: any } = {};
    if (query?.location) {
      queryParams.location = { $regex: query?.location, $options: 'i' };
    }

    return this.reportModel.find(queryParams).sort({ timestamp: -1 }).exec();
  }

  async findOne(id: string): Promise<Report> {
    return this.reportModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<Report[]> {
    return this.reportModel.find({ _id: { $in: ids } }).exec();
  }

  async remove(id: string): Promise<Report> {
    return this.reportModel.findByIdAndDelete(id).exec();
  }
}
