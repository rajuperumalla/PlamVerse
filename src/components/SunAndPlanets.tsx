"use client";

import { motion } from "framer-motion";

const planets = [
  {
    name: "Mercury",
    size: 10,
    radius: 120,
    duration: 15,
    color: "radial-gradient(circle at 30% 30%, #a8a8a8 0%, #5c5c5c 50%, #202020 100%)",
    shadow: "0 0 10px rgba(168, 168, 168, 0.4)",
  },
  {
    name: "Venus",
    size: 20,
    radius: 180,
    duration: 25,
    color: "radial-gradient(circle at 30% 30%, #e6cd9e 0%, #b8914b 50%, #4a3512 100%)",
    shadow: "0 0 15px rgba(230, 205, 158, 0.4)",
  },
  {
    name: "Earth",
    size: 24,
    radius: 260,
    duration: 35,
    color: "radial-gradient(circle at 30% 30%, #4b92db 0%, #296096 50%, #0c2036 100%)",
    shadow: "0 0 20px rgba(75, 146, 219, 0.5)",
  },
  {
    name: "Mars",
    size: 16,
    radius: 340,
    duration: 45,
    color: "radial-gradient(circle at 30% 30%, #e06c48 0%, #a33816 50%, #3d1002 100%)",
    shadow: "0 0 15px rgba(224, 108, 72, 0.5)",
  },
  {
    name: "Jupiter",
    size: 60,
    radius: 480,
    duration: 80,
    color: "radial-gradient(circle at 30% 30%, #d1a375 0%, #9c6e42 50%, #3b2410 100%)",
    shadow: "0 0 30px rgba(209, 163, 117, 0.4)",
  },
  {
    name: "Saturn",
    size: 50,
    radius: 640,
    duration: 120,
    color: "radial-gradient(circle at 30% 30%, #ead0a1 0%, #b59860 50%, #403217 100%)",
    shadow: "0 0 25px rgba(234, 208, 161, 0.4)",
    hasRing: true,
  },
  {
    name: "Uranus",
    size: 35,
    radius: 800,
    duration: 180,
    color: "radial-gradient(circle at 30% 30%, #8be8e5 0%, #3ea8a5 50%, #0b3635 100%)",
    shadow: "0 0 20px rgba(139, 232, 229, 0.4)",
  },
  {
    name: "Neptune",
    size: 33,
    radius: 950,
    duration: 250,
    color: "radial-gradient(circle at 30% 30%, #3e5cf0 0%, #1730ab 50%, #050e3b 100%)",
    shadow: "0 0 20px rgba(62, 92, 240, 0.4)",
  },
  {
    name: "Pluto",
    size: 8,
    radius: 1100,
    duration: 350,
    color: "radial-gradient(circle at 30% 30%, #e0d5c1 0%, #8c7c61 50%, #2e261a 100%)",
    shadow: "0 0 8px rgba(224, 213, 193, 0.4)",
  },
];

export default function SunAndPlanets() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-60">
      <div className="relative w-full h-full flex items-center justify-center -translate-y-1/4 md:-translate-y-0">
        
        {/* The Sun */}
        <motion.div
          className="absolute rounded-full z-10 mix-blend-screen"
          style={{
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(255,220,100,1) 0%, rgba(255,150,50,0.8) 40%, rgba(100,20,100,0) 80%)",
            boxShadow: "0 0 100px rgba(255, 180, 50, 0.8), 0 0 200px rgba(255, 100, 0, 0.4)",
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* The Planets & Orbits */}
        {planets.map((planet, index) => (
          <div
            key={planet.name}
            className="absolute rounded-full border border-white/[0.03]"
            style={{
              width: `${planet.radius * 2}px`,
              height: `${planet.radius * 2}px`,
            }}
          >
            <motion.div
              className="w-full h-full absolute"
              animate={{ rotate: 360 }}
              transition={{
                duration: planet.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Planet Body */}
              <div
                className="absolute rounded-full mix-blend-screen"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  background: planet.color,
                  boxShadow: planet.shadow,
                  top: `-${planet.size / 2}px`,
                  left: `calc(50% - ${planet.size / 2}px)`,
                }}
              >
                {/* Saturn's Ring */}
                {planet.hasRing && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-4 border-[#ead0a1]/40"
                    style={{
                      width: `${planet.size * 2.5}px`,
                      height: `${planet.size * 0.8}px`,
                      transform: "translate(-50%, -50%) rotate(-20deg)",
                      boxShadow: "0 0 10px rgba(234, 208, 161, 0.2)",
                    }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
