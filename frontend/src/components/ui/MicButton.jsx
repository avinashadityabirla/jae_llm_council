import { useSpeechToText } from "../../hooks/useSpeechToText";

function MicButton({ onAppend, title = "Click to dictate" }) {
  const { listening, supported, start, stop } = useSpeechToText();

  if (!supported) {
    return (
      <span
        className="text-xs text-neutral-400"
        title="Speech recognition not supported in this browser"
      >
        Mic n/a
      </span>
    );
  }

  const handleClick = () => {
    if (listening) {
      stop();
    } else {
      start((text) => {
        if (typeof onAppend === "function") {
          onAppend(text);
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={listening ? "Click to stop dictation" : title}
      className={
        "inline-flex items-center justify-center gap-1 px-2.5 h-8 rounded-full text-xs font-medium transition-all flex-shrink-0 " +
        (listening
          ? "bg-danger text-white animate-pulse"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")
      }
    >
      <span>{listening ? "⏹" : "🎤"}</span>
      <span>{listening ? "Stop" : "Dictate"}</span>
    </button>
  );
}

export default MicButton;