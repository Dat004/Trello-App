import { useEffect, useState } from "react";

export function useKeyboardShortcuts() {
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isInput =
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName) ||
        document.activeElement?.isContentEditable;

      // Ctrl + K or Cmd + K: Open Global Search
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const searchInput = document.querySelector(
          "input[placeholder*='Search'], input[placeholder*='Tìm kiếm']"
        );
        if (searchInput) {
          searchInput.focus();
        } else {
          // Trigger search button
          const searchBtn = document.querySelector("button[aria-label*='Search'], button[aria-label*='Tìm kiếm']");
          searchBtn?.click();
        }
        return;
      }

      // Ctrl + B or Cmd + B: Open Create Board Dialog
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setCreateBoardOpen(true);
        return;
      }

      // Shift + ? or ? (when not inside input): Open Shortcuts Dialog
      if (!isInput && event.key === "?") {
        event.preventDefault();
        setShortcutsDialogOpen((prev) => !prev);
        return;
      }

      // N key (when not inside input): Create Card button on Board page
      if (!isInput && event.key.toLowerCase() === "n" && !event.ctrlKey && !event.metaKey) {
        // Find add card button in board list
        const addCardBtns = Array.from(document.querySelectorAll("button")).filter(
          (btn) => btn.textContent?.includes("Thêm thẻ")
        );
        if (addCardBtns.length > 0) {
          event.preventDefault();
          addCardBtns[0].click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    shortcutsDialogOpen,
    setShortcutsDialogOpen,
    createBoardOpen,
    setCreateBoardOpen,
  };
}
