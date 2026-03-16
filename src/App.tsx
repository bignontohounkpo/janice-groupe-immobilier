import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import AnnoncesPage from "./pages/AnnoncesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import LocationPage from "./pages/LocationPage";
import VentePage from "./pages/VentePage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import NettoyagePage from "./pages/NettoyagePage";
import NettoyageDetailPage from "./pages/NettoyageDetailPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/** Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/annonces" element={<AnnoncesPage />} />
          <Route path="/annonces/:slug" element={<PropertyDetailPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/vente" element={<VentePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/nettoyage" element={<NettoyagePage />} />
          <Route path="/nettoyage/:slug" element={<NettoyageDetailPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
