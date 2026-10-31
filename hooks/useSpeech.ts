"use client";

import { useState, useRef, useEffect } from "react";

interface UseSpeechReturn {
  speak:     (text: string) => Promise<void>;
  stop:      () => void;
  isLoading: boolean;
  isPlaying: boolean;
  error:     string | null;
}

export function useSpeech(): UseSpeechReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  /** Revoke a previously created Object URL to avoid memory leaks */
  function revokeUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  /** Tear down the current audio instance */
  function teardown() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onplay  = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    revokeUrl();
    setIsPlaying(false);
  }

  const speak = async (text: string): Promise<void> => {
    /* If already playing → act as a toggle (stop) */
    if (audioRef.current) {
      teardown();
      if (isPlaying) return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/speak", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text: text.slice(0, 1000) }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl  = URL.createObjectURL(audioBlob);
      objectUrlRef.current = audioUrl;

      const audio         = new Audio(audioUrl);
      audioRef.current    = audio;

      audio.onplay  = () => setIsPlaying(true);
      audio.onended = () => {
        teardown();
      };
      audio.onerror = () => {
        teardown();
        fallbackBrowserSpeech(text);
      };

      await audio.play();

    } catch {
      // Graceful fallback: use browser's built-in Web Speech synthesis
      fallbackBrowserSpeech(text);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Karen"))
      ) || voices.find((v) => v.lang.startsWith("en"));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setError("Audio synthesis unavailable in this browser.");
    }
  };

  const stop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    teardown();
  };

  /* Cleanup on component unmount */
  useEffect(() => {
    return () => teardown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { speak, stop, isLoading, isPlaying, error };
}
