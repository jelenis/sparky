import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import VoltageDrop from './pages/VoltageDrop'
import Header from './components/Header'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <Routes>
      <Route element={<Header/>}>
        <Route path='/' element={<VoltageDrop />} />

      </Route>
    </Routes>
  )
}

export default App
