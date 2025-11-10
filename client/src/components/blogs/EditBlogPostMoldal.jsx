import { useEffect, useState } from "react";
import Modal from "react-modal";
import Input from "../ui/Input";
import RichTextEditor from "../ui/LexEditor";
import MultiFileUploader from "../ui/MultiFileUploader";
import Button from "../ui/Button";
import { X } from "lucide-react";

Modal.setAppElement("#root");
const apiUrl = import.meta.env.VITE_API_URL;

export default function EditPostModal({ isOpen, onClose, post }) {
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1); // Step 1 = post info, Step 2 = media
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Prefill fields when post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.description || "");
      setFiles([]);
      setStep(1);
      setError("");
    }
  }, [post]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content || content === "<p></p>") {
      setError("Content is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title, description: content }),
      });
      if (!res.ok) throw new Error("Failed to update post");

      setStep(2); // move to media step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMedia = async (e) => {
    e.preventDefault();
    if (!files.length) return handleClose(true);

    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("post_media", f));

    try {
      const res = await fetch(`${apiUrl}/posts/${post.id}/media`, {
        method: "POST",
        headers: { Authorization: token },
        body: formData,
      });
      if (!res.ok) throw new Error("Media upload failed");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      handleClose(true); // refresh page after step 2
    }
  };

  const handleClose = (refresh = false) => {
    const wasStep2 = step === 2;

    setStep(1);
    setTitle("");
    setContent("");
    setFiles([]);
    setError("");
    onClose();

    if (wasStep2 || refresh) {
      window.location.reload();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => handleClose(false)}
      shouldCloseOnOverlayClick
      overlayClassName={{
        base: "fixed inset-0 bg-transparent z-[99] flex justify-center items-start overflow-y-auto transition-colors duration-300 px-6",
        afterOpen: "!bg-background/80",
      }}
      className="relative w-full max-w-lg mx-auto my-20 bg-background rounded-xl border border-stroke shadow-2xl outline-none"
    >
      {step === 1 && (
        <form
          onSubmit={handleSubmitPost}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Уреди објава</h2>
            <button type="button" onClick={() => handleClose(false)}>
              <X className="text-xl" />
            </button>
          </div>

          <Input
            value={title}
            className="input input--secondary outline-0"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Наслов на објавата..."
          />

          <RichTextEditor initialContent={content} setContent={setContent} />

          {error && <p className="text-red-500">{error}</p>}

          <Button
            buttonType="form"
            text={loading ? "Се ажурира..." : "Следно"}
            disabled={loading}
          />
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmitMedia}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Замени медија(опционално)</h2>
            <button type="button" onClick={() => handleClose(true)}>
              <X className="text-xl" />
            </button>
          </div>

          <MultiFileUploader files={files} setFiles={setFiles} />

          <div className="flex justify-end gap-2">
            <Button
              buttonType="form"
              text={uploading ? "Се прикачува..." : "Заврши"}
              disabled={uploading}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
