import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button"
import Radio from "@mui/material/Radio"
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, RadioGroup, Typography } from '@mui/material';
import shortSound from '../../sound/short.mp3';
import middileSound from '../../sound/middle.mp3';
import longSound from '../../sound/long.mp3';
import Cofetti from 'react-confetti';

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
    result[nums] = {name: "　", department: "　", reading: "　"};
  }
  return result;
}

function playDrumSound(l) {
  let audio;
  console.log(l);
  if (l === "short") {
    audio = new Audio(shortSound);
  } else if (l === "middle") {
    audio = new Audio(middileSound);
  } else if (l === "long") {
    audio = new Audio(longSound);
  } else {
    audio = new Audio(middileSound);
    console.log("error");
  }

  audio.volume = 1.0;
  audio.play();
}

export function Lottery(
  { users, setUsers, winningUsers, setWinningUsers, gifts, setGifts }
) {  
    const [nowGift, setNowGift] = useState(gifts[0]);
    const randomIndex = Math.floor(Math.random() * users.length);
    const [selectedUsers, setSelectedUsers] = useState([users[randomIndex]]);
    const [drumrollLength, setDrumrollLength] = useState("middle");

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
      {!disabledStartLottery ? null : 
      <Cofetti
        width={window.innerWidth}
        height={window.innerHeight}
        run={disabledStartLottery}
        numberOfPieces={drumrollLength==="long" ? 360 : 60}
      />
      }
      <div style={{height:"90%", width:"100%", display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
        <Card sx={{ minWidth: "50%"}}>
            <CardContent> 
              <Typography variant="h4" component="div">
                {nowGift.gift} {nowGift.unit}名様
              </Typography>
             </CardContent> 
            {selectedUsers.map((user, index) => (
                <CardContent>
                    <Typography variant="h5" color="text.secondary">
                        {user.department}
                    </Typography>
                    <Typography variant="h4" component="div">
                        {user.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {user.reading}
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
            playDrumSound(drumrollLength); 
            const soundLength = drumrollLength === "short" ? 1750 : drumrollLength === "middle" ? 3900 : 5900;
            const interval = setInterval(() => {
              setSelectedUsers(getRandom(users, nowGift.unit));
            }, 50);
            setTimeout(() => {
              clearInterval(interval);
              setDisabledStartLottery(true);
            }, soundLength);
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
            setWinningUsers([...winningUsers, ...tmpArr]);
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
            const csvtext = winningUsers.map((user) => {
              return `${user.user.department},${user.user.name},${user.user.reading},${user.gift.gift}`;
            }).join("\n");
            const data = new Blob([csvtext], {type: 'text/csv'});
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.href = window.URL.createObjectURL(data);
            link.setAttribute('download', '抽選当選者一覧.csv');
            link.click();
          }}
          >
            終了
        </Button> 
        }
        <FormControl style={{left: 10}}>
          <RadioGroup
            row
            value={drumrollLength}
            onChange={(e) => {
              console.log(e.target.value);
              setDrumrollLength(e.target.value);
            }}
            >
            <FormControlLabel value="short" control={<Radio />} label="short" />
            <FormControlLabel value="middle" control={<Radio />} label="middle" />
            <FormControlLabel value="long" control={<Radio />} label="long" />
          </RadioGroup>
        </FormControl>
    </div>
  );
}
