import React, {Component,useState} from "react";
import Modal from "react-modal";
import Button from "@mui/material/Button"
import Papa from "papaparse";

export function Setting(
    {isSettingOpen, setSettingOpen, users, setUsers, gifts, setGifts}
) {
    const customStyles = {
        content: {
          top: "20%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          hight: "70%",
          transform: "translate(-50%, -50%)",
          minWidth: "40%",
        },
    };
    const [tmpUsers, setTmpUsers] = useState([]);
    const [tmpGifts, setTmpGifts] = useState([]);

    const handleFileUsersUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const result = Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
            });
            console.log(result);
            setTmpUsers(result.data);
        };
        reader.readAsText(file);
    };

    const handleFileGiftsUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          console.log(text);
          const result = Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
            });
            console.log(result);
            setTmpGifts(result.data);
        };
        reader.readAsText(file);
    };

    // ここにコンポーネントのレンダリングロジックを書く
    return (
        <div>
        <Modal isOpen={isSettingOpen} style={customStyles}>
            <Button variant="outlined" component="label">
                抽選対象者リストインポート
                <input type="file" hidden 
                onChange={handleFileUsersUpload}
                />
            </Button>  
            <br/> 
            <Button variant="outlined" component="label">
                抽選景品リストインポート
                <input type="file" hidden 
                onChange={handleFileGiftsUpload}
                />
                </Button>
            <br/>
            <Button variant="contained" 
                onClick={ () => {
                    // TODO 抽選対象者　景品が設定されていることを確認する。
                    // TODO 抽選対象者　景品が設定されていない場合はエラーを表示する。
                    if (users.length === 0) {
                        alert("抽選対象者が設定されていません。");
                        return;
                    }
                    if (gifts.length === 0) {
                        alert("抽選景品が設定されていません。");
                        return;
                    }   
                    setUsers(tmpUsers);
                    setGifts(tmpGifts);
                    setSettingOpen(false);
                }}
            >確定</Button>
        </Modal>
        </div>
    );
}