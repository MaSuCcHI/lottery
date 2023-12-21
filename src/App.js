import logo from './logo.svg';
import './App.css';
import { Lottery } from './views/lottery/lottery';
import { Setting } from './views/setting/setting';
import React from 'react';
import { useState,useEffect } from 'react';

function App() {
  const [isSettingOpen, setSettingOpen] = useState(true);
  const [users, setUsers] = useState([{department: "test", name: "test"}]);
  const [winningUsers, setWinningUsers] = useState([]);
  const [gifts, setGifts] = useState([{gigt: "test", nums: 1}]);

  return (
    <div className="App">
      <Lottery 
        users={users}
        setUsers={setUsers}
        winningUsers={winningUsers}
        setWinningUsers={setWinningUsers}
        gifts={gifts}
        setGifts={setGifts}
      />
      <Setting 
        isSettingOpen={isSettingOpen}
        setSettingOpen={setSettingOpen}
        users={users}
        setUsers={setUsers}
        gifts={gifts}
        setGifts={setGifts}
      />
    </div>
  );
}

export default App;
