import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateReportDto } from './dto/create-report.dto';
import { Report, type ReportDocument } from './reports.schema';
import { User } from 'src/users/user.schema';
import { VerifyUser } from 'src/users/users.decorator';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    user: VerifyUser,
  ): Promise<Report> {
    const createdReport = new this.reportModel({
      ...createReportDto,
      user: user?.sub,
    });
    return createdReport.save();
  }

  async findAll(query, user: VerifyUser): Promise<Report[]> {
    let queryParams: { [x: string]: any } = {};
    queryParams.user = user?.sub;
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

  async removeByUser(id: string, userId: string): Promise<Report> {
    const report = await this.reportModel.findById(id).exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.user.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own reports');
    }

    return this.reportModel.findByIdAndDelete(id).exec();
  }
}
