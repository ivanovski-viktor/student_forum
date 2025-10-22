"use client";
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  historyExtension,
  listExtension,
  RichText,
} from "@lexkit/editor";
import { useEffect } from "react"; // 1. Define extensions

const extensions = [
  boldExtension,
  italicExtension,
  listExtension,
  historyExtension,
]; // 2. Create the editor system
const { Provider, useEditor } = createEditorSystem(extensions); // Toolbar Component
function Toolbar() {
  const { commands, activeStates } = useEditor();
  const buttonClasses = (isActive, isDisabled) =>
    [
      " px-2 py-1 text-xs sm:px-3 sm:py-1.5 rounded-md sm:text-sm font-medium transition-colors text-sm",
      isDisabled
        ? "opacity-50 cursor-not-allowed bg-gray-100"
        : isActive
        ? "bg-primary/10 text-primary border border-primary"
        : "hover:bg-primary/10 border border-stroke text-foreground",
    ].join(" ");
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 border-b border-stroke p-2 bg-box rounded-t-md">
      {" "}
      <button
        type="button"
        onClick={() => commands.toggleBold()}
        className={buttonClasses(activeStates.bold)}
        title="Bold (Ctrl+B)"
      >
        {" "}
        <b>B</b>{" "}
      </button>{" "}
      <button
        type="button"
        onClick={() => commands.toggleItalic()}
        className={buttonClasses(activeStates.italic)}
        title="Italic (Ctrl+I)"
      >
        {" "}
        <i>I</i>{" "}
      </button>{" "}
      <button
        type="button"
        onClick={() => commands.toggleUnorderedList()}
        className={buttonClasses(activeStates.unorderedList)}
        title="Bullet List"
      >
        {" "}
        • List{" "}
      </button>{" "}
      <button
        type="button"
        onClick={() => commands.toggleOrderedList()}
        className={buttonClasses(activeStates.orderedList)}
        title="Numbered List"
      >
        {" "}
        1. List{" "}
      </button>{" "}
      <button
        type="button"
        onClick={() => commands.undo()}
        disabled={!activeStates.canUndo}
        className={buttonClasses(false, !activeStates.canUndo)}
        title="Undo (Ctrl+Z)"
      >
        {" "}
        ↶{" "}
      </button>{" "}
      <button
        type="button"
        onClick={() => commands.redo()}
        disabled={!activeStates.canRedo}
        className={buttonClasses(false, !activeStates.canRedo)}
        title="Redo (Ctrl+Y)"
      >
        {" "}
        ↷{" "}
      </button>{" "}
    </div>
  );
} // Editor Component
function Editor({ setContent }) {
  useEffect(() => {
    const editor = document.querySelector(".js-rte");
    if (!editor) return; // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      setContent(() => editor.innerHTML);
    });
    observer.observe(editor, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div className="w-full border border-stroke rounded-md shadow-sm overflow-hidden">
      <Toolbar />
      <div className="p-4 w-full">
        <RichText
          classNames={{
            container: "w-full",
            contentEditable: "js-rte focus:outline-none min-h-32",
            placeholder: "text-stroke select-none pointer-events-none absolute",
          }}
          placeholder="Почни да ја пишуваш твојата објава..."
        />
      </div>
    </div>
  );
} // Main Component
export default function RichTextEditor({ setContent }) {
  return (
    <Provider extensions={extensions}>
      <Editor setContent={setContent} />
    </Provider>
  );
}
