import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SegmentsOverview from './components/SegmentsOverview';
import SegmentBuilder from './components/SegmentBuilder';
import AccountContactManagement from './components/AccountContactManagement';
import './App.css';

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', width: '100%', flexGrow: 1 }}>
      <Router>
        <Routes>
          <Route path="/" element={<SegmentsOverview />} />
          <Route path="/builder" element={<SegmentBuilder />} />
          <Route path="/accounts-contacts" element={<AccountContactManagement />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
