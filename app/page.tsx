"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type HeartType = "heart" | "broken";

export default function ValentineGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hearts, setHearts] = useState<{ id: string; x: number; y: number; type: HeartType }[]>([]);

  useEffect(() => {
    if (!playing || gameOver) return;

    if (timeLeft === 0) {
      setPlaying(false);
      setHearts([]);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    const spawner = setInterval(() => {
      spawnHeart();
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [playing, timeLeft, gameOver]);

  const spawnHeart = () => {
    const id = crypto.randomUUID();
    const isBroken = Math.random() < 0.2; // 20% chance for broken heart
    const newHeart = {
      id,
      x: Math.random() * 92,
      y: Math.random() * 75,
      type: (isBroken ? "broken" : "heart") as HeartType,
    };

    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 500);
  };

  const catchHeart = (id: string, type: HeartType) => {
    if (type === "broken") {
      setGameOver(true);
      setPlaying(false);
      setHearts([]);
      return;
    }
    setScore((s) => s + 1);
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setPlaying(true);
    setHearts([]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 p-6">
      <Card className="w-full max-w-xl rounded-2xl shadow-xl bg-white border-none">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            ❤️ Valentine Heart Catch ❤️
          </h1>

          <p className="text-center mb-4 text-gray-600">
            Catch as many hearts as you can! Avoid broken ones!
          </p>

          <div className="flex justify-between mb-4 text-lg font-medium">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>

          <div className="relative h-80 border rounded-2xl bg-pink-100 overflow-hidden cursor-pointer">
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-50 text-white">
                <h2 className="text-4xl font-bold mb-2">BREAKUP...💔</h2>
                <h3 className=" font-bold mb-2">You Catch Broken Heart...!  Better luck next time</h3>
                <p className="text-xl">Final Score: {score}</p>
                <Button onClick={startGame} className="mt-4 bg-white text-black hover:bg-gray-200">
                  Try Again
                </Button>
              </div>
            )}

            <AnimatePresence>
              {hearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    catchHeart(heart.id, heart.type);
                  }}
                  className="absolute p-1 select-none"
                  style={{ left: `${heart.x}%`, top: `${heart.y}%`, zIndex: 10 }}
                >
                  <span className="text-2xl">
                    {heart.type === "broken" ? "💔" : "❤️"}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex justify-center">
            {!gameOver && (
              <Button onClick={startGame} disabled={playing} className="font-semibold">
                {playing ? "Game Running..." : "Start Game"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
