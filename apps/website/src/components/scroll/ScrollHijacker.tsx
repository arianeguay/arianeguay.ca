"use client";
import { useEffect, useRef } from "react";

const ScrollHijacker: React.FC = () => {
  const isAnimatingRef = useRef(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const headerHeightRef = useRef(0);
  const lastJumpAtRef = useRef(0);
  const touchHandledRef = useRef(false);
  const _wheelAccumRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const currentSectionRef = useRef<number | null>(null);
  const wheelTimeoutRef = useRef<number | null>(null);
  const scrollEndTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const isScrollingUpRef = useRef(false);

  // Smooth scroll and lock during animation
  const scrollToIndex = (index: number) => {
    const sections = sectionsRef.current;
    if (!sections.length) return;
    const clamped = Math.max(0, Math.min(index, sections.length - 1));
    const el = sections[clamped];
    if (!el) return;

    // Update the current section we're scrolling to
    currentSectionRef.current = clamped;

    const headerOffset = headerHeightRef.current || 0;
    const top = Math.max(
      0,
      el.getBoundingClientRect().top + window.pageYOffset - headerOffset,
    );

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
      // Get all sections marked for snap scrolling
      const nodeList = document.querySelectorAll<HTMLElement>(
        "[data-screen-section='snap']",
      );
      sectionsRef.current = Array.from(nodeList);
    };

    const readHeaderHeight = () => {
      const header = document.querySelector<HTMLElement>("header");
      headerHeightRef.current = header?.offsetHeight ?? 0;
    };

    const recompute = () => {
      readHeaderHeight();
      querySections();
    };

    recompute();

    // Track scroll direction
    const getSectionToSnapTo = () => {
      const sections = sectionsRef.current;
      if (!sections.length) return null;

      const viewportTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportBottom = viewportTop + viewportHeight;
      const snapThreshold = viewportHeight * 0.1; // 20% visibility threshold

      // Update scroll direction detection
      const scrollingUp = viewportTop < lastScrollYRef.current;
      isScrollingUpRef.current = scrollingUp;
      lastScrollYRef.current = viewportTop;

      // Find sections with at least 20% visibility
      const sectionsWithThresholdVisibility = [];

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;

        // Calculate visible area of section
        const visibleTop = Math.max(sectionTop, viewportTop);
        const visibleBottom = Math.min(sectionBottom, viewportBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityPercentage = visibleHeight / viewportHeight;

        // If section meets threshold, add to list
        if (visibleHeight >= snapThreshold) {
          sectionsWithThresholdVisibility.push({
            index: i,
            element: section,
            visibleHeight,
            visibilityPercentage,
            sectionTop,
          });
        }
      }

      if (sectionsWithThresholdVisibility.length === 0) return null;

      // When scrolling up, prefer the section that's coming into view from the top
      if (scrollingUp) {
        // Sort sections by their top position (ascending)
        sectionsWithThresholdVisibility.sort(
          (a, b) => a.sectionTop - b.sectionTop,
        );

        // Find the highest visible section that meets threshold
        for (const section of sectionsWithThresholdVisibility) {
          // If this section is above the current section, snap to it
          if (
            currentSectionRef.current === null ||
            section.index < currentSectionRef.current
          ) {
            currentSectionRef.current = section.index;
            return { index: section.index };
          }
        }
      }

      // When scrolling down - different behavior from scrolling up
      if (!scrollingUp) {
        // First identify the most visible section to mark as current
        let mostVisibleSection = null;
        let maxVisibleArea = 0;

        for (const section of sectionsWithThresholdVisibility) {
          if (section.visibleHeight > maxVisibleArea) {
            maxVisibleArea = section.visibleHeight;
            mostVisibleSection = section;
          }
        }

        // Set the most visible section as current
        if (mostVisibleSection) {
          currentSectionRef.current = mostVisibleSection.index;
        }
        
        // For scrolling down, we want a higher threshold before snapping
        // Find sections that have significant visibility (30%) and are below current
        const downScrollThreshold = window.innerHeight * 0.3; // 30% for downward scrolling
        
        for (const section of sectionsWithThresholdVisibility) {
          // Only consider sections below current section when scrolling down
          if (currentSectionRef.current !== null && 
              section.index > currentSectionRef.current &&
              section.visibleHeight >= downScrollThreshold) {
            return { index: section.index };
          }
        }
      }

      return null;
    };

    const cooldownActive = () => Date.now() - lastJumpAtRef.current < 1000;

    // Check if we need to snap to any section
    const checkForSnap = () => {
      // Don't check during animations
      if (isAnimatingRef.current || cooldownActive()) return;

      // See if we should snap to any section
      const sectionToSnapTo = getSectionToSnapTo();

      // If there's a section to snap to, do it
      if (sectionToSnapTo) {
        scrollToIndex(sectionToSnapTo.index);
      }
    };

    // Wheel handler
    const onWheel = (_e: WheelEvent) => {
      if (!sectionsRef.current.length) return;

      // Wait a bit after wheel events to see if we should snap
      const handleWheelEnd = () => {
        if (isAnimatingRef.current) return; // Don't interrupt animations

        // Check if we've stopped scrolling for a moment
        const now = Date.now();
        if (now - lastWheelTimeRef.current > 250) {
          checkForSnap();
        }
      };

      // Update wheel time
      lastWheelTimeRef.current = Date.now();

      // Schedule a check after some delay
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
      wheelTimeoutRef.current = window.setTimeout(
        handleWheelEnd,
        300,
      ) as unknown as number;
    };

    // Keyboard (PageUp/PageDown/Space/Arrow)
    const onKeyDown = (e: KeyboardEvent) => {
      if (!sectionsRef.current.length) return;

      const keys = [
        "PageDown",
        "PageUp",
        "ArrowDown",
        "ArrowUp",
        "Space",
        " ",
      ] as const;
      if (!keys.includes(e.key as any)) return;

      // Let default scroll happen, then check if we need to snap
      window.setTimeout(() => {
        if (!isAnimatingRef.current) {
          checkForSnap();
        }
      }, 300);
    };

    // Touch handlers for mobile
    let _touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!sectionsRef.current.length) return;
      touchHandledRef.current = false;
      _touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (_e: TouchEvent) => {
      if (!sectionsRef.current.length) return;
      if (touchHandledRef.current) return;

      // Let normal touch scrolling happen
    };

    const onTouchEnd = () => {
      if (isAnimatingRef.current) return;

      // Check for snap after touch scroll ends
      window.setTimeout(() => {
        checkForSnap();
      }, 300);

      touchHandledRef.current = false;
    };

    // Scroll end detection using debounced scroll listener
    const onScroll = () => {
      if (isAnimatingRef.current) return; // Don't check during animation

      // Clear existing timeout
      if (scrollEndTimeoutRef.current) {
        window.clearTimeout(scrollEndTimeoutRef.current);
      }

      // Set new timeout to detect scroll end
      scrollEndTimeoutRef.current = window.setTimeout(() => {
        checkForSnap();
      }, 200) as unknown as number;
    };

    // Listeners
    window.addEventListener("scroll", onScroll, { passive: true });
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
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
      if (scrollEndTimeoutRef.current) {
        window.clearTimeout(scrollEndTimeoutRef.current);
      }
      window.removeEventListener("scroll", onScroll as any);
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
