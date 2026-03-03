import { memo, useEffect, useState } from 'react';
import type { BundledLanguage, BundledTheme, Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['one-light', 'one-dark-pro'],
        langs: ['bash', 'python', 'nix', 'json', 'yaml', 'text'],
      })
    );
  }
  return highlighterPromise;
}

const CodeBlock = memo(({ language, isDark, children }: { language: string | undefined; isDark: boolean; children: string }) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((hl) => {
      if (cancelled) return;
      const lang = (language || 'text') as BundledLanguage;
      const theme: BundledTheme = isDark ? 'one-dark-pro' : 'one-light';
      const result = hl.codeToHtml(children, { lang, theme });
      setHtml(result);
    });
    return () => { cancelled = true; };
  }, [children, language, isDark]);

  return (
    <div className="rounded border border-gray-300 dark:border-gray-700 overflow-hidden mb-1">
      {language && (
        <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-mono px-4 py-1 select-none">
          {language}
        </div>
      )}
      {html ? (
        <div
          className="[&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:text-[0.82em] [&>pre]:p-4 [&>pre]:overflow-x-hidden [&>pre]:whitespace-pre-wrap [&>pre]:break-words"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-[0.82em] font-mono p-4 whitespace-pre-wrap break-words">
          {children}
        </pre>
      )}
    </div>
  );
});

export default CodeBlock;
