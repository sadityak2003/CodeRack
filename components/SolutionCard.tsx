"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2Icon, TrashIcon } from "lucide-react";
import DefaultAvatar from "../public/images/google.png";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  _id: string;
  title: string;
  platform: string;
  contributor: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  language: string;
  codeSnippet: string;
  description: string;
  currentUserEmail: string;
};

interface User {
  name: string;
  email: string;
  avatarUrl: string;
  description: string;
  leetcode: string;
  gfg: string;
  github: string;
  linkedin: string;
}

export default function SolutionCard({
  _id,
  platform,
  title,
  contributor,
  language,
  codeSnippet,
  description,
  currentUserEmail,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; text: string }[]
  >([]);
  const [loadingResponse, setLoadingResponse] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem("user");
    if (!local) {
      router.push("/");
      return;
    }

    const userData = JSON.parse(local);

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?email=${userData.email}`);
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [router]);

  console.log(user?.email);
  console.log(contributor?.email);

  const handleProfileClick = () => {
    if (contributor?.email === user?.email) {
      router.push(`/profile`);
    } else {
      router.push(`/profile/${contributor?.email}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/solution/${_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete solution");
      router.push("/profile"); // Redirect to profile page after deletion
      router.refresh(); // Refresh the page after deletion
    } catch (error) {
      console.error("Error deleting solution:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", text: chatInput };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setChatInput("");
    setLoadingResponse(true);

    // Detect casual greetings
    const isCasual = /hi|hello|hey|sup|how are you/i.test(chatInput.trim());

    try {
      // ✨ Conversational tone prompt
      const basePrompt = `
You are Gemini, a friendly coding assistant like ChatGPT.
Always respond in a conversational, structured way:
- Start with a short greeting or friendly tone if appropriate
- Keep explanations concise, clear, and readable
- Use bullet points, short paragraphs, and emojis when helpful
- Avoid long academic or essay-style answers
- Format all technical answers neatly using markdown
`;

      // 💬 Use separate context for casual or technical queries
      const systemPrompt = isCasual
        ? `${basePrompt}\nRespond casually and warmly, like a helpful friend.`
        : `${basePrompt}\nYou are helping the user understand and debug the following code:\n${codeSnippet}\nIf the user asks about the code, respond with detailed, well-formatted technical explanations.`;

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", text: systemPrompt }, ...updatedHistory],
        }),
      });

      const data = await res.json();
      const botMsg = { role: "gemini", text: data.text };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "gemini", text: "⚠️ Error connecting to Gemini." },
      ]);
    } finally {
      setLoadingResponse(false);
    }
  };

  useEffect(() => {
    const chatBox = document.querySelector("#chatbox");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chatHistory, loadingResponse]);

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-xl text-gray-600 shrink-0 flex flex-col justify-between hover:ring-2 ring-gray-500 transition mt-2">
        {/* Top: Avatar + Name */}
        <div className="flex items-center gap-3 mb-3">
          <img
            onClick={handleProfileClick}
            src={contributor?.avatarUrl || ""}
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-1 hover:border-amber-500  object-fill cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DefaultAvatar.src;
            }}
          />

          <span className="text-gray-600">
            {contributor?.name || "Anonymous"}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Code Snippet Preview */}
        <pre className="bg-gray-100 p-3 text-gray-500 text-sm rounded h-32 overflow-hidden whitespace-pre-wrap">
          {codeSnippet.length > 150
            ? codeSnippet.slice(0, 150) + "..."
            : codeSnippet}
        </pre>

        {/* Bottom Row */}
        <div className=" justify-between items-start text-sm text-gray-400 mt-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Platform: {platform}</span>
            <span className="text-xs text-gray-500 font-semibold">
              Language: {language}
            </span>
            <div className="flex justify-between">
              <button
                className="text-s text-amber-500 hover:text-blue-400 font-semibold mt-2 cursor-pointer"
                onClick={() => setOpen(true)}
              >
                View full solution
              </button>
              <button
                className="text-s font-semibold mt-2 cursor-pointer border-1 border-gray-300 px-2 py-1 rounded hover:border-blue-500"
                onClick={() => setShowGeminiModal(true)}
              >
                <span
                  style={{
                    background: "linear-gradient(90deg, #4285F4, #9C27B0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Ask Gemini
                </span>
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center w-full mb-2">
              {currentUserEmail === user?.email && (
                <div className="flex gap-2">
                  <Edit2Icon
                    onClick={() => router.push(`/edit-solution/${_id}`)}
                    size={18}
                    className="hover:text-green-500 cursor-pointer"
                  />
                  <TrashIcon
                    onClick={() => setShowDeleteModal(true)}
                    size={18}
                    className="hover:text-red-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL VIEW */}
      {open && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white max-w-7xl w-full md:min-h-[700px] h-fit rounded-lg shadow-xl p-6 relative mx-4">
      
      {/* Close Button */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl cursor-pointer"
      >
        ✖
      </button>

      {/* Title + Contributor */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={contributor?.avatarUrl || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-amber-500 cursor-pointer"
          onClick={handleProfileClick}
        />
        <div>
          <h2 className="md:text-lg text-sm font-bold text-gray-600">
            {title}
          </h2>
          <p className="md:text-sm text-xs text-gray-500 font-semibold">
            {platform} • {language}
          </p>
        </div>
      </div>

      {/* Copy Code Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleCopy}
          className="bg-blue-500 hover:bg-green-600 px-3 py-1 rounded text-sm text-white"
        >
          {copied ? "✅ Copied!" : "Copy code"}
        </button>
      </div>

      <div className="flex md:flex-row flex-col gap-4">
        
        {/* Left: Code Section */}
        <div className="md:w-1/2 bg-gray-100 p-4 rounded md:max-h-[600px] max-h-[300px] overflow-y-auto text-gray-700 font-mono text-sm">
          <SyntaxHighlighter language="javascript" style={duotoneLight} showLineNumbers>
            {codeSnippet}
          </SyntaxHighlighter>
        </div>

        {/* Right: Description */}
        <div className="md:w-1/2 mt-4 md:mt-0 md:max-h-[600px] max-h-[300px] overflow-y-auto bg-gray-50 p-4 rounded text-gray-600">
          <h3 className="md:text-lg text-sm font-semibold mb-2">Description</h3>
          <p className="md:text-sm text-xs whitespace-pre-wrap">{description}</p>
        </div>

      </div>
    </div>
  </div>
)}


      {/* GEMINI CHAT MODAL */}
      {showGeminiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-7xl w-full md:min-h-[700px] h-fit relative mx-4">
            <button
              onClick={() => setShowGeminiModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl cursor-pointer"
            >
              ✖
            </button>

            <h2 className="text-lg font-bold mb-4">
              <span
                style={{
                  background: "linear-gradient(90deg,#4285F4,#9C27B0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ask Gemini
              </span>{" "}
              about this code
            </h2>

            {/* Copy Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopy}
                className="text-white bg-blue-500 hover:bg-green-600 px-3 py-1 rounded text-sm cursor-pointer"
              >
                {copied ? "✅ Copied!" : "Copy Code"}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Left: Code Section */}
              <div className="md:w-1/2 bg-gray-100 p-4 rounded overflow-y-auto max-h-[600px] text-gray-700 text-sm font-mono">
                <SyntaxHighlighter language="javascript" showLineNumbers>
                  {codeSnippet}
                </SyntaxHighlighter>
              </div>

              {/* Right: Gemini Chat Section */}
              <div className="md:w-1/2 flex flex-col bg-gray-50 p-4 rounded max-h-[600px]">
                <div
                  id="chatbox"
                  className="flex-1 overflow-y-auto mb-3 border border-gray-200 rounded p-2 bg-white"
                >
                  {chatHistory.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-10">
                      Ask Gemini anything about this code.
                    </p>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`mb-2 p-2 rounded ${
                          msg.role === "user"
                            ? "bg-blue-100 text-gray-800 self-end"
                            : "bg-gray-200 text-gray-700 self-start"
                        }`}
                      >
                        <strong>
                          {msg.role === "user" ? "You" : "Gemini"}:
                        </strong>{" "}
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({...props }) => (
                              <p
                                className="prose prose-sm max-w-none text-gray-700"
                                {...props}
                              />
                            ),
                            code: ({
                              inline,
                              className,
                              children,
                            }) => {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-lg"
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-sm">
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ))
                  )}

                  {loadingResponse && (
                    <div className="flex justify-center items-center my-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={loadingResponse || !chatInput}
                  >
                    {loadingResponse ? "..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
{showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Delete Solution
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {title}? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

