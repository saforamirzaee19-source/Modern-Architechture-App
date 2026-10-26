import { useEffect, useRef } from "react";

// Soft gold cursor aura (kept from the original MyPatientHub app).
export default function CursorEffect() {
  const ref = useRef(null);

  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return undefined;
    const el = ref.current;
    let frame = 0;
    let x = 0;
    let y = 0;
    const sel = "a, button, input, select, textarea, [role='button'], label";

    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      el.classList.add("is-visible");
      el.classList.toggle(
        "is-interactive",
        e.target instanceof Element && !!e.target.closest(sel),
      );
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--cursor-x", `${x}px`);
        el.style.setProperty("--cursor-y", `${y}px`);
        frame = 0;
      });
    };
    const hide = () => el.classList.remove("is-visible", "is-pressed");
    const down = () => el.classList.add("is-pressed");
    const up = () => el.classList.remove("is-pressed");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", hide);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="cursor-effect" ref={ref} aria-hidden="true">
      <span className="cursor-effect__aura" />
      <span className="cursor-effect__ring" />
    </div>
  );
}
