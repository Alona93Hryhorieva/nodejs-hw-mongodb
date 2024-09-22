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

const SessionCollection = model('session', sessionSchema);

export default SessionCollection;

// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const sessionSchema = new Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     refreshToken: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// const Session = mongoose.model('Session', sessionSchema);

// module.exports = Session;
