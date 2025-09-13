import { useState } from 'react'

import './App.css'

import { BrowserRouter,Routes,Route } from 'react-router-dom'

import LoginPage from './components/Login'
import Error from './components/Error'
import Landing from './components/Landing'

import AboutUs from "./components/About"

import DashboardSection from './components/Dashboard'
import OffersPage from './components/Offers'
import Subscription from './components/Subscription'
import Contact from './components/Contact'

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/offers" element={<OffersPage/>}/>
        
        <Route path="/login" element={<LoginPage />} />
    
        <Route path="/about" element={<AboutUs/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/dashboard" element={<DashboardSection/>}/>


        <Route path="/subscribe" element={<Subscription/>}/>
       

       <Route path="/error"  element={<Error/>}/>
      
      </Routes>
    </BrowserRouter>
  )
}

export default App
