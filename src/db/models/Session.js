import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdeteOptions } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      require: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      require: true,
    },
  },
  { versionKey: false, timestamps: true },
);
sessionSchema.post('save', handleSaveError);

sessionSchema.pre('findOneAndUpdate', setUpdeteOptions);

sessionSchema.post('findOneAndUpdate', handleSaveError);

const SessionCollection = model('seion', sessionSchema);

export default SessionCollection;
