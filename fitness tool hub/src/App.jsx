import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import BMICalculator from '@/pages/BMICalculator';
import BodyFatCalculator from '@/pages/BodyFatCalculator';
import CalorieBurnCalculator from '@/pages/CalorieBurnCalculator';
import Home from '@/pages/Home';
import OneRepMaxCalculator from '@/pages/OneRepMaxCalculator';
import OutdoorWorkoutGenerator from '@/pages/OutdoorWorkoutGenerator';
import ProteinCalculator from '@/pages/ProteinCalculator';
import RunningPaceCalculator from '@/pages/RunningPaceCalculator';
import TDEECalculator from '@/pages/TDEECalculator';
import Tools from '@/pages/Tools';
import WaterIntakeCalculator from '@/pages/WaterIntakeCalculator';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/bmi-calculator" element={<BMICalculator />} />
      <Route path="/tools/macro-calculator" element={<Home />} />
      <Route path="/tools/tdee-calculator" element={<TDEECalculator />} />
      <Route path="/tools/protein-calculator" element={<ProteinCalculator />} />
      <Route path="/tools/water-intake-calculator" element={<WaterIntakeCalculator />} />
      <Route path="/tools/one-rep-max-calculator" element={<OneRepMaxCalculator />} />
      <Route path="/tools/running-pace-calculator" element={<RunningPaceCalculator />} />
      <Route path="/tools/body-fat-calculator" element={<BodyFatCalculator />} />
      <Route path="/tools/calorie-burn-calculator" element={<CalorieBurnCalculator />} />
      <Route path="/tools/outdoor-workout-generator" element={<OutdoorWorkoutGenerator />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
