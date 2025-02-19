import { useState,useEffect } from 'react'

import './App.css'
import Navbar from "./components/Navbar/Navbar"
import {Routes,Route} from "react-router-dom"
import MainPage from "./components/Pages/MainPage"
import PersistLogin from "./components/PersistLogin/PersistLogin"
import AnotherPage from "./components/Pages/AnotherPage"
import ProtectedRoute from './components/PersistLogin/ProtectedRoute'
import ErrorPage from './components/Pages/errorPage'
import {withLogout} from "./helpers/helperFunctions"


function App() {

  useEffect(()=>{

    window.addEventListener("storage",withLogout);

    return ()=>{

      window.removeEventListener("storage",withLogout);

    }

  },[]);


  return (
    <div className="app" >
  <Navbar></Navbar>
  <div style={{display:"flex",width:"100%",flexDirection:"column",flex:1}}>
  <Routes >
    <Route element={<PersistLogin/>}>
    <Route index element={<MainPage/>}/>

    <Route element={<ProtectedRoute/>}>
    <Route path="anotherpage" element={<AnotherPage/>}/>
    <Route path="mypage" element={<AnotherPage/>}/>
    </Route>

    <Route path="*" element={<ErrorPage/>}/>

    </Route>
  </Routes>
  </div>
        </div>
  )
}

export default App
