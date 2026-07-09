import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/films/schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAll() {
    return await this.filmModel.find().lean().exec();
  }

  async findById(id: string) {
    return await this.filmModel.findOne({ id }).lean().exec();
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    await this.filmModel
      .findOneAndUpdate(
        { id: filmId, 'schedule.id': sessionId },
        { $push: { 'schedule.$.taken': seatKey } },
      )
      .exec();
  }
}
