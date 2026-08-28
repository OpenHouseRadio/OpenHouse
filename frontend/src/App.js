import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { PlayerProvider } from "@/lib/player";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PlayerBar from "@/components/PlayerBar";
import Home from "@/pages/Home";
import Radio from "@/pages/Radio";
import Shows from "@/pages/Shows";
import ShowDetail from "@/pages/ShowDetail";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import About from "@/pages/About";
import Submit from "@/pages/Submit";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function PageShell({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageShell><Home /></PageShell>} />
        <Route path="/radio" element={<PageShell><Radio /></PageShell>} />
        <Route path="/shows" element={<PageShell><Shows /></PageShell>} />
        <Route path="/shows/:slug" element={<PageShell><ShowDetail /></PageShell>} />
        <Route path="/projects" element={<PageShell><Projects /></PageShell>} />
        <Route path="/projects/:slug" element={<PageShell><ProjectDetail /></PageShell>} />
        <Route path="/about" element={<PageShell><About /></PageShell>} />
        <Route path="/submit" element={<PageShell><Submit /></PageShell>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <div className="noise-overlay" aria-hidden="true" />
      <BrowserRouter>
        <PlayerProvider>
          <ScrollToTop />
          <Nav />
          <AnimatedRoutes />
          <Footer />
          <PlayerBar />
          <Toaster position="bottom-right" toastOptions={{ style: { background: "#252523", color: "#F9F8F6", border: "none", borderRadius: "2px" } }} />
        </PlayerProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
