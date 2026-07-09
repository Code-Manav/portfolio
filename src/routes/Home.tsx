import React from 'react'
import { Navbar, Footer, HeroImage, Work, Experience, TechMarquee } from "../components";

const Home: React.FC = () => {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Navbar />
      <div id="hero">
        <HeroImage />
      </div>
      <TechMarquee />
      <div id="projects">
        <Work />
      </div>
      <div id="experience">
        <Experience />
      </div>
      <Footer />
    </main>
  )
}

export default Home
