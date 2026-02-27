const Task = require('../models/Task');

/**
 * @desc    Get all tasks (users see own tasks, admins see all)
 * @route   GET /api/v1/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
    try {
        const { status, priority, sort, page = 1, limit = 10 } = req.query;

        // Build filter — users see own tasks only, admins see all
        const filter = {};
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        // Build sort
        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'priority') sortOption = { priority: -1, createdAt: -1 };
        if (sort === 'dueDate') sortOption = { dueDate: 1 };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Task.countDocuments(filter);

        const tasks = await Task.find(filter)
            .populate('createdBy', 'name email')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: tasks.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: { tasks },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single task
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
const getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            'createdBy',
            'name email'
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Check ownership (unless admin)
        if (
            req.user.role !== 'admin' &&
            task.createdBy._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this task',
            });
        }

        res.status(200).json({
            success: true,
            data: { task },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate: dueDate || null,
            createdBy: req.user._id,
        });

        const populatedTask = await task.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task: populatedTask },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private (owner or admin)
 */
const updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Check ownership (unless admin)
        if (
            req.user.role !== 'admin' &&
            task.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task',
            });
        }

        // Only allow certain fields to be updated
        const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        task = await Task.findByIdAndUpdate(req.params.id, updates, {
            returnDocument: 'after',
            runValidators: true,
        }).populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: { task },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private (owner or admin)
 */
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Check ownership (unless admin)
        if (
            req.user.role !== 'admin' &&
            task.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task',
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get task statistics (admin only)
 * @route   GET /api/v1/tasks/stats
 * @access  Private/Admin
 */
const getTaskStats = async (req, res, next) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

        const [stats] = await Task.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                    done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
                    highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
                    mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
                    lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: stats || {
                    total: 0,
                    todo: 0,
                    inProgress: 0,
                    done: 0,
                    highPriority: 0,
                    mediumPriority: 0,
                    lowPriority: 0,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
};
