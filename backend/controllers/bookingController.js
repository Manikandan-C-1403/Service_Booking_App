import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

export const createBooking = async (req, res) => {
  try {
    const { services, customer, bookingDate, bookingTime, totalPrice } = req.body;

    const booking = new Booking({
      services,
      customer,
      bookingDate,
      bookingTime,
      totalPrice
    });

    const createdBooking = await booking.save();
    const populatedBooking = await Booking.findById(createdBooking._id).populate('services.service');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { customer, service, startDate, endDate } = req.query;
    
    let query = {};

    if (customer) {
      query['customer.name'] = { $regex: customer, $options: 'i' };
    }

    if (service) {
      query['services.service'] = service;
    }

    if (startDate && endDate) {
      query.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('services.service')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('services.service');
    
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (booking) {
      booking.status = 'cancelled';
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { serviceIds, date, time } = req.body;

    const services = await Service.find({ _id: { $in: serviceIds } });
    
    const requestedDate = new Date(date);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const unavailableServices = services.filter(service => {
      const { workingDays, workingHours } = service.availability;
      
      if (!workingDays.includes(dayName)) {
        return true;
      }
      
      const requestedTime = time;
      if (requestedTime < workingHours.start || requestedTime > workingHours.end) {
        return true;
      }
      
      return false;
    });

    if (unavailableServices.length > 0) {
      return res.json({
        available: false,
        unavailableServices: unavailableServices.map(s => s._id),
        message: "Some services are not available at this time"
      });
    }

    const existingBookings = await Booking.find({
      bookingDate: requestedDate,
      bookingTime: time,
      status: { $ne: 'cancelled' }
    });

    if (existingBookings.length > 0) {
      return res.json({
        available: false,
        message: "This time slot is already booked"
      });
    }

    res.json({
      available: true,
      message: "All services are available"
    });

    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
