import './App.css'
import { Route, Routes } from 'react-router'
import VoltageDrop from './pages/VoltageDrop'
import Header from './components/Header'
import { APIProvider } from "@vis.gl/react-google-maps";
function App() {

  return (
    <Routes>
      <Route element={<Header />}>

        <Route path='/' element={
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
            <VoltageDrop />
          </APIProvider>} />
      </Route>
    </Routes>
  )
}

export default App
