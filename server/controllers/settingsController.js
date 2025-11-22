import ShopSettings from '../models/ShopSettings.js';
import User from '../models/User.js';

// @desc    Get shop settings
// @route   GET /api/settings
// @access  Private (Admin)
export const getSettings = async (req, res) => {
  try {
    const settings = await ShopSettings.getSettings();
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        isPaused: settings.isPaused,
        isClosed: settings.isClosed,
        isMaintenanceMode: settings.isMaintenanceMode,
        theme: {
          darkMode: settings.theme.darkMode,
        },
        avgTimePerCustomer: user?.avgTimePerCustomer || 10,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get shop settings (Public - for checking queue status)
// @route   GET /api/settings/public
// @access  Public
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await ShopSettings.getSettings();

    res.status(200).json({
      success: true,
      data: {
        isPaused: settings.isPaused,
        isClosed: settings.isClosed,
        isMaintenanceMode: settings.isMaintenanceMode,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update shop settings
// @route   PUT /api/settings/update
// @access  Private (Admin)
export const updateSettings = async (req, res) => {
  try {
    const { isPaused, isClosed, isMaintenanceMode, theme, avgTimePerCustomer } = req.body;

    let settings = await ShopSettings.findOne();
    if (!settings) {
      settings = await ShopSettings.create({});
    }

    // Update shop settings if provided
    if (typeof isPaused === 'boolean') {
      settings.isPaused = isPaused;
    }
    if (typeof isClosed === 'boolean') {
      settings.isClosed = isClosed;
    }
    if (typeof isMaintenanceMode === 'boolean') {
      settings.isMaintenanceMode = isMaintenanceMode;
    }
    if (theme) {
      if (typeof theme.darkMode === 'boolean') {
        settings.theme.darkMode = theme.darkMode;
      }
    }

    await settings.save();

    // Update admin user's avgTimePerCustomer if provided
    if (typeof avgTimePerCustomer === 'number') {
      if (avgTimePerCustomer < 1 || avgTimePerCustomer > 120) {
        return res.status(400).json({
          success: false,
          message: 'avgTimePerCustomer must be between 1 and 120 minutes',
        });
      }
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      user.avgTimePerCustomer = avgTimePerCustomer;
      await user.save();
    }

    // Get updated user data
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        isPaused: settings.isPaused,
        isClosed: settings.isClosed,
        isMaintenanceMode: settings.isMaintenanceMode,
        theme: {
          darkMode: settings.theme.darkMode,
        },
        avgTimePerCustomer: user?.avgTimePerCustomer || 10,
      },
      message: 'Settings updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

