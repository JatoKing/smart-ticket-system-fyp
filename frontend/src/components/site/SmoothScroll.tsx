"use client";

import { useEffect } from "react";
import { startSmoothScroll } from "@/lib/smooth-scroll";
import "lenis/dist/lenis.css";

/** Turns on Lenis smooth scrolling while the landing page is mounted. */
export default function SmoothScroll() {
  useEffect(() => startSmoothScroll(), []);
  return null;
}
