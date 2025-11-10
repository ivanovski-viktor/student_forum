import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  historyExtension,
  listExtension,
  RichText,
  linkExtension,
} from "@lexkit/editor";
import { Link, Link2, Link2Off, List, ListOrdered } from "lucide-react";
import { useEffect } from "react";

// 1. Define extensions
const extensions = [
  boldExtension,
  italicExtension,
  listExtension,
  historyExtension,
  linkExtension,
];

// 2. Create the editor system
const { Provider, useEditor } = createEditorSystem(extensions); // Toolbar Component
function Toolbar() {
  const { commands, activeStates } = useEditor();

  return (
    <div className="flex  flex-wrap gap-1 sm:gap-1.5 lg:justify-evenly border-b border-stroke p-2 bg-box rounded-t-md">
      <button
        type="button"
        className={`lex-button ${activeStates.bold ? "active" : ""}`}
        onClick={() => commands.toggleBold()}
        title="Bold (Ctrl+B)"
      >
        <b>B</b>
      </button>

      <button
        type="button"
        className={`lex-button ${activeStates.italic ? "active" : ""}`}
        onClick={() => commands.toggleItalic()}
        title="Italic (Ctrl+I)"
      >
        <i>I</i>
      </button>

      <button
        type="button"
        className={`lex-button ${activeStates.unorderedList ? "active" : ""}`}
        onClick={() => commands.toggleUnorderedList()}
        title="Bullet List"
      >
        <List size={16} />
      </button>

      <button
        type="button"
        className={`lex-button ${activeStates.orderedList ? "active" : ""}`}
        onClick={() => commands.toggleOrderedList()}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>

      <button
        type="button"
        className={`lex-button ${activeStates.isLink ? "active" : ""}`}
        onClick={() => commands.insertLink()}
        title="Insert Link"
      >
        <Link2 size={16} />
      </button>

      <button
        type="button"
        className="lex-button"
        disabled={!activeStates.isLink}
        onClick={() => commands.removeLink()}
        title="Remove Link"
      >
        <Link2Off size={16} />
      </button>

      <button
        type="button"
        className="lex-button"
        disabled={!activeStates.canUndo}
        onClick={() => commands.undo()}
        title="Undo (Ctrl+Z)"
      >
        ↶
      </button>

      <button
        type="button"
        className="lex-button"
        disabled={!activeStates.canRedo}
        onClick={() => commands.redo()}
        title="Redo (Ctrl+Y)"
      >
        ↷
      </button>
    </div>
  );
} // Editor Component
function Editor({ setContent }) {
  const initialText = "<p>Hello world</p>";
  useEffect(() => {
    const editor = document.querySelector(".js-rte");
    if (!editor) return;

    // Set initial text if not empty
    if (initialText) {
      editor.innerHTML = initialText;
    }

    let hasUserTyped = false;

    const observer = new MutationObserver(() => {
      const text = editor.innerHTML;

      // If user hasn't typed yet, ignore mutations from initial render
      if (!hasUserTyped && text === initialText) return;

      hasUserTyped = true;
      setContent(text);
    });

    observer.observe(editor, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [initialText, setContent]);

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
