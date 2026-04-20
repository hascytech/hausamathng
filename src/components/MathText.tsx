import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  children: string;
  className?: string;
}

/**
 * Renders text that may contain LaTeX math.
 * - Inline math: $...$
 * - Block math (matrices, large fractions, roots): $$...$$
 * Falls back to plain text outside delimiters.
 */
export default function MathText({ children, className }: MathTextProps) {
  if (!children) return null;

  // Split on $$...$$ first, then $...$ — preserve delimiters
  const blockSplit = children.split(/(\$\$[\s\S]+?\$\$)/g);

  return (
    <span className={className}>
      {blockSplit.map((block, bi) => {
        if (block.startsWith("$$") && block.endsWith("$$")) {
          const tex = block.slice(2, -2);
          try {
            return <BlockMath key={bi} math={tex} />;
          } catch {
            return <span key={bi}>{block}</span>;
          }
        }
        // inline math
        const inlineSplit = block.split(/(\$[^\$\n]+?\$)/g);
        return (
          <span key={bi}>
            {inlineSplit.map((part, pi) => {
              if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
                const tex = part.slice(1, -1);
                try {
                  return <InlineMath key={pi} math={tex} />;
                } catch {
                  return <span key={pi}>{part}</span>;
                }
              }
              return <span key={pi}>{part}</span>;
            })}
          </span>
        );
      })}
    </span>
  );
}
