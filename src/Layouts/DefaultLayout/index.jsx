import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

function DefaultLayout({ children }) {
  return (
    <div className="h-screen bg-background">
      <section className="flex flex-nowrap h-full">
        {/* ASIDE */}
        <Sidebar />
        
        {/* DASHBOARD CONTENT */}
        <main className="flex-1">
          <section>
            <Header />
            {children}
          </section>
        </main>
      </section>
    </div>
  );
}

export default DefaultLayout;
