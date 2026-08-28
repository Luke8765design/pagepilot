import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "@/context/BookingContext";
import { Toaster } from "@/components/ui/sonner";
import { BookCallDialog } from "@/components/site/BookCallDialog";
import LandingPage from "@/pages/LandingPage";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <BookingProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <BookCallDialog />
          <Toaster position="top-center" richColors />
        </BookingProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
