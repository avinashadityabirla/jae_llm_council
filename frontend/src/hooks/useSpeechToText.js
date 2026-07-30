import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechToText() {
  const [listening, setListening] = useState(false);

  const [supported] = useState(() => {
    if (typeof window === "undefined") return true;

    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });

  const recognitionRef = useRef(null);

  const onResultRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = false; // only final results — avoids duplicates

    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];

      if (last && last.isFinal) {
        const text = last[0].transcript.trim();

        if (text && onResultRef.current) {
          onResultRef.current(text);
        }
      }
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);

      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const start = useCallback((onResult) => {
    if (!recognitionRef.current) return;

    onResultRef.current = onResult;

    try {
      recognitionRef.current.start();

      setListening(true);
    } catch (e) {
      console.error("Could not start recognition:", e);
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (e) {
      // ignore
    }

    setListening(false);
  }, []);

  return { listening, supported, start, stop };
}
