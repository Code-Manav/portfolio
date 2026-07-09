import React from "react";
import { Navbar, Footer, Hero2, Form, FadeInUp } from "../components";

const Contact: React.FC = () => {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero2 
        heading="CONTACT" 
        text="Let's build something extraordinary together." 
        img="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1200&q=80"
      />
      <div className="py-12 md:py-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <FadeInUp>
          <h2 className="text-accent text-sm font-black tracking-[0.4em] uppercase mb-4 text-center">
            Inquiry Form
          </h2>
        </FadeInUp>
        <Form />
      </div>
      <Footer />
    </main>
  );
};

export default Contact;
