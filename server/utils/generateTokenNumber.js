import QueueItem from '../models/QueueItem.js';

// Generate random 4-character alphanumeric code
function generateRandomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return "QY-" + code;
}

// Generate unique random token number (QY-XXXX format)
export const generateTokenNumber = async () => {
  try {
    let tokenNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop

    // Generate token and check for uniqueness
    while (!isUnique && attempts < maxAttempts) {
      tokenNumber = generateRandomCode();
      
      // Check if token already exists
      const existingToken = await QueueItem.findOne({ tokenNumber });
      
      if (!existingToken) {
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      // Fallback: append timestamp if all attempts failed (extremely unlikely)
      const timestamp = Date.now().toString().slice(-4);
      tokenNumber = generateRandomCode() + "-" + timestamp;
    }

    return tokenNumber;
  } catch (error) {
    console.error('Error generating token number:', error);
    // Fallback: use timestamp-based code
    const timestamp = Date.now().toString().slice(-4);
    return "QY-" + timestamp;
  }
};

