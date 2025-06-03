import SchoolGrid from './components/SchoolGrid';
import BasicModal from './components/BasicModal';
import './App.css';
import { useState } from 'react';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey(prev => prev + 1);


  return (
    <>
      <div className='gridContaine'>
        <SchoolGrid refreshKey={refreshKey}/>
      </div>
      <div className='buttonContainer'>
        <BasicModal onSchoolCreated={refreshData} />
      </div>
    </>
  );
}

export default App;
