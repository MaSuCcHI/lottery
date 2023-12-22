import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button"
import { Card, CardContent, Typography } from '@mui/material';
import middileSound from '../../sound/middle.mp3';

function getRandom(arr, nums=1) {
  var result = new Array(nums), 
      len = arr.length, 
      taken = new Array(len);
  if (nums > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (nums--) {
      var x = Math.floor(Math.random() * len);
      result[nums] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function getBlankUsers(nums=1) {
  var result = new Array(nums);
  while (nums--) {
    result[nums] = {name: "　", department: "　"};
  }
  return result;
}

function playDrumSound(l=1) {
  const audio = new Audio(middileSound);
  audio.volume = 0.5;
  audio.play();
}

export function Lottery(
  { users, setUsers, winningUsers, setWinningUsers, gifts, setGifts }
) {  
    const [nowGift, setNowGift] = useState(gifts[0]);
    const randomIndex = Math.floor(Math.random() * users.length);
    const [selectedUsers, setSelectedUsers] = useState([users[randomIndex]]);

    const [ disabledStartLottery, setDisabledStartLottery ] = useState(false);
     useEffect(() => {
        setNowGift(gifts[0]);
     }, [gifts]);

     useEffect(() => {
      // nowGift.num 個数　usesからランダムに選ぶ
        // setSelectedUsers(getRandom(users, nowGift.unit));
        setSelectedUsers(getBlankUsers(nowGift.unit));
     }, [nowGift]);

     useEffect(() => {
      // nowGift.num 個数　usesからランダムに選ぶ
        console.log(winningUsers);
     }, [winningUsers]);


  return (
    <div style={{height:"100%",backgroundColor:"yellow", textAlign:"center"}}>
      <h1>
        抽選会
      </h1>
      <div style={{height:"90%", width:"100%", display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
        <Card sx={{ minWidth: "50%", margin: 30}}>
            <CardContent> 
              {nowGift.gift} {nowGift.unit}名様
             </CardContent> 
            {selectedUsers.map((user, index) => (
                <CardContent>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {user.department}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {user.name}
                    </Typography>
                </CardContent>
            ))}
            <CardContent>
              残り {gifts.length}景品
            </CardContent>
        </Card>
      </div>
        <Button 
          disabled={disabledStartLottery}
          variant="contained"
          onClick={()=>{
            playDrumSound(); 
            const interval = setInterval(() => {
              setSelectedUsers(getRandom(users, nowGift.unit));
            }, 50);
            setTimeout(() => {
              clearInterval(interval);
              setDisabledStartLottery(true);
            }, 3900);
          }}> 
                抽選開始
        </Button>
        {gifts.length !== 1 ?
        <Button 
          disabled={!disabledStartLottery}
          variant="contained"
          onClick={()=>{
            setGifts(gifts.slice(1));
            const tmpArr = selectedUsers.map((user) => {return{user: user, gift: nowGift}});
            setWinningUsers([...winningUsers, tmpArr]);
            setUsers(users.filter((user) => !selectedUsers.includes(user)));
            setDisabledStartLottery(false);
          }} 
          > 
            次の景品へ
        </Button>
        :
        <Button 
          variant="contained" 
          onClick={()=>{
            // winningUsersをファイルに書き出す
            console.log(winningUsers);
            const data = new Blob([JSON.stringify(winningUsers)], {type: 'text/json'});
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.href = window.URL.createObjectURL(data);
            link.setAttribute('download', '抽選当選者一覧.json');
            link.click();
          }}
          >
            終了
        </Button> 
        }
    </div>
  );
}
