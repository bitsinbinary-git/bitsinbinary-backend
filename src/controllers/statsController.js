import GlobalStats from '../models/GlobalStats.js';

// Get all platform stats with total
export const getStats = async (req, res, next) => {
  try {
    const statsData = await GlobalStats.getAllWithTotal();
    
    res.status(200).json({
      success: true,
      data: statsData
    });
  } catch (error) {
    next(error);
  }
};

// Update stats for a specific platform (admin only)
export const updatePlatformStats = async (req, res, next) => {
  try {
    const { platform, followers } = req.body;

    if (!platform || followers === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Platform and followers count are required'
      });
    }

    const stats = await GlobalStats.findOneAndUpdate(
      { platform: platform.toLowerCase() },
      { 
        followers,
        lastUpdated: Date.now()
      },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    );

    res.status(200).json({
      success: true,
      data: {
        platform: stats.platform,
        followers: stats.followers,
        formattedFollowers: stats.getFormattedFollowers(),
        lastUpdated: stats.lastUpdated
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk update all platform stats (admin only)
export const bulkUpdateStats = async (req, res, next) => {
  try {
    const { platforms } = req.body;

    if (!platforms || !Array.isArray(platforms)) {
      return res.status(400).json({
        success: false,
        message: 'Platforms array is required'
      });
    }

    const bulkOps = platforms.map(({ platform, followers }) => ({
      updateOne: {
        filter: { platform: platform.toLowerCase() },
        update: { 
          followers,
          lastUpdated: Date.now()
        },
        upsert: true
      }
    }));

    await GlobalStats.bulkWrite(bulkOps);
    const statsData = await GlobalStats.getAllWithTotal();

    res.status(200).json({
      success: true,
      message: 'Stats updated successfully',
      data: statsData
    });
  } catch (error) {
    next(error);
  }
};
