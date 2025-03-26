
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";

const Layout = () => {
  // Add page transition effect on route change
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.classList.add("animate-enter");
      const timer = setTimeout(() => {
        main.classList.remove("animate-enter");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="py-6 border-t border-border bg-secondary/30 backdrop-blur-sm">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Referral Champion. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
