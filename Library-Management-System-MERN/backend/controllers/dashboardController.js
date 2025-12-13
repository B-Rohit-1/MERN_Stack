const Book = require('../models/Book');
const Member = require('../models/Member');
const BookIssue = require('../models/BookIssue');
const Fine = require('../models/Fine');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Get total books count
    const totalBooks = await Book.countDocuments();
    
    // Get active members count (members with active status)
    const activeMembers = await Member.countDocuments({ status: 'active' });
    
    // Get count of books currently on loan (where status is 'issued' or 'overdue')
    const booksOnLoan = await BookIssue.countDocuments({ 
      status: { $in: ['issued', 'overdue'] }
    });
    
    // Calculate total pending fines
    const pendingFinesResult = await Fine.aggregate([
      { $match: { status: 'unpaid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const pendingFines = pendingFinesResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        activeMembers,
        booksOnLoan,
        pendingFines
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private
const getRecentActivity = async (req, res) => {
  try {
    // Get recent book issues/returns
    const recentIssues = await BookIssue.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('book', 'title')
      .populate('member', 'name');
    
    // Get recent fine payments
    const recentFines = await Fine.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('member', 'name');
    
    // Combine and sort activities
    const activities = [
      ...recentIssues.map(issue => ({
        id: issue._id,
        type: 'book',
        action: issue.status === 'returned' ? 'returned' : 'borrowed',
        user: issue.member?.name || 'Unknown User',
        book: issue.book?.title || 'Unknown Book',
        time: issue.updatedAt
      })),
      ...recentFines.map(fine => ({
        id: fine._id,
        type: 'fine',
        action: 'paid fine',
        user: fine.member?.name || 'Unknown User',
        amount: fine.amount,
        time: fine.paidAt || fine.updatedAt
      }))
    ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10) // Limit to 10 most recent activities
    .map(activity => ({
      ...activity,
      time: formatTimeAgo(activity.time)
    }));

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Helper function to format time as "X time ago"
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 
        ? `${interval} ${unit} ago` 
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
};

module.exports = {
  getDashboardStats,
  getRecentActivity
};
