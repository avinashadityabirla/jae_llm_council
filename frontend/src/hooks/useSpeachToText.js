// frontend/src/hooks/useSpeechToText.js

import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechToText() {
  const [listening, setListening] = useState(false);

  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);

  const onResultRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // avoid calling setState synchronously inside effect to prevent cascading renders
      // schedule state update asynchronously
      setTimeout(() => setSupported(false), 0);

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-IN"; // Indian English

    recognition.onresult = (event) => {
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }

      if (finalText && onResultRef.current) {
        onResultRef.current(finalText);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

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
