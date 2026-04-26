import { useEffect, useState } from "react";

interface Props {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}

export const TypingText = ({ words, className, typeSpeed = 90, deleteSpeed = 50, pause = 1500 }: Props) => {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[wordIdx % words.length];
    const done = !deleting && text === current;
    const empty = deleting && text === "";

    if (done) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (empty) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
      );
    }, deleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-0.5 h-[1em] bg-primary ml-1 align-middle animate-pulse" />
    </span>
  );
};
