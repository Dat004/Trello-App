import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserAuth } from "@/context/AuthContext";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const { isLogged, user } = UserAuth();

  useEffect(() => {
    if (!isLogged) navigate("/login");
  }, [isLogged]);

  return (
    <div className="h-screen bg-background">
      <section className="flex flex-nowrap h-full">
        {/* ASIDE */}
        <section className="fixed hidden">
          <Sidebar />
        </section>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-auto">
          <section>
            <Header userData={user} />
            <section className="container mx-auto p-4 md:p-6 animate-fade-in">
              {user && children}
            </section>
          </section>
        </main>
      </section>
    </div>
  );
}

export default DefaultLayout;
