import mongoose from 'mongoose';

const shopSettingsSchema = new mongoose.Schema({
  isPaused: {
    type: Boolean,
    default: false,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  isMaintenanceMode: {
    type: Boolean,
    default: false,
  },
  theme: {
    darkMode: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
shopSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const ShopSettings = mongoose.model('ShopSettings', shopSettingsSchema);

export default ShopSettings;

