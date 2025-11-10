import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Input from "../ui/Input";
import RichTextEditor from "../ui/LexEditor";
import { usePostRequest } from "../../hooks/usePostRequest";
import Message from "../ui/Message";
import Button from "../ui/Button";
import { X } from "lucide-react";
import MultiFileUploader from "../ui/MultiFileUploader";

Modal.setAppElement("#root");
const apiUrl = import.meta.env.VITE_API_URL;

export default function AddBlogPostModal({ isOpen, onClose, url }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1 = post info, Step 2 = media
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [postId, setPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});
  const [uploading, setUploading] = useState(false);

  const {
    exec: createPost,
    loading: creating,
    error: postError,
  } = usePostRequest(url, token);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage({});
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setErrorMessage({});

    if (!title.trim()) {
      setErrorMessage({ type: "title", text: "Please enter a title" });
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setErrorMessage({ type: "content", text: "Please enter content" });
      return;
    }

    const response = await createPost({ title, description: content });

    if (response?.post?.id) {
      setPostId(response.post.id);
      setStep(2); // Move to media step
    }
  };

  const handleSubmitMedia = async (e) => {
    e.preventDefault();
    if (!postId) return;

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("post_media", file));

      setUploading(true);

      try {
        const res = await fetch(`${apiUrl}/posts/${postId}/media`, {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        });

        if (!res.ok) {
          console.error("Media upload failed", res.statusText);
          return;
        }
      } catch (err) {
        console.error("Media upload error", err);
        return;
      } finally {
        setUploading(false);
      }
    }

    handleClose(); // refresh page after step 2
  };

  const handleClose = () => {
    const wasStep2 = step === 2;

    setStep(1);
    setTitle("");
    setContent("");
    setFiles([]);
    setPostId(null);
    setErrorMessage({});
    onClose();

    if (wasStep2) {
      window.location.reload();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
      overlayClassName={{
        base: "fixed inset-0 bg-transparent z-[99] flex justify-center items-start overflow-y-auto transition-all duration-300 px-6",
        afterOpen: "!bg-background/80",
      }}
      className="relative w-full max-w-lg mx-auto my-20 lg:my-36 bg-background rounded-xl border border-stroke shadow-2xl outline-none z-50"
    >
      {step === 1 && (
        <form
          onSubmit={handleSubmitPost}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Креирај објава</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-foreground-light hover:text-foreground text-xl font-bold transition-colors duration-200 ease-in-out"
            >
              <X />
            </button>
          </div>

          <Input
            id="blog-title-input"
            type="text"
            value={title}
            placeholder="Наслов на објавата..."
            className="input input--secondary outline-0"
            onChange={handleInputChange(setTitle)}
          />
          {errorMessage.type === "title" && (
            <Message simple type="error" text={errorMessage.text} />
          )}

          <RichTextEditor setContent={setContent} />
          {errorMessage.type === "content" && (
            <Message simple type="error" text={errorMessage.text} />
          )}

          <Button
            buttonType="form"
            text={creating ? "Објавува..." : "Следно"}
            disabled={creating}
          />

          {postError && <Message type="error" text={postError} />}
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmitMedia}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Додади медија (опционално)</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-foreground-light hover:text-foreground text-xl font-bold transition-colors duration-200 ease-in-out"
            >
              <X />
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
