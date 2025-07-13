const Bug = require('../models/Bug');
const logger = require('../utils/logger');
const { validateBugData, sanitizeInput } = require('../utils/validation');

/**
 * Get all bugs
 * @route GET /api/bugs
 * @access Public
 */
const getAllBugs = async (req, res) => {
  try {
    const { status, severity, priority, reporter, page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (priority) query.priority = priority;
    if (reporter) query.reporter = new RegExp(reporter, 'i');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const bugs = await Bug.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Bug.countDocuments(query);
    
    logger.info(`Retrieved ${bugs.length} bugs`);
    
    res.json({
      success: true,
      data: bugs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching bugs:', error);
    throw error;
  }
};

/**
 * Create a new bug
 * @route POST /api/bugs
 * @access Public
 */
const createBug = async (req, res) => {
  try {
    // Sanitize input
    const sanitizedData = {
      ...req.body,
      title: sanitizeInput(req.body.title),
      description: sanitizeInput(req.body.description),
      reporter: sanitizeInput(req.body.reporter),
      assignee: req.body.assignee ? sanitizeInput(req.body.assignee) : undefined
    };
    
    // Validate bug data
    const validation = validateBugData(sanitizedData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const bug = new Bug(sanitizedData);
    const savedBug = await bug.save();
    
    logger.info(`Bug created with ID: ${savedBug._id}`);
    
    res.status(201).json({
      success: true,
      data: savedBug,
      message: 'Bug created successfully'
    });
  } catch (error) {
    logger.error('Error creating bug:', error);
    throw error;
  }
};

/**
 * Get a single bug by ID
 * @route GET /api/bugs/:id
 * @access Public
 */
const getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    logger.info(`Retrieved bug: ${bug._id}`);
    
    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    logger.error('Error fetching bug:', error);
    throw error;
  }
};

/**
 * Update a bug
 * @route PUT /api/bugs/:id
 * @access Public
 */
const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    // Sanitize input
    const sanitizedData = {
      ...req.body,
      title: req.body.title ? sanitizeInput(req.body.title) : undefined,
      description: req.body.description ? sanitizeInput(req.body.description) : undefined,
      reporter: req.body.reporter ? sanitizeInput(req.body.reporter) : undefined,
      assignee: req.body.assignee ? sanitizeInput(req.body.assignee) : undefined
    };
    
    // Remove undefined values
    Object.keys(sanitizedData).forEach(key => {
      if (sanitizedData[key] === undefined) {
        delete sanitizedData[key];
      }
    });
    
    // Validate updated data
    const validation = validateBugData({ ...bug.toObject(), ...sanitizedData });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      { new: true, runValidators: true }
    );
    
    logger.info(`Bug updated: ${updatedBug._id}`);
    
    res.json({
      success: true,
      data: updatedBug,
      message: 'Bug updated successfully'
    });
  } catch (error) {
    logger.error('Error updating bug:', error);
    throw error;
  }
};

/**
 * Delete a bug
 * @route DELETE /api/bugs/:id
 * @access Public
 */
const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    await Bug.findByIdAndDelete(req.params.id);
    
    logger.info(`Bug deleted: ${req.params.id}`);
    
    res.json({
      success: true,
      message: 'Bug deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting bug:', error);
    throw error;
  }
};

module.exports = {
  getAllBugs,
  createBug,
  getBugById,
  updateBug,
  deleteBug
};
