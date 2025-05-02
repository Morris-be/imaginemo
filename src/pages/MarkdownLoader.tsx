import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';  

interface RouteParams extends Record<string, string | undefined> {
    slug: string;
  }
  
const MarkdownLoader: React.FC = () => {
  const { slug } = useParams<RouteParams>();
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        let response = await fetch(`/writeups/${slug}/${slug}.md`);
        let contentType = response.headers.get('Content-Type');
        if (!response.ok || (contentType && contentType.includes('text/html'))) {
            response = await fetch(`/writeups/placeholder.md`);
        }
        contentType = response.headers.get('Content-Type');
        if(!response.ok || (contentType && contentType.includes('text/html'))){
            throw new Error('Placeholder not found');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError('Placeholder not found');
      }
    };

    fetchMarkdown();
  }, [slug]);

  if (error) {
    return  <div className="flex justify-center items-center w-full">
        <div className="content-width-resp w-full p-5 items-center mx-auto text-body-resp">
            Something went wrong! Try again.
        </div>
        </div>;
  }

  if (!content) {
    return <div className="flex justify-center items-center w-full">
    <div className="content-width-resp w-full p-5 items-center mx-auto text-body-resp">
        Loading...
    </div>
    </div>;
  }

  return (
    <div className="flex justify-center items-center w-full">
        <div className="content-width-resp w-full p-5 items-center mx-auto text-body-resp">
         <ReactMarkdown
         remarkPlugins={[
          remarkMath,
          //@ts-expect-error
          remarkSlug,
          [remarkToc, { heading: 'Table of Contents', tight: true, maxDepth: 4, minDepth: 2 }],
        ]}
         rehypePlugins={[rehypeKatex]}
         components={{
            h1: ({ children }) => <h1 className="text-h1-resp font-bold pb-3">{children}</h1>,
            h2: ({ children, ...props  }) => <h2 {...props } className="text-h2-resp font-semibold mt-3 mb-2 pb-3">{children}</h2>,
            h3: ({ children, ...props   }) => <h3 {...props } className="text-h3-resp font-semibold mt-2 mb-2">{children}</h3>,
            h4: ({ children, ...props   }) => <h4 {...props } className="text-h3-resp font-semibold mt-2 mb-2">{children}</h4>,
            p: ({ children }) => <p className="text-body-resp leading-relaxed">{children}</p>,
            li: ({ children }) => <li className="ml-4 list-disc text-body-resp">{children}</li>,
            code: ({ node, className, children, ...props }) => {
              const isInline = node?.position?.start?.line === node?.position?.end?.line;
            
              if (isInline) {
                return (
                  <code
                    className="bg-gray-200 dark:bg-gray-800 text-code-resp-medium font-mono rounded px-1"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
            
              return (
                <pre
                  className={
                    "bg-gray-100 dark:bg-gray-800 text-code-resp font-mono rounded border border-gray-300 dark:border-gray-700 " +
                    "p-4 overflow-x-auto whitespace-pre-wrap break-words"
                  }
                >
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            a: ({ children, href, ...props }) => {
              if (href && href.startsWith('#')) {
                return (
                  <HashLink smooth to={href} className="custom-link-styling" {...props}>
                    {children}
                  </HashLink>
                );
              }
              return (
                <a
                  href={href}
                  className="custom-link-styling"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            img: ({ src, alt }) => (
              <div className="w-full lg:flex lg:justify-center p-2">
              <img
                src={`/writeups/${slug}/${src}`}
                alt={alt}
                loading="lazy"
                className={`h-auto border-2 dark:border-w rounded-md ${alt === "phone" ? "phone-image" : "normal-image"}`}
                />
              </div>
            ),
          }}
          >{content}</ReactMarkdown>
        </div>
    </div>
  );
};

export default MarkdownLoader;
