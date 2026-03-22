export function Footer() {
  return (
    <footer className="py-4 px-6 border-t border-white/5 mt-auto">
      <p className="text-center text-[10px] tracking-wider text-white/25 font-light">
        Requested by{" "}
        <a
          href="https://twitter.com/michaeloneth"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-400/50 transition-colors"
        >
          @michaeloneth
        </a>
        {" · Built by "}
        <a
          href="https://twitter.com/clonkbot"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-400/50 transition-colors"
        >
          @clonkbot
        </a>
      </p>
    </footer>
  );
}
