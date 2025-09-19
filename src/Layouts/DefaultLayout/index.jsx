import DashBoard from "./Components/DashBoard";
import Sidebar from "./Components/Sidebar";

function DefaultLayout() {
  return (
    <div className="h-screen bg-background">
      <section className="flex flex-nowrap h-full">
        {/* ASIDE */}
        <Sidebar />
        {/* DASHBOARD CONTENT */}
        <DashBoard />
      </section>
    </div>
  );
}

export default DefaultLayout;
