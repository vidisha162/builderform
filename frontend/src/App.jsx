import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormBuilder from "./pages/FormBuilder";
import FormPreview from "./pages/FormPreview";
import ThankYou from "./pages/ThankYou";
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
         <Route path="/preview" element={<FormPreview />} />
         <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </Router>
  )
}

export default App
