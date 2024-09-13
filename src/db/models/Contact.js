import { Schema, model } from 'mongoose';

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
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
