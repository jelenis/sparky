import './App.css'
import { Route, Routes } from 'react-router'
import VoltageDrop from './pages/VoltageDrop'
import Header from './components/Header'

function App() {
  
  return (
    <Routes>
      <Route element={<Header/>}>
        <Route path='/' element={<VoltageDrop />} />
      </Route>
    </Routes>
  )
}

export default App
