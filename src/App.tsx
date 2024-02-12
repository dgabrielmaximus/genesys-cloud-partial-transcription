import React from 'react';
import './App.css';
import { CurrentConversation } from './components/conversation/CurrentConversation';

function App() {
  return (
    <div className="App">
      {/* <QueueList/> */}
      <CurrentConversation/>
    </div>
  );
}

export default App;
