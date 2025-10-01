import { ThemeProvider } from "@/components/theme-provider";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter, Routes, Route } from "react-router";

import Navbar from "@/components/molecules/navbar/navbar";
import Footer from "@/components/molecules/footer/footer";
import Home from "@/components/features/Home";
import Room from "@/components/features/Room";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ConvexProvider client={convex}>
          <Navbar />
          <main className="min-h-screen">
            <Routes>
               <Route index element={<Home />} />
               <Route path="room" element={<Room />} />
            </Routes>
          </main>
          <Footer />
        </ConvexProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
