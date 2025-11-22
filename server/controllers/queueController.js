import QueueItem from '../models/QueueItem.js';
import User from '../models/User.js';
import { generateTokenNumber } from '../utils/generateTokenNumber.js';

// @desc    Join queue
// @route   POST /api/queue/join
// @access  Public
export const joinQueue = async (req, res) => {
  try {
    const { name, phone, email, type } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a name',
      });
    }

    // Validate type
    const validTypes = ['Walk-in', 'VIP', 'Senior'];
    const customerType = validTypes.includes(type) ? type : 'Walk-in';

    // Determine priority level
    let priorityLevel = 1; // Default for Walk-in
    if (customerType === 'VIP') {
      priorityLevel = 3; // Highest priority
    } else if (customerType === 'Senior') {
      priorityLevel = 2; // Medium priority
    }

    // Generate token number
    const tokenNumber = await generateTokenNumber();

    // Create queue item
    const queueItem = await QueueItem.create({
      name,
      phone: phone || undefined,
      email: email || undefined,
      type: customerType,
      priorityLevel,
      tokenNumber,
      status: 'waiting',
    });

    // Calculate position in queue (only waiting items, sorted by priority and createdAt)
    const waitingItems = await QueueItem.find({ status: 'waiting' })
      .sort({ priorityLevel: -1, createdAt: 1 });

    const position = waitingItems.findIndex(item => item._id.toString() === queueItem._id.toString()) + 1;

    // Get average time per customer from admin user (default to 10 minutes)
    const adminUser = await User.findOne({ role: 'admin' });
    const avgTimePerCustomer = adminUser?.avgTimePerCustomer || 10;

    // Calculate expected wait time
    // Number of remaining customers ahead = position - 1 (since position includes current customer)
    const remainingCustomers = position - 1;
    const expectedWaitMinutes = remainingCustomers * avgTimePerCustomer;

    res.status(201).json({
      success: true,
      data: {
        id: queueItem._id,
        tokenNumber: queueItem.tokenNumber,
        name: queueItem.name,
        type: queueItem.type,
        position,
        estimatedWait: expectedWaitMinutes > 0 ? `${expectedWaitMinutes} minutes` : 'You are next',
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate token number (shouldn't happen, but handle it)
      return res.status(400).json({
        success: false,
        message: 'Token number conflict. Please try again.',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get queue status by ID
// @route   GET /api/queue/status/:id
// @access  Public
export const getQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const queueItem = await QueueItem.findById(id);

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found',
      });
    }

    // Calculate position
    const waitingItems = await QueueItem.find({ status: 'waiting' })
      .sort({ priorityLevel: -1, createdAt: 1 });

    const position = waitingItems.findIndex(item => item._id.toString() === queueItem._id.toString()) + 1;

    // Get currently serving item
    const currentlyServing = await QueueItem.findOne({ status: 'serving' });

    // Get average time per customer from admin user (default to 10 minutes)
    const adminUser = await User.findOne({ role: 'admin' });
    const avgTimePerCustomer = adminUser?.avgTimePerCustomer || 10;

    // Calculate expected wait time for waiting customers
    let estimatedWait = null;
    if (queueItem.status === 'waiting') {
      const remainingCustomers = position - 1;
      const expectedWaitMinutes = remainingCustomers * avgTimePerCustomer;
      estimatedWait = expectedWaitMinutes > 0 ? `${expectedWaitMinutes} minutes` : 'You are next';
    }

    res.status(200).json({
      success: true,
      data: {
        id: queueItem._id,
        tokenNumber: queueItem.tokenNumber,
        name: queueItem.name,
        type: queueItem.type,
        status: queueItem.status,
        position: queueItem.status === 'waiting' ? position : null,
        estimatedWait,
        currentlyServing: currentlyServing ? {
          tokenNumber: currentlyServing.tokenNumber,
          name: currentlyServing.name,
        } : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get currently serving token
// @route   GET /api/queue/current
// @access  Public
export const getCurrentServing = async (req, res) => {
  try {
    const currentlyServing = await QueueItem.findOne({ status: 'serving' })
      .sort({ updatedAt: -1 });

    if (!currentlyServing) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No one is currently being served',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: currentlyServing._id,
        tokenNumber: currentlyServing.tokenNumber,
        name: currentlyServing.name,
        type: currentlyServing.type,
        phone: currentlyServing.phone,
        email: currentlyServing.email,
        startedAt: currentlyServing.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get full queue list (Admin only)
// @route   GET /api/queue/list
// @access  Private (Admin)
export const getQueueList = async (req, res) => {
  try {
    const { status, type } = req.query;

    // Build query - exclude removed items unless specifically requested
    const query = {};
    if (status) {
      query.status = status;
    } else {
      // By default, exclude removed items from the queue list
      query.status = { $ne: 'removed' };
    }
    if (type) {
      query.type = type;
    }

    // Get queue items, sorted by priority (desc) then createdAt (asc)
    const queueItems = await QueueItem.find(query)
      .sort({ priorityLevel: -1, createdAt: 1 });

    // Get currently serving
    const currentlyServing = await QueueItem.findOne({ status: 'serving' });

    res.status(200).json({
      success: true,
      data: {
        queue: queueItems.map(item => ({
          id: item._id,
          tokenNumber: item.tokenNumber,
          name: item.name,
          customerType: item.type.toLowerCase().replace('-', '-'),
          type: item.type,
          phone: item.phone,
          email: item.email,
          priority: item.priorityLevel,
          priorityLevel: item.priorityLevel,
          status: item.status,
          joinedAt: item.createdAt,
          createdAt: item.createdAt,
        })),
        currentlyServing: currentlyServing ? {
          id: currentlyServing._id,
          tokenNumber: currentlyServing.tokenNumber,
          name: currentlyServing.name,
          customerType: currentlyServing.type.toLowerCase().replace('-', '-'),
          type: currentlyServing.type,
          phone: currentlyServing.phone,
          email: currentlyServing.email,
          priority: currentlyServing.priorityLevel,
          priorityLevel: currentlyServing.priorityLevel,
          status: currentlyServing.status,
          joinedAt: currentlyServing.createdAt,
        } : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Start serving a token (Admin only)
// @route   PUT /api/queue/start/:id
// @access  Private (Admin)
export const startServing = async (req, res) => {
  try {
    const { id } = req.params;

    const queueItem = await QueueItem.findById(id);

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found',
      });
    }

    if (queueItem.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This token has already been completed',
      });
    }

    // If another item is being served, mark it as completed first
    const currentlyServing = await QueueItem.findOne({ status: 'serving' });
    if (currentlyServing && currentlyServing._id.toString() !== id) {
      currentlyServing.status = 'completed';
      await currentlyServing.save();
    }

    // Mark this item as serving
    queueItem.status = 'serving';
    await queueItem.save();

    res.status(200).json({
      success: true,
      data: {
        id: queueItem._id,
        tokenNumber: queueItem.tokenNumber,
        name: queueItem.name,
        type: queueItem.type,
        status: queueItem.status,
      },
      message: 'Started serving customer',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete serving a token (Admin only)
// @route   PUT /api/queue/complete/:id
// @access  Private (Admin)
export const completeServing = async (req, res) => {
  try {
    const { id } = req.params;

    const queueItem = await QueueItem.findById(id);

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found',
      });
    }

    if (queueItem.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This token has already been completed',
      });
    }

    queueItem.status = 'completed';
    queueItem.completedAt = new Date(); // Track when item was completed
    await queueItem.save();

    res.status(200).json({
      success: true,
      data: {
        id: queueItem._id,
        tokenNumber: queueItem.tokenNumber,
        name: queueItem.name,
        status: queueItem.status,
      },
      message: 'Service completed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Increase priority (Admin only)
// @route   PUT /api/queue/priority/:id
// @access  Private (Admin)
export const increasePriority = async (req, res) => {
  try {
    const { id } = req.params;

    const queueItem = await QueueItem.findById(id);

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found',
      });
    }

    if (queueItem.status !== 'waiting') {
      return res.status(400).json({
        success: false,
        message: 'Can only change priority for waiting items',
      });
    }

    // Increase priority level (max 5)
    if (queueItem.priorityLevel < 5) {
      queueItem.priorityLevel += 1;
      
      // Update type if priority is high enough
      if (queueItem.priorityLevel >= 3 && queueItem.type !== 'VIP') {
        queueItem.type = 'VIP';
      }
      
      await queueItem.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: queueItem._id,
        tokenNumber: queueItem.tokenNumber,
        name: queueItem.name,
        type: queueItem.type,
        priorityLevel: queueItem.priorityLevel,
      },
      message: 'Priority increased',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove a customer from queue (Admin only)
// @route   DELETE /api/queue/remove/:id
// @access  Private (Admin)
export const removeFromQueue = async (req, res) => {
  try {
    const { id } = req.params;

    const queueItem = await QueueItem.findByIdAndDelete(id);

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer removed from queue',
      data: {
        id: queueItem._id,
        tokenNumber: queueItem.tokenNumber,
        name: queueItem.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get queue statistics (Admin only)
// @route   GET /api/queue/stats
// @access  Private (Admin)
export const getQueueStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total waiting
    const totalWaiting = await QueueItem.countDocuments({ status: 'waiting' });

    // Served today - count items that were completed today
    // This includes items that are currently 'completed' or were 'removed' after being completed today
    const servedToday = await QueueItem.countDocuments({
      $or: [
        { status: 'completed', completedAt: { $gte: today } },
        { status: 'removed', completedAt: { $gte: today } }
      ]
    });

    // Currently serving
    const currentlyServing = await QueueItem.findOne({ status: 'serving' });

    // Average wait time (calculate from completed items today)
    // Include both 'completed' and 'removed' items that were completed today
    const completedToday = await QueueItem.find({
      $or: [
        { status: 'completed', completedAt: { $gte: today } },
        { status: 'removed', completedAt: { $gte: today } }
      ]
    }).sort({ completedAt: -1 });

    let avgWaitTime = 0;
    if (completedToday.length > 0) {
      const waitTimes = completedToday
        .filter(item => item.createdAt && item.completedAt)
        .map(item => {
          const waitTime = (item.completedAt - item.createdAt) / (1000 * 60); // minutes
          return waitTime;
        })
        .filter(time => time > 0);

      if (waitTimes.length > 0) {
        avgWaitTime = Math.round(
          waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length
        );
      }
    }

    // Queue breakdown by type
    const byType = {
      'Walk-in': await QueueItem.countDocuments({ type: 'Walk-in', status: 'waiting' }),
      'VIP': await QueueItem.countDocuments({ type: 'VIP', status: 'waiting' }),
      'Senior': await QueueItem.countDocuments({ type: 'Senior', status: 'waiting' }),
    };

    res.status(200).json({
      success: true,
      data: {
        totalWaiting,
        servedToday,
        currentlyServing: currentlyServing ? {
          tokenNumber: currentlyServing.tokenNumber,
          name: currentlyServing.name,
        } : null,
        averageWaitTime: avgWaitTime,
        byType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

