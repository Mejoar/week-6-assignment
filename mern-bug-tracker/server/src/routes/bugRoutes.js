const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllBugs,
  createBug,
  updateBug,
  deleteBug,
  getBugById,
} = require('../controllers/bugController');

const router = express.Router();

// Route to get all bugs
router.get('/', asyncHandler(getAllBugs));

// Route to create a new bug
router.post('/', asyncHandler(createBug));

// Route to get a single bug by ID
router.get('/:id', asyncHandler(getBugById));

// Route to update a bug by ID
router.put('/:id', asyncHandler(updateBug));

// Route to delete a bug by ID
router.delete('/:id', asyncHandler(deleteBug));

module.exports = router;

