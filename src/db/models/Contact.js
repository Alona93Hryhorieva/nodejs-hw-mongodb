import { Schema, model } from 'mongoose';

import { contactTypeList } from '../../constants/constant.js';
import { handleSaveError, setUpdeteOptions } from './hooks.js';
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoheNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      default: 'personal',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdeteOptions);

contactSchema.post('findOneAndUpdate', handleSaveError);

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
