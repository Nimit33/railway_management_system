const Train = require('../models/train.model');
const Booking = require('../models/booking.model');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

exports.addTrain = async (req, res) => {
  try {
    const { trainNumber, trainName, source, destination, totalSeats, availableSeats, departureTime, arrivalTime } = req.body;
    
    if (!trainNumber || !trainName || !source || !destination || !totalSeats || !availableSeats || !departureTime || !arrivalTime) {
      return res.status(400).json({ 
        message: "All fields are required: trainNumber, trainName, source, destination, totalSeats, availableSeats, departureTime, arrivalTime" 
      });
    }

    if (availableSeats > totalSeats) {
      return res.status(400).json({ 
        message: "Available seats cannot exceed total seats" 
      });
    }

    const train = await Train.create(req.body);
    res.status(201).json(train);
  } catch (error) {
    console.error('Train creation error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Train number must be unique' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getTrains = async (req, res) => {
  try {
    const trains = await Train.findAll();
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { source, destination } = req.query;
    const trains = await Train.findAll({
      where: {
        source,
        destination,
        availableSeats: {
          [Op.gt]: 0
        }
      }
    });
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookSeat = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { trainId } = req.body;
    
    const train = await Train.findOne({
      where: { id: trainId },
      lock: true,
      transaction: t
    });

    if (!train || train.availableSeats <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No seats available' });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      trainId,
      seatNumber: train.totalSeats - train.availableSeats + 1
    }, { transaction: t });

    await train.update({
      availableSeats: train.availableSeats - 1
    }, { transaction: t });

    await t.commit();
    res.status(201).json(booking);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [Train]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 