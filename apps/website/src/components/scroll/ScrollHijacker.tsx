"use client";
import { useEffect, useRef } from "react";

const ScrollHijacker: React.FC = () => {
  const isAnimatingRef = useRef(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const headerHeightRef = useRef(0);
  const lastJumpAtRef = useRef(0);
  const touchHandledRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const lastWheelTimeRef = useRef(0);

  // Smooth scroll and lock during animation
  const scrollToIndex = (index: number) => {
    const sections = sectionsRef.current;
    if (!sections.length) return;
    const clamped = Math.max(0, Math.min(index, sections.length - 1));
    const el = sections[clamped];
    if (!el) return;

    const headerOffset = headerHeightRef.current || 0;
    const top = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - headerOffset);

    isAnimatingRef.current = true;
    lastJumpAtRef.current = Date.now();
    window.scrollTo({ top, behavior: "smooth" });

    // Unlock after scroll ends (fallback timer)
    const unlock = () => {
      isAnimatingRef.current = false;
      window.removeEventListener("scroll", onScrollEnd, true);
    };

    let lastY = window.scrollY;
    const onScrollEnd = () => {
      const nowY = window.scrollY;
      if (Math.abs(nowY - lastY) < 2) {
        // likely finished
        unlock();
      } else {
        lastY = nowY;
      }
    };

    // Fallback unlock in case scroll event heuristic misses
    window.addEventListener("scroll", onScrollEnd, true);
    window.setTimeout(unlock, 1200);
  };

  useEffect(() => {
    const querySections = () => {
      const nodeList = document.querySelectorAll<HTMLElement>("[data-screen-section='true']");
      sectionsRef.current = Array.from(nodeList);
    };

    const readHeaderHeight = () => {
      const header = document.querySelector<HTMLElement>("header");
      headerHeightRef.current = header?.offsetHeight ?? 0; // HeaderStyled height is 72px
    };

    const recompute = () => {
      readHeaderHeight();
      querySections();
    };

    recompute();

    // Current section index helper
    const currentIndex = () => {
      const sections = sectionsRef.current;
      if (!sections.length) return 0;
      const header = headerHeightRef.current || 0;
      const viewportCenter = window.scrollY + header + window.innerHeight / 2;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].offsetTop;
        if (viewportCenter >= top) idx = i; else break;
      }
      return idx;
    };

    // Determine if viewport is within the hijack region (between first and last screen sections)
    const inHijackZone = () => {
      const sections = sectionsRef.current;
      if (!sections.length) return false;
      const header = headerHeightRef.current || 0;
      const yTop = window.scrollY + header;
      const firstTop = sections[0].offsetTop;
      const lastTop = sections[sections.length - 1].offsetTop;
      return yTop >= firstTop - 1 && yTop <= lastTop + 1;
    };

    const cooldownActive = () => Date.now() - lastJumpAtRef.current < 1000;

    // Wheel handler
    const onWheel = (e: WheelEvent) => {
      if (!sectionsRef.current.length) return;

      // Outside zone: allow default
      if (!inHijackZone()) return;

      const now = Date.now();
      if (now - lastWheelTimeRef.current > 250) {
        wheelAccumRef.current = 0; // new gesture
      }
      lastWheelTimeRef.current = now;

      // Accumulate wheel to avoid multiple jumps on high-resolution trackpads
      wheelAccumRef.current += e.deltaY;

      const idx = currentIndex();
      const sections = sectionsRef.current;
      const lastIdx = sections.length - 1;
      const header = headerHeightRef.current || 0;
      const firstTop = sections[0].offsetTop - header;
      const lastTop = sections[lastIdx].offsetTop - header;

      // At extremes by position: allow default to continue normal page scroll
      if ((e.deltaY > 0 && window.scrollY >= lastTop) || (e.deltaY < 0 && window.scrollY <= firstTop)) {
        return;
      }

      // Inside zone: consume the wheel
      e.preventDefault();

      // One jump per gesture/cooldown
      if (isAnimatingRef.current || cooldownActive()) return;

      // Trigger only when accumulated magnitude crosses a threshold
      const threshold = 60; // pixels/lines depending on deltaMode, good heuristic
      if (Math.abs(wheelAccumRef.current) < threshold) return;
      const next = wheelAccumRef.current > 0 ? idx + 1 : idx - 1;
      wheelAccumRef.current = 0;
      scrollToIndex(next);
    };

    // Keyboard (PageUp/PageDown/Space/Arrow)
    const onKeyDown = (e: KeyboardEvent) => {
      if (!sectionsRef.current.length) return;
      if (!inHijackZone()) return;
      const keys = ["PageDown", "PageUp", "ArrowDown", "ArrowUp", "Space", " "] as const;
      if (!keys.includes(e.key as any)) return;
      const idx = currentIndex();
      const dirDown = ["PageDown", "ArrowDown", "Space", " "].includes(e.key);
      const sections = sectionsRef.current;
      const lastIdx = sections.length - 1;
      const header = headerHeightRef.current || 0;
      const firstTop = sections[0].offsetTop - header;
      const lastTop = sections[lastIdx].offsetTop - header;

      // Allow default at extremes by position
      if ((dirDown && window.scrollY >= lastTop) || (!dirDown && window.scrollY <= firstTop)) {
        return;
      }

      e.preventDefault();
      if (isAnimatingRef.current || cooldownActive()) return;
      const next = dirDown ? idx + 1 : idx - 1;
      scrollToIndex(next);
    };

    // Touch handlers for mobile
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!sectionsRef.current.length) return;
      touchHandledRef.current = false;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!sectionsRef.current.length) return;
      if (!inHijackZone()) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) < 24) return; // threshold
      const idx = currentIndex();
      const sections = sectionsRef.current;
      const lastIdx = sections.length - 1;
      const header = headerHeightRef.current || 0;
      const firstTop = sections[0].offsetTop - header;
      const lastTop = sections[lastIdx].offsetTop - header;

      // Allow default at extremes by position
      if ((dy > 0 && window.scrollY >= lastTop) || (dy < 0 && window.scrollY <= firstTop)) {
        return;
      }

      if (touchHandledRef.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (isAnimatingRef.current || cooldownActive()) return;
      const next = dy > 0 ? idx + 1 : idx - 1;
      scrollToIndex(next);
      touchHandledRef.current = true; // only one jump per gesture
    };
    const onTouchEnd = () => {
      touchHandledRef.current = false;
    };

    // Listeners
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", recompute);

    // If DOM changes (sections mount/unmount), re-query after a tick
    const mo = new MutationObserver(() => {
      querySections();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("resize", recompute as any);
      mo.disconnect();
    };
  }, []);

  return null;
};

export default ScrollHijacker;
