import React from 'react';
import { render, screen } from '@testing-library/react';
import BugList from '../components/BugList';

/**
 * Unit tests for BugList component
 */
describe('BugList component', () => {
  test('renders no bugs when list is empty', () => {
    render(<BugList bugs={[]} />);
    const noBugsMessage = screen.getByText(/No bugs reported/i);
    expect(noBugsMessage).toBeInTheDocument();
  });

  test('renders bugs when list is provided', () => {
    const bugs = [
      { id: '1', title: 'Bug 1', description: 'Description 1' },
      { id: '2', title: 'Bug 2', description: 'Description 2' },
    ];
    render(<BugList bugs={bugs} />);

    bugs.forEach(bug => {
      const bugTitle = screen.getByText(new RegExp(bug.title, 'i'));
      expect(bugTitle).toBeInTheDocument();
    });
  });
});
