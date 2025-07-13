const { getAllBugs, createBug, getBugById, updateBug, deleteBug } = require('../../controllers/bugController');
const Bug = require('../../models/Bug');

// Mock the Bug model
jest.mock('../../models/Bug');

// Mock the logger
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

// Mock the validation utilities
jest.mock('../../utils/validation', () => ({
  validateBugData: jest.fn(),
  sanitizeInput: jest.fn((input) => input)
}));

const { validateBugData, sanitizeInput } = require('../../utils/validation');

describe('Bug Controller Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getAllBugs', () => {
    test('should return all bugs with pagination', async () => {
      const mockBugs = [
        { _id: '1', title: 'Bug 1', description: 'Description 1' },
        { _id: '2', title: 'Bug 2', description: 'Description 2' }
      ];
      
      Bug.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockBugs)
          })
        })
      });
      Bug.countDocuments.mockResolvedValue(2);

      await getAllBugs(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockBugs,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      });
    });

    test('should handle filtering by status', async () => {
      req.query.status = 'open';
      
      const mockBugs = [
        { _id: '1', title: 'Bug 1', status: 'open' }
      ];
      
      Bug.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockBugs)
          })
        })
      });
      Bug.countDocuments.mockResolvedValue(1);

      await getAllBugs(req, res);

      expect(Bug.find).toHaveBeenCalledWith({ status: 'open' });
    });

    test('should handle errors', async () => {
      const error = new Error('Database error');
      Bug.find.mockImplementation(() => {
        throw error;
      });

      await expect(getAllBugs(req, res)).rejects.toThrow(error);
    });
  });

  describe('createBug', () => {
    test('should create a new bug with valid data', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'John Doe'
      };
      
      req.body = bugData;
      
      validateBugData.mockReturnValue({ isValid: true });
      
      const mockSavedBug = { _id: '123', ...bugData };
      Bug.prototype.save = jest.fn().mockResolvedValue(mockSavedBug);
      
      await createBug(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSavedBug,
        message: 'Bug created successfully'
      });
    });

    test('should return validation errors for invalid data', async () => {
      req.body = { title: 'Short' };
      
      validateBugData.mockReturnValue({
        isValid: false,
        errors: ['Title must be at least 3 characters long']
      });

      await createBug(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: ['Title must be at least 3 characters long']
      });
    });

    test('should handle database errors', async () => {
      req.body = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'John Doe'
      };
      
      validateBugData.mockReturnValue({ isValid: true });
      
      const error = new Error('Database error');
      Bug.prototype.save = jest.fn().mockRejectedValue(error);
      
      await expect(createBug(req, res)).rejects.toThrow(error);
    });
  });

  describe('getBugById', () => {
    test('should return a bug by ID', async () => {
      const mockBug = { _id: '123', title: 'Test Bug' };
      req.params.id = '123';
      
      Bug.findById.mockResolvedValue(mockBug);

      await getBugById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockBug
      });
    });

    test('should return 404 for non-existent bug', async () => {
      req.params.id = '123';
      
      Bug.findById.mockResolvedValue(null);

      await getBugById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bug not found'
      });
    });

    test('should handle database errors', async () => {
      req.params.id = '123';
      
      const error = new Error('Database error');
      Bug.findById.mockRejectedValue(error);
      
      await expect(getBugById(req, res)).rejects.toThrow(error);
    });
  });

  describe('updateBug', () => {
    test('should update a bug with valid data', async () => {
      const existingBug = { _id: '123', title: 'Old Title', toObject: () => ({ _id: '123', title: 'Old Title' }) };
      const updateData = { title: 'New Title' };
      const updatedBug = { _id: '123', title: 'New Title' };
      
      req.params.id = '123';
      req.body = updateData;
      
      Bug.findById.mockResolvedValue(existingBug);
      validateBugData.mockReturnValue({ isValid: true });
      Bug.findByIdAndUpdate.mockResolvedValue(updatedBug);

      await updateBug(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedBug,
        message: 'Bug updated successfully'
      });
    });

    test('should return 404 for non-existent bug', async () => {
      req.params.id = '123';
      req.body = { title: 'New Title' };
      
      Bug.findById.mockResolvedValue(null);

      await updateBug(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bug not found'
      });
    });

    test('should return validation errors for invalid update data', async () => {
      const existingBug = { _id: '123', title: 'Old Title', toObject: () => ({ _id: '123', title: 'Old Title' }) };
      
      req.params.id = '123';
      req.body = { title: 'X' }; // Too short
      
      Bug.findById.mockResolvedValue(existingBug);
      validateBugData.mockReturnValue({
        isValid: false,
        errors: ['Title must be at least 3 characters long']
      });

      await updateBug(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: ['Title must be at least 3 characters long']
      });
    });

    test('should handle database errors', async () => {
      req.params.id = '123';
      req.body = { title: 'New Title' };
      
      const error = new Error('Database error');
      Bug.findById.mockRejectedValue(error);
      
      await expect(updateBug(req, res)).rejects.toThrow(error);
    });
  });

  describe('deleteBug', () => {
    test('should delete a bug', async () => {
      const mockBug = { _id: '123', title: 'Test Bug' };
      req.params.id = '123';
      
      Bug.findById.mockResolvedValue(mockBug);
      Bug.findByIdAndDelete.mockResolvedValue(mockBug);

      await deleteBug(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Bug deleted successfully'
      });
    });

    test('should return 404 for non-existent bug', async () => {
      req.params.id = '123';
      
      Bug.findById.mockResolvedValue(null);

      await deleteBug(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bug not found'
      });
    });

    test('should handle database errors', async () => {
      req.params.id = '123';
      
      const error = new Error('Database error');
      Bug.findById.mockRejectedValue(error);
      
      await expect(deleteBug(req, res)).rejects.toThrow(error);
    });
  });
});
