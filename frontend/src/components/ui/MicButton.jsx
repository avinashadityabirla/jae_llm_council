// frontend/src/components/ui/MicButton.jsx

import { useSpeechToText } from "../../hooks/useSpeechToText";

// onAppend: function that receives spoken text and appends it to your field

function MicButton({ onAppend, title = "Click to dictate" }) {
  const { listening, supported, start, stop } = useSpeechToText();

  if (!supported) {
    return null; // Hide button if browser doesn't support speech
  }

  const handleClick = () => {
    if (listening) {
      stop();
    } else {
      start((text) => {
        onAppend(text);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      className={
        "inline-flex items-center justify-center w-8 h-8 rounded-full transition-all flex-shrink-0 " +
        (listening
          ? "bg-danger text-white animate-pulse"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")
      }
    >
      {listening ? "⏹" : "🎤"}
    </button>
  );
}

export default MicButton;
