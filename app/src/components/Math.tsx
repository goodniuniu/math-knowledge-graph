import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  children: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Renders a LaTeX string using KaTeX.
 * Uses throwOnError: false so invalid input shows an inline error
 * instead of crashing the page.
 */
const Math: React.FC<MathProps> = ({ children, displayMode = false, className }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode,
        throwOnError: false,
        strict: false,
        errorColor: '#ef4444',
      });
    } catch {
      return children;
    }
  }, [children, displayMode]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Math;
