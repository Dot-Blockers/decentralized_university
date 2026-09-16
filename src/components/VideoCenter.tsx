import React, { useState } from "react";
import { VideoLesson, ChatMessage } from "../types";
import { Play, Sparkles, Send, BookOpen, AlertCircle, FileText, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface VideoCenterProps {
  lessons: VideoLesson[];
}

export default function VideoCenter({ lessons }: VideoCenterProps) {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const currentLesson = lessons[selectedLessonIndex];

  // AI Tutor state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hi there! I am your Decentralized University AI Tutor, founded by Umair Riaz. Ask me anything about Next.js 15, Solidity Smart Contracts, or decentralized system structures!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Tab state for mobile (since screen real estate is smaller, toggle between Video details, AI Tutor, and Quiz)
  const [mobileActiveSubTab, setMobileActiveActiveSubTab] = useState<"notes" | "ai-tutor" | "quiz">("notes");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = { role: "user", text: inputText };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsAiLoading(true);

    try {
      const history = chatMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, history }),
      });

      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [...prev, { role: "model", text: data.response }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "model", text: `Error: ${data.error || "Could not retrieve response."}` },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        { role: "model", text: "Offline Mode Simulation: Please check if your developer server is running correctly." },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCheckQuiz = () => {
    if (selectedAnswer !== null) {
      setIsAnswerSubmitted(true);
    }
  };

  const handleNextLesson = () => {
    if (selectedLessonIndex < lessons.length - 1) {
      setSelectedLessonIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="video-center-section">
      <div className="text-left mb-8">
        <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest">
          Interactive Lab
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-1">
          Smart Video Learning Center
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl">
          Learn actively. Practice Next.js 15 routing or Solidity smart contract security while testing your knowledge with quizzes and chat-ready AI coding feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Section (Video Player, Lesson details, Notes) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Chapter Select buttons */}
          <div className="flex flex-wrap gap-2.5 pb-2" id="chapter-selector">
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonIndex(idx);
                  setSelectedAnswer(null);
                  setIsAnswerSubmitted(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedLessonIndex === idx
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Chapter {lesson.chapterIndex}
              </button>
            ))}
          </div>

          {/* Styled Video Wrapper */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-xl group aspect-video" id="video-player-container">
            <video
              src={currentLesson.videoUrl}
              controls
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=85"
            />
            {/* Absolute badge */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs text-blue-400 font-mono tracking-wider font-semibold uppercase">
              Now Streaming • {currentLesson.duration}
            </div>
          </div>

          {/* Mobile sub-tabs selector */}
          <div className="flex border-b border-slate-100 md:hidden pt-2" id="mobile-tabs">
            {(["notes", "ai-tutor", "quiz"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMobileActiveActiveSubTab(tab)}
                className={`flex-1 text-center py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  mobileActiveSubTab === tab
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-400 font-medium"
                }`}
              >
                {tab === "notes" ? "Summary & Notes" : tab === "ai-tutor" ? "AI Tutor" : "Quiz"}
              </button>
            ))}
          </div>

          {/* Tab content 1: Lesson Notes & Summary */}
          <div className={`space-y-6 text-left ${mobileActiveSubTab === "notes" ? "block" : "hidden md:block"}`}>
            <div className="p-6 bg-white border border-slate-100 rounded-3xl">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
                {currentLesson.title}
              </h3>
              <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
                {currentLesson.summary}
              </p>
            </div>

            {/* Practical Notes Section */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h4 className="font-display font-bold text-lg text-slate-900">Key Takeaways & Best Practices</h4>
              </div>
              <ul className="space-y-3 pl-1">
                {currentLesson.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm leading-relaxed">
                    <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Sidebar Section (AI Tutor, Interactive Quiz) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">

          {/* Sidebar Tab content 2: AI Tutor Chat panel */}
          <div className={`bg-white border border-slate-100 rounded-3xl shadow-md p-5 flex flex-col h-[520px] justify-between ${
            mobileActiveSubTab === "ai-tutor" ? "block" : "hidden md:flex"
          }`} id="ai-chat-panel">
            {/* Panel Header */}
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2.5 text-left">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-900">AI Learning Assistant</h3>
                    <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider block">Online • Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat History Messages list */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1 text-left text-sm" id="chat-messages-container">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-50 border border-slate-100/50 text-slate-800 rounded-bl-none"
                  }`}>
                    {/* Render Code snippets nicely with monospace styling if backticks present */}
                    {msg.text.includes("```") ? (
                      <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {msg.text}
                      </div>
                    ) : (
                      <p className="leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-100/50 text-slate-500 rounded-2xl rounded-bl-none p-3.5 flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-100" />
                    <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Submit area */}
            <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2" id="chat-form">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about routing caching, solidity modifiers..."
                disabled={isAiLoading}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs sm:text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isAiLoading || !inputText.trim()}
                className="h-11 w-11 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          {/* Sidebar Tab content 3: Interactive Quiz panel */}
          <div className={`bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md text-left space-y-5 ${
            mobileActiveSubTab === "quiz" ? "block" : "hidden md:block"
          }`} id="quiz-panel">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Lesson Active Quiz
              </h3>
            </div>

            {/* Question */}
            <p className="text-slate-800 text-sm font-semibold leading-relaxed">
              {currentLesson.quiz.question}
            </p>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentLesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-500 text-blue-700"
                        : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300"
                    }`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Results output and buttons */}
            {isAnswerSubmitted ? (
              <div className="space-y-4">
                {selectedAnswer === currentLesson.quiz.correctAnswerIndex ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold p-4 rounded-xl flex items-start space-x-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Correct! Outstanding job. You understand Next.js 15 routing pipelines perfectly.</span>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold p-4 rounded-xl flex items-start space-x-2.5">
                    <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>Incorrect. Re-read lesson notes 2 and 3 and try again!</span>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedAnswer(null);
                      setIsAnswerSubmitted(false);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Retry Quiz
                  </button>
                  {selectedLessonIndex < lessons.length - 1 && (
                    <button
                      onClick={handleNextLesson}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center space-x-1"
                    >
                      <span>Next Chapter</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                disabled={selectedAnswer === null}
                onClick={handleCheckQuiz}
                className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
              >
                Submit Answer
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
