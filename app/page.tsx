"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ValentineGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [playing, setPlaying] = useState(false);
  const [hearts, setHearts] = useState<{ id: string; x: number; y: number }[]>([]);

  useEffect(() => {
    if (!playing) return;

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
    }, 400); // Even faster spawning as requested!

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [playing, timeLeft]);

  const spawnHeart = () => {
    const id = crypto.randomUUID();
    const newHeart = {
      id,
      x: Math.random() * 95,
      y: Math.random() * 75,
    };

    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 500);
  };

  const catchHeart = (id: string) => {
    setScore((s) => s + 1);
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
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
            Catch as many hearts as you can before time runs out! 😅
          </p>

          <div className="flex justify-between mb-4 text-lg font-medium">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>

          <div className="relative h-80 border rounded-2xl bg-pink-100 overflow-hidden cursor-pointer">
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
                    catchHeart(heart.id);
                  }}
                  className="absolute p-1 select-none"
                  style={{ left: `${heart.x}%`, top: `${heart.y}%`, zIndex: 10 }}
                >
                  <span className="text-2xl">❤️</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex justify-center">
            <Button onClick={startGame} disabled={playing} className="font-semibold">
              {playing ? "Game Running..." : "Start Game"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
