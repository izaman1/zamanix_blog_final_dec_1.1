import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = asyncHandler(async (req, res) => {
  const { date, occasion, name, notes, recurrence, calendarSync } = req.body;

  const event = await Event.create({
    userId: req.user._id,
    date,
    occasion,
    name,
    notes,
    recurrence,
    calendarSync
  });

  if (event) {
    res.status(201).json({
      status: 'success',
      data: event
    });
  } else {
    res.status(400);
    throw new Error('Invalid event data');
  }
});

// @desc    Get user events
// @route   GET /api/events
// @access  Private
export const getUserEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ userId: req.user._id }).sort({ date: 1 });

  res.json({
    status: 'success',
    data: events
  });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if event belongs to user
  if (event.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({
    status: 'success',
    data: updatedEvent
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if event belongs to user
  if (event.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await event.deleteOne();

  res.json({
    status: 'success',
    message: 'Event deleted successfully'
  });
});