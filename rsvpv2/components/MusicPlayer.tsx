"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpeakerOnIcon, SpeakerOffIcon } from "./Icons";

/**
 * Background-music player for the wedding invitation.
 *
 * Browsers block audio autoplay until the user has interacted with the
 * page, so we hook into the `entrance-opened` event that Entrance.tsx
 * already dispatches when the visitor taps the doors — that's a
 * guaranteed user gesture, and the natural moment to start the music
 * (the doors are parting, the song swells in).
 *
 * Volume is ramped from 0 → TARGET_VOLUME over FADE_IN_MS so the music
 * "blooms in" instead of hitting the listener at full volume. Pausing
 * fades back to 0 first so it never cuts abruptly.
 *
 * The toggle button is a fixed pill on the top-left so it mirrors the
 * language switcher on the top-right.
 */

// URL-encode the spaces in "Close to You.mp3".
const AUDIO_SRC = "/media/兩世情深 (電視劇《兩世歡》原聲配樂).mp3";
const FADE_IN_MS = 4000; // 4 s slow fade-in
const FADE_OUT_MS = 600; // quick fade-out on toggle
const TARGET_VOLUME = 0.55; // soft background level

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  // Cancel any in-flight volume ramp so we don't fight ourselves.
  const cancelFade = useCallback(() => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  // Ramp `audio.volume` from its current value to `target` over `duration`,
  // calling `onDone` when the ramp finishes. Uses a cubic ease-out so the
  // volume climbs quickly at first and settles gently.
  const fadeTo = useCallback(
    (target: number, duration: number, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      cancelFade();
      const startVol = audio.volume;
      const startTime = performance.now();
      const delta = target - startVol;
      if (duration <= 0 || delta === 0) {
        audio.volume = Math.max(0, Math.min(1, target));
        onDone?.();
        return;
      }
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        audio.volume = Math.max(0, Math.min(1, startVol + delta * eased));
        if (t < 1) {
          fadeRef.current = requestAnimationFrame(step);
        } else {
          fadeRef.current = null;
          onDone?.();
        }
      };
      fadeRef.current = requestAnimationFrame(step);
    },
    [cancelFade]
  );

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      // Start silent and ramp up — avoids the "BANG full volume" jump.
      audio.volume = 0;
      await audio.play();
      fadeTo(TARGET_VOLUME, FADE_IN_MS);
      setPlaying(true);
    } catch {
      // Autoplay blocked or audio failed to load. Stay paused; the user
      // can still toggle the button once they've interacted.
      setPlaying(false);
    }
  }, [fadeTo]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, FADE_OUT_MS, () => {
      // Pause only after the fade finishes so we never cut audio mid-ramp.
      audio.pause();
    });
    setPlaying(false);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void play();
  }, [playing, pause, play]);

  // Start music when the user opens the doors (the first gesture on
  // the page). The `playing` guard prevents re-triggering if the event
  // somehow fires twice in a row.
  useEffect(() => {
    function onEntranceOpened() {
      if (playing) return;
      void play();
    }
    window.addEventListener("entrance-opened", onEntranceOpened);
    return () => window.removeEventListener("entrance-opened", onEntranceOpened);
  }, [play, playing]);

  // Tidy up: cancel any pending fade and pause audio when this component
  // unmounts (e.g. when navigating away from the layout).
  useEffect(() => {
    return () => {
      cancelFade();
      audioRef.current?.pause();
    };
  }, [cancelFade]);

  return (
    <>
      {/* Hidden looping audio element. preload="auto" so the first play()
          call doesn't stall on metadata fetch. */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={toggle}
        className={`music-pill${playing ? " music-pill--playing" : ""}`}
        aria-label={playing ? "Mute background music" : "Play background music"}
        aria-pressed={playing}
        title={playing ? "Mute music" : "Play music"}
      >
        {playing ? <SpeakerOnIcon size={16} /> : <SpeakerOffIcon size={16} />}
      </button>
    </>
  );
}