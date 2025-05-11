import Guest from '../models/guest.model.js';

// Create Guest
export const createGuest = async (req, res) => {
  try {
    const data = req.body;

    const newGuest = new Guest({
      ...data,
      checkInTime: new Date(data.checkInTime),
      checkOutTime: new Date(data.checkOutTime)
    });

    const saved = await newGuest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Guests
export const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Filtered Guests
export const filterGuests = async (req, res) => {
  try {
    const { name, phone, email, location } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (phone) filter.phone = phone;
    if (email) filter.email = email;
    if (location) filter.location = location;

    const guests = await Guest.find(filter);
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Guest
export const updateGuest = async (req, res) => {
  try {
    const updated = await Guest.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        checkInTime: new Date(req.body.checkInTime),
        checkOutTime: new Date(req.body.checkOutTime)
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Guest
export const deleteGuest = async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Guest deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Visitor Stats
export const getStats = async (req, res) => {
  try {
    const now = new Date();

    // Today
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));
    const totalToday = await Guest.countDocuments({
      checkInTime: { $gte: startOfDay, $lte: endOfDay }
    });

    // Currently Checked-In
    const currentVisitors = await Guest.countDocuments({
      checkInTime: { $exists: true },
      checkOutTime: { $exists: true },
      checkOutTime: { $gt: new Date() }
    });

    // This Month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const totalThisMonth = await Guest.countDocuments({
      checkInTime: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Average Visit Duration
    const allGuests = await Guest.find({
      checkInTime: { $exists: true },
      checkOutTime: { $exists: true }
    });

    const durations = allGuests.map(g => (new Date(g.checkOutTime) - new Date(g.checkInTime)) / 60000);
    const avgDuration = durations.length > 0
      ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)
      : 0;

    res.json({
      totalVisitorsToday: totalToday,
      currentlyCheckedIn: currentVisitors,
      totalVisitorsThisMonth: totalThisMonth,
      averageVisitDurationInMinutes: avgDuration
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
