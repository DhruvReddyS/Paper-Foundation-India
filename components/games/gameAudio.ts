"use client";

export type GameSound = "select" | "correct" | "wrong" | "reveal" | "complete" | "machine";

const STORAGE_KEY = "pfi-game-sound";
let audioContext: AudioContext | null = null;

export function isGameSoundEnabled() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_KEY) !== "off";
}

export function setGameSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
}

function context() {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return null;
  audioContext ??= new AudioContextConstructor();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function tone(
  audio: AudioContext,
  frequency: number,
  duration: number,
  delay: number,
  gainValue: number,
  type: OscillatorType,
) {
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const startsAt = audio.currentTime + delay;
  const endsAt = startsAt + duration;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  gain.gain.setValueAtTime(.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, startsAt + .012);
  gain.gain.exponentialRampToValueAtTime(.0001, endsAt);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(startsAt);
  oscillator.stop(endsAt + .02);
}

export function playGameSound(sound: GameSound) {
  if (!isGameSoundEnabled()) return;
  const audio = context();
  if (!audio) return;

  if (sound === "correct") {
    tone(audio, 392, .16, 0, .045, "sine");
    tone(audio, 523.25, .2, .07, .04, "sine");
    tone(audio, 659.25, .26, .14, .032, "triangle");
  } else if (sound === "wrong") {
    tone(audio, 196, .2, 0, .038, "triangle");
    tone(audio, 155.56, .28, .075, .028, "sine");
  } else if (sound === "reveal") {
    tone(audio, 293.66, .13, 0, .025, "sine");
    tone(audio, 440, .18, .05, .02, "triangle");
  } else if (sound === "complete") {
    tone(audio, 261.63, .2, 0, .038, "sine");
    tone(audio, 392, .24, .1, .04, "sine");
    tone(audio, 523.25, .38, .2, .035, "triangle");
  } else if (sound === "machine") {
    tone(audio, 92, .16, 0, .028, "square");
    tone(audio, 138, .12, .11, .018, "triangle");
  } else {
    tone(audio, 330, .09, 0, .02, "sine");
  }
}
