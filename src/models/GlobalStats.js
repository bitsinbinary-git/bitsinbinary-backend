import mongoose from 'mongoose';

const globalStatsSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    unique: true,
    enum: ['instagram', 'youtube', 'facebook', 'twitter', 'linkedin', 'github']
  },
  followers: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// No need for additional index - unique:true already creates an index

// Method to format follower count (e.g., 1.2K, 5.3M)
globalStatsSchema.methods.getFormattedFollowers = function() {
  const count = this.followers;
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// Static method to get all stats with total
globalStatsSchema.statics.getAllWithTotal = async function() {
  const stats = await this.find({}).sort({ platform: 1 });
  const total = stats.reduce((sum, stat) => sum + stat.followers, 0);
  
  return {
    platforms: stats.map(stat => ({
      platform: stat.platform,
      followers: stat.followers,
      formattedFollowers: stat.getFormattedFollowers(),
      lastUpdated: stat.lastUpdated
    })),
    total: {
      count: total,
      formatted: formatTotalCount(total)
    }
  };
};

// Helper function to format total count (rounded down)
function formatTotalCount(count) {
  if (count >= 1000000) {
    return Math.floor(count / 1000000) + 'M+';
  } else if (count >= 1000) {
    return Math.floor(count / 1000) + 'K+';
  }
  return count.toString();
}

const GlobalStats = mongoose.model('GlobalStats', globalStatsSchema);

export default GlobalStats;
