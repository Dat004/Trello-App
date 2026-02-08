import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

function DefaultLayout({ children }) {
  return (
    <div className="h-screen bg-background">
      <section className="flex flex-nowrap h-full">
        {/* ASIDE */}
        <section className="">
          <Sidebar />
        </section>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-auto">
          <section>
            <Header />
            <section className="container mx-auto p-4 md:p-6 animate-fade-in">
              {children}
            </section>
          </section>
        </main>
      </section>
    </div>
  );
}

export default DefaultLayout;
