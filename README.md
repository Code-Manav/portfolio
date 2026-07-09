# Developer Portfolio

Welcome to the repository for my personal developer portfolio! This project showcases my coding projects, technical skills, and professional experience.


## Live Demo
Check out the live version of my portfolio deployed on Vercel:
**[https://kevins-dev-portfolio.vercel.app/](https://kevins-dev-portfolio.vercel.app/)**

## ✨ Features
- **Modern & Premium UI**: A clean, dynamic, and sleek user interface.
- **Fully Responsive**: Optimized seamlessly across desktops, tablets, and mobile devices.
- **Working Contact Form**: Integrated with EmailJS to forward messages directly to my inbox without needing a custom backend.
- **Fast Performance**: Built on Vite for lightning-fast hot module replacement (HMR) and optimized build times.

## 🛠️ Technology Stack
This project leverages modern frontend tools and frameworks:

- **Core Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Email Service**: [EmailJS](https://www.emailjs.com/)
- **Hosting**: [Vercel](https://vercel.com/)

## 🚀 Getting Started Locally

If you'd like to explore the code or run this project on your local machine, follow these steps:

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed on your operating system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kevinthomas9898/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup (Optional but recommended):**
   If you wish to test the contact form functionality, you will need to add your own EmailJS credentials. Create a `.env` file in the root directory and add:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **View the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 📦 Build & Deploy

To generate an optimized production build, run:
```bash
npm run build
```
This commands compiles TypeScript and bundles the app using Vite into the `dist` folder. The outputs in the `dist` folder can be hosted on any static hosting provider.

## 📫 Get In Touch

Feel free to connect with me! You can reach me through the contact form on my [live portfolio site](https://kevins-dev-portfolio.vercel.app/).