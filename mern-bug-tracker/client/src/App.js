import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BugTracker from './components/BugTracker';
import BugTrackerWithBugs from './components/BugTrackerWithBugs';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import './components/ErrorBoundary.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ErrorBoundary>
          <main>
            <nav>
              <ul>
                <li><Link to="/">Standard Bug Tracker</Link></li>
                <li><Link to="/bugs">Buggy Bug Tracker</Link></li>
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<BugTracker />} />
              <Route path="/bugs" element={
                <ErrorBoundary>
                  <BugTrackerWithBugs />
                </ErrorBoundary>
              } />
            </Routes>
          </main>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
