export function CornerFrames() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none fixed top-6 left-6 z-40 hidden h-8 w-8 border-t border-l border-white/25 md:block md:top-8 md:left-8 md:h-10 md:w-10"
      />
      <span
        aria-hidden
        className="pointer-events-none fixed top-6 right-6 z-40 hidden h-8 w-8 border-t border-r border-white/25 md:block md:top-8 md:right-8 md:h-10 md:w-10"
      />
      <span
        aria-hidden
        className="pointer-events-none fixed bottom-6 left-6 z-40 hidden h-8 w-8 border-b border-l border-white/25 md:block md:bottom-8 md:left-8 md:h-10 md:w-10"
      />
      <span
        aria-hidden
        className="pointer-events-none fixed right-6 bottom-6 z-40 hidden h-8 w-8 border-r border-b border-white/25 md:block md:bottom-8 md:right-8 md:h-10 md:w-10"
      />
    </>
  );
}
