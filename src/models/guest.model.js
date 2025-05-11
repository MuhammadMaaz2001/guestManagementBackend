import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  purpose: { type: String },
  personToMeet: { type: String },
  location: { type: String },
  checkInTime: { type: Date },
  checkOutTime: { type: Date }
});

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
