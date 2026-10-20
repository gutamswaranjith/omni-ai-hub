import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Terminal } from 'lucide-react';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || codeString.includes('\n'))) {
              return (
                <CodeBlock language={language || 'text'} value={codeString} />
              );
            }

            return (
              <code
                className="bg-slate-800 text-pink-400 px-1.5 py-0.5 rounded text-xs md:text-sm font-mono border border-slate-700/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-slate-700 bg-slate-900/60">
                <table className="min-w-full divide-y divide-slate-700 text-left text-xs md:text-sm">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 text-xs font-semibold uppercase text-slate-300 bg-slate-800/80">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 border-t border-slate-800 text-slate-300">
                {children}
              </td>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
              >
                {children}
              </a>
            );
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-2 bg-indigo-950/20 rounded-r text-slate-300 italic">
                {children}
              </blockquote>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono uppercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto text-xs md:text-sm font-mono text-slate-200 leading-relaxed">
        <pre>
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
