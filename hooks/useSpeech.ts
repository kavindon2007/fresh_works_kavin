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
        setError("Audio playback failed.");
      };

      await audio.play();

    } catch {
      teardown();
      setError("Could not generate audio. Check ElevenLabs API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => teardown();

  /* Cleanup on component unmount */
  useEffect(() => {
    return () => teardown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { speak, stop, isLoading, isPlaying, error };
}
