import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechToText() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);
  const onResultRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = (result[0]?.transcript || "").trim();
          if (text && onResultRef.current) {
            onResultRef.current(text);
          }
        }
      }
    };

    recognition.onend = () => {
      // Browser sometimes ends session on its own — restart if user hasn't stopped
      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
          return;
        } catch (e) {
          // already started or blocked
        }
      }
      setListening(false);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      if (e.error === "no-speech" || e.error === "aborted") {
        return; // harmless, onend will handle restart
      }
      shouldKeepListeningRef.current = false;
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      shouldKeepListeningRef.current = false;
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
    shouldKeepListeningRef.current = true;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      // Already running — just mark as listening
      setListening(true);
    }
  }, []);

  const stop = useCallback(() => {
    shouldKeepListeningRef.current = false;
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