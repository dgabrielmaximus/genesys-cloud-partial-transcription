import React from 'react';
import './App.css';
// import { CurrentConversation } from './components/conversation/CurrentConversation';
import { CurrentCall } from './components/conversation/CurrentCall';

function App() {
  return (
    <div className="App">
      {/* <QueueList/> */}
      {/* <CurrentConversation/> */}
      <CurrentCall/>
    </div>
  );
}

export default App;
