import './App.css'
import { APIProvider } from '@vis.gl/react-google-maps'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SplashScreenPage from './pages/SplashScreenPage/SplashScreenPage'
import WarningPage from './pages/WarningPage/WarningPage'
import DecisionPage from './pages/DecisionPage/DecisionPage'
import StationsPage from './pages/StationsPage/StationsPage'
import ETAPage from './pages/ETAPage/ETAPage'
import TripQuestionsPage from './pages/TripQuestionsPage/TripQuestionsPage'
import TripDurationPage from './pages/TripDurationPage/TripDurationPage'

function App() {

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreenPage />} />
            <Route path="/warning" element={<WarningPage />} />
            <Route path="/decision" element={<DecisionPage />} />
            <Route path="/stations" element={<StationsPage />} />
            <Route path="/eta/:stationId" element={<ETAPage />} />
            <Route path="/trip" element={<TripQuestionsPage />} />
            <Route path="/trip/eta/:originStationId/:destinationStationId" element={<TripDurationPage />} />
          </Routes>
        </BrowserRouter>
      </APIProvider>
  )
}

export default App
