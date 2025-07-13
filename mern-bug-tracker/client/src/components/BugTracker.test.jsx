import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BugTracker from './BugTracker';
import bugService from '../services/bugService';

// Mock the bug service
jest.mock('../services/bugService');

const mockBugs = [
  {
    _id: '1',
    title: 'Test Bug 1',
    description: 'This is a test bug description',
    severity: 'high',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe',
    assignee: 'Jane Smith',
    tags: ['frontend', 'urgent'],
    createdAt: '2023-01-01T00:00:00.000Z',
    dueDate: '2023-12-31T00:00:00.000Z'
  },
  {
    _id: '2',
    title: 'Test Bug 2',
    description: 'Another test bug',
    severity: 'medium',
    status: 'in-progress',
    priority: 'medium',
    reporter: 'Alice Johnson',
    createdAt: '2023-01-02T00:00:00.000Z'
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BugTracker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders bug tracker with initial bugs', async () => {
    bugService.getAllBugs.mockResolvedValue({ data: mockBugs });

    renderWithRouter(<BugTracker />);

    expect(screen.getByText('MERN Bug Tracker')).toBeInTheDocument();
    expect(screen.getByText('Report New Bug')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('displays empty state when no bugs exist', async () => {
    bugService.getAllBugs.mockResolvedValue({ data: [] });

    renderWithRouter(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByText('No bugs reported')).toBeInTheDocument();
    });
  });

  test('opens bug form when "Report New Bug" is clicked', async () => {
    bugService.getAllBugs.mockResolvedValue({ data: mockBugs });

    renderWithRouter(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Report New Bug'));

    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
  });

  test('handles bug creation', async () => {
    bugService.getAllBugs.mockResolvedValue({ data: [] });
    bugService.createBug.mockResolvedValue({
      data: {
        _id: '3',
        title: 'New Bug',
        description: 'New bug description',
        severity: 'low',
        status: 'open',
        priority: 'low',
        reporter: 'Test User',
        createdAt: '2023-01-03T00:00:00.000Z'
      }
    });

    renderWithRouter(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByText('No bugs reported')).toBeInTheDocument();
    });

    // Open form
    fireEvent.click(screen.getByText('Report New Bug'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'New Bug' } });
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'New bug description' } });
    fireEvent.change(screen.getByLabelText('Reporter *'), { target: { value: 'Test User' } });

    // Submit form
    fireEvent.click(screen.getByText('Create Bug'));

    await waitFor(() => {
      expect(bugService.createBug).toHaveBeenCalledWith({
        title: 'New Bug',
        description: 'New bug description',
        severity: 'medium',
        status: 'open',
        priority: 'medium',
        reporter: 'Test User',
        assignee: '',
        tags: [],
        stepsToReproduce: [],
        dueDate: null
      });
    });
  });

  test('handles bug deletion', async () => {
    bugService.getAllBugs.mockResolvedValue({ data: mockBugs });
    bugService.deleteBug.mockResolvedValue({});

    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true);

    renderWithRouter(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(bugService.deleteBug).toHaveBeenCalledWith('1');
    });
  });

  test('handles bug editing', async () => {
    bugService.getAllBugs.mockResolvedValue({ data: mockBugs });
    bugService.updateBug.mockResolvedValue({});

    renderWithRouter(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Form should be pre-filled
    expect(screen.getByDisplayValue('Test Bug 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test bug description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();

    // Update title
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'Updated Bug Title' } });

    // Submit form
    fireEvent.click(screen.getByText('Update Bug'));

    await waitFor(() => {
      expect(bugService.updateBug).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Bug Title'
      }));
    });
  });

  test('handles API errors gracefully', async () => {
    bugService.getAllBugs.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load bugs.')).toBeInTheDocument();
    });
  });

  test('displays bug details correctly', async () => {
    bugService.getAllBugs.mockResolvedValue({ data: mockBugs });

    renderWithRouter(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('This is a test bug description')).toBeInTheDocument();
      expect(screen.getByText('Reporter: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Assignee: Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('frontend')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
    });
  });
});
