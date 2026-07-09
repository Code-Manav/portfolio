import React from "react";
import { Navbar, Footer, Hero2, Work } from "../components";

const Project: React.FC = () => {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero2 
        heading="PROJECTS" 
        text="Production applications across enterprise platforms, real-time collaboration tools, and cloud-native backends — built end-to-end with modern engineering practices." 
        img="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80"
      />
      <Work />
      <Footer />
    </main>
  );
};

export default Project;
