const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const Bug = require('../../models/Bug');

// Mock the logger to avoid console spam during tests
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  http: jest.fn((req, res, next) => next())
}));

describe('Bug Routes Integration Tests', () => {
  let bugId;

  beforeEach(async () => {
    // Clear the database before each test
    await Bug.deleteMany({});
  });

  afterAll(async () => {
    // Clean up database connection
    await mongoose.connection.close();
  });

  describe('POST /api/bugs', () => {
    test('should create a new bug with valid data', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        reporter: 'John Doe',
        severity: 'medium',
        status: 'open',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(bugData.title);
      expect(response.body.data.description).toBe(bugData.description);
      expect(response.body.data.reporter).toBe(bugData.reporter);
      
      // Store the bug ID for later tests
      bugId = response.body.data._id;
    });

    test('should return validation error for invalid data', async () => {
      const invalidBugData = {
        title: 'Ab', // Too short
        description: 'Short', // Too short
        reporter: '', // Empty
        severity: 'extreme', // Invalid
        status: 'done' // Invalid
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBugData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('should sanitize input data', async () => {
      const bugDataWithScripts = {
        title: '<script>alert("hack")</script>Test Bug',
        description: 'This is a test bug description with javascript:alert("hack") in it',
        reporter: 'John Doe onclick="alert(\'hack\')"',
        severity: 'medium',
        status: 'open',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugDataWithScripts)
        .expect(201);

      expect(response.body.data.title).not.toContain('<script>');
      expect(response.body.data.description).not.toContain('javascript:');
      expect(response.body.data.reporter).not.toContain('onclick');
    });
  });

  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      // Create test bugs
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'First test bug description',
          reporter: 'Alice',
          severity: 'high',
          status: 'open',
          priority: 'high'
        },
        {
          title: 'Bug 2',
          description: 'Second test bug description',
          reporter: 'Bob',
          severity: 'low',
          status: 'resolved',
          priority: 'low'
        }
      ]);
    });

    test('should return all bugs', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    test('should filter bugs by status', async () => {
      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('open');
    });

    test('should filter bugs by severity', async () => {
      const response = await request(app)
        .get('/api/bugs?severity=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].severity).toBe('high');
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/bugs?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });
  });

  describe('GET /api/bugs/:id', () => {
    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Single Bug',
        description: 'Single test bug description',
        reporter: 'Charlie',
        severity: 'medium',
        status: 'in-progress',
        priority: 'medium'
      });
      bugId = bug._id;
    });

    test('should return a single bug by ID', async () => {
      const response = await request(app)
        .get(`/api/bugs/${bugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Single Bug');
      expect(response.body.data._id).toBe(bugId.toString());
    });

    test('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/bugs/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });

    test('should return 400 for invalid bug ID', async () => {
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Update Bug',
        description: 'Bug to be updated',
        reporter: 'Dave',
        severity: 'low',
        status: 'open',
        priority: 'low'
      });
      bugId = bug._id;
    });

    test('should update a bug with valid data', async () => {
      const updateData = {
        title: 'Updated Bug Title',
        status: 'resolved',
        severity: 'high'
      };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.severity).toBe(updateData.severity);
    });

    test('should return validation error for invalid update data', async () => {
      const invalidUpdateData = {
        title: 'A', // Too short
        severity: 'extreme' // Invalid
      };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/bugs/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });

    test('should set resolvedAt when status changes to resolved', async () => {
      const updateData = { status: 'resolved' };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('resolved');
      expect(response.body.data.resolvedAt).toBeDefined();
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Delete Bug',
        description: 'Bug to be deleted',
        reporter: 'Eve',
        severity: 'medium',
        status: 'open',
        priority: 'medium'
      });
      bugId = bug._id;
    });

    test('should delete a bug', async () => {
      const response = await request(app)
        .delete(`/api/bugs/${bugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug deleted successfully');

      // Verify the bug is actually deleted
      const deletedBug = await Bug.findById(bugId);
      expect(deletedBug).toBeNull();
    });

    test('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/bugs/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });

    test('should return 400 for invalid bug ID', async () => {
      const response = await request(app)
        .delete('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors', async () => {
      // Mock mongoose to throw an error
      jest.spyOn(Bug, 'find').mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/bugs')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();

      // Restore the original method
      Bug.find.mockRestore();
    });

    test('should handle validation errors properly', async () => {
      const invalidBugData = {
        title: '', // Missing required field
        description: '', // Missing required field
        reporter: '' // Missing required field
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBugData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });
});
