const FeedbackModel = require('../models/feedbackModel');
const StudentModel = require('../models/studentModel');

const submitFeedback = async (req, res) => {
    const feedbackData = req.body;
    const { rollNo } = feedbackData;

    if (!rollNo) {
        return res.status(400).json({ error: 'Roll number is required to submit feedback' });
    }

    try {
        // 1. Increment question-wise counters (UPDATE [dept]_feedback)
        await FeedbackModel.incrementDepartmentFeedbackCounters(feedbackData.department, feedbackData.answers);

        // 3. Mark the student as submitted (UPDATE all_students set status=true)
        await StudentModel.updateSubmissionStatus(rollNo, true);

        return res.status(201).json({ message: 'Feedback submitted successfully' });

    } catch (err) {
        console.error('Error in submitFeedback Controller:', err);
        return res.status(500).json({ error: `Database Error: ${err.message}` || 'Failed to process feedback submission' });
    }
};


const getFeedbackByDepartment = async (req, res) => {
    const { department } = req.params;

    try {
        const feedbackList = await FeedbackModel.getFeedbackByDepartment(department);
        return res.status(200).json(feedbackList);
    } catch (err) {
        console.error('Error fetching department feedback:', err);
        return res.status(500).json({ error: 'Failed to load feedback' });
    }
}

const getDashboardStats = async (req, res) => {
    try {
        // Basic stats retrieval for admin
        // This aggregates from DB or fetches raw data
        // In a full implementation, you'd calculate stats from the DB directly here.
        return res.status(200).json({ status: 'Under construction. Ready for Supabase views.' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed' });
    }
}

module.exports = {
    submitFeedback,
    getFeedbackByDepartment,
    getDashboardStats
};
