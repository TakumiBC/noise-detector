"use client";
import { Play, Power } from "lucide-react";
import { useEffect, useState } from "react";

interface extWindow extends Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

declare let window: extWindow;

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState(0);

  useEffect(() => {
    let audioContext: any, microphone, analyser: any, intervalId: any;
    console.log("Made by Bright Li, Lucas, Maz, Scott Chiang, Thomas Wu");

    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 512;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Create an Audio object
        const audio = new Audio("man-scream-02.mp3");

        const calculateVolume = () => {
          analyser.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += (dataArray[i] - 128) * (dataArray[i] - 128);
          }
          let average = sum / dataArray.length;
          let volumeInDb = 20 * Math.log10(Math.sqrt(average) / 128);
          let adjustedVolumeInDb = volumeInDb + 100; // Adjust this value as needed
          setDecibels(Math.max(0, Number(adjustedVolumeInDb.toFixed(0)))); // Ensure it doesn't go below 0

          // Play the audio if the sound level exceeds 85db
          if (adjustedVolumeInDb > 85) {
            audio.play();
          }
        };

        // Update the decibels every 0.2 seconds
        intervalId = setInterval(calculateVolume, 150);
      } catch (error) {
        console.error("Error accessing the microphone", error);
      }
    }

    function stopRecording() {
      if (audioContext) audioContext.close();
      if (intervalId) clearInterval(intervalId);
      setDecibels(0); // Reset decibels to 0 when stopped
    }

    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    // Cleanup on component unmount
    return () => {
      stopRecording();
    };
  }, [isRecording]);

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center gap-12 sm:flex-row lg:gap-24"
      style={{
        backgroundColor: isRecording ? "rgb(254,248,247)" : "rgb(243,245,235)",
      }}
    >
      <div className="flex items-center justify-center">
        <h1 className="text-center text-6xl font-bold tracking-tight sm:text-left sm:text-8xl">
          Noise <br /> Detector
        </h1>
      </div>
      <div className={"flex flex-row items-center justify-center gap-6"}>
        <div
          className={
            "mt-6 flex w-16 flex-col items-center justify-center gap-2"
          }
        >
          {/*<p>Decibels: {decibels} db</p>*/}
          <ul className={"space-y-1.5 "}>
            <li
              className={
                "rounded-b-md rounded-t-xl px-6 py-4 transition" +
                (decibels > 90 ? " !bg-red-500/30" : "")
              }
              style={{
                backgroundColor: isRecording
                  ? "rgb(249,235,233)"
                  : "rgb(220,231,205)",
              }}
            ></li>
            <li
              className={
                "rounded-md px-6 py-4 transition" +
                (decibels > 85 ? " !bg-yellow-500/30" : "")
              }
              style={{
                backgroundColor: isRecording
                  ? "rgb(249,235,233)"
                  : "rgb(220,231,205)",
              }}
            ></li>
            <li
              className={
                "rounded-md px-6 py-4 transition" +
                (decibels > 75 ? " !bg-yellow-500/30" : "")
              }
              style={{
                backgroundColor: isRecording
                  ? "rgb(249,235,233)"
                  : "rgb(220,231,205)",
              }}
            ></li>
            <li
              className={
                "rounded-md px-6 py-4 transition" +
                (decibels > 70 ? " !bg-green-500/30" : "")
              }
              style={{
                backgroundColor: isRecording
                  ? "rgb(249,235,233)"
                  : "rgb(220,231,205)",
              }}
            ></li>

            <li
              className={
                "rounded-md px-6 py-4 transition" +
                (decibels > 60 ? " !bg-green-500/30" : "")
              }
              style={{
                backgroundColor: isRecording
                  ? "rgb(249,235,233)"
                  : "rgb(220,231,205)",
              }}
            ></li>
            <li
              className={
                "rounded-md rounded-b-xl px-6 py-4 transition" +
                (decibels > 0 ? " !bg-green-500/30" : "")
              }
              style={{
                backgroundColor: isRecording
                  ? "rgb(249,235,233)"
                  : "rgb(220,231,205)",
              }}
            ></li>
          </ul>
          <span className="text-xl font-semibold tracking-tight text-zinc-600">
            {decibels} db
          </span>
        </div>
        <div className="flex items-center justify-center">
          {isRecording ? (
            <button
              onClick={() => setIsRecording(false)}
              className="group relative flex h-72 w-72 flex-col items-center justify-center rounded-[64px]  border-zinc-700 shadow-lg shadow-black/25 transition hover:shadow-xl active:shadow-sm"
              style={{ backgroundColor: "rgb(249,219,218)" }}
            >
              <Power
                className="h-32 w-32 transition group-hover:-translate-y-3"
                strokeWidth={1.3}
                style={{ color: "rgb(55,10,14)" }}
              />
              <span
                className="absolute bottom-12 text-2xl font-semibold tracking-tight text-red-950 opacity-0 transition group-hover:-translate-y-3 group-hover:opacity-100"
                style={{ color: "rgb(55,10,14)" }}
              >
                Stop
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(true)}
              className="group relative flex h-72 w-72 flex-col items-center justify-center rounded-[64px]  border-zinc-700 shadow-lg shadow-black/25 transition hover:shadow-xl hover:shadow-black/25 active:shadow-sm"
              style={{ backgroundColor: "rgb(202,239,172)" }}
            >
              <Play
                className="h-32 w-32 transition group-hover:-translate-y-3"
                strokeWidth={1.3}
                style={{ color: "rgb(14,32,4)" }}
              />
              <span
                className="absolute bottom-12 text-2xl font-semibold tracking-tight opacity-0 transition group-hover:-translate-y-3 group-hover:opacity-100"
                style={{ color: "rgb(14,32,4)" }}
              >
                Start
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
