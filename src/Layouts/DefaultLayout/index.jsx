import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import KeyboardShortcutsDialog from "@/Components/KeyboardShortcutsDialog";
import BoardFormDialog from "@/features/boards/components/Dialogs/BoardFormDialog";
import { useKeyboardShortcuts } from "@/hooks";

function DefaultLayout({ children }) {
  const {
    shortcutsDialogOpen,
    setShortcutsDialogOpen,
    createBoardOpen,
    setCreateBoardOpen,
  } = useKeyboardShortcuts();

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

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={shortcutsDialogOpen}
        onOpenChange={setShortcutsDialogOpen}
      />

      {/* Controlled Create Board Dialog (Ctrl + B) */}
      <BoardFormDialog
        open={createBoardOpen}
        onOpenChange={setCreateBoardOpen}
      />
    </div>
  );
}

export default DefaultLayout;
