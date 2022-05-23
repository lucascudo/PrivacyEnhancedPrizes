import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './card.schema';
import { Model } from 'mongoose';

@Injectable()
export class CardsService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async scratch(userId: string): Promise<Card> {
    const createdCard = new this.cardModel({
      user: userId,
      scratched: new Date(),
      winner: this.isLucky(parseInt(process.env.CHANCES)),
    });
    await createdCard.save();
    const { scratched, winner } = createdCard;
    return { scratched, winner };
  }

  isLucky(chances: number): boolean {
    return (
      Math.floor(Math.random() * chances) ===
      Math.floor(Math.random() * chances)
    );
  }
}
