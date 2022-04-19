import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password?: string;
}

export interface UserDoc extends Document {
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<UserDoc>('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(this.password, salt, (hashError, hash) => {
          if (hashError) {
            return next(hashError);
          }

          this.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});
