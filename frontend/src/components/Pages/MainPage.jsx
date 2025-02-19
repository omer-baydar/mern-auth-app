import react,{useState} from "react"
import AnotherPage from "./AnotherPage"
import {useNavigate} from "react-router-dom"

const MainPage =()=>{

    const navigate = useNavigate();


    return (
        <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center"}}>
            Anasayfa
        </div>
    )
}


export default MainPage