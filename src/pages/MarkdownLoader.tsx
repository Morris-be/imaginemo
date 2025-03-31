import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

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
        <div className="max-w-200 w-full p-5 items-center mx-auto text-2xl">
            Something went wrong! Try again.
        </div>
        </div>;
  }

  if (!content) {
    return <div className="flex justify-center items-center w-full">
    <div className="max-w-200 w-full p-5 items-center mx-auto text-2xl">
        Loading...
    </div>
    </div>;
  }

  return (
    <div className="flex justify-center items-center w-full">
        <div className="max-w-200 w-full p-5 items-center mx-auto text-2xl">
         <ReactMarkdown
         components={{
            h1: ({ children }) => <h1 className="text-6xl font-bold text-4xl font-bold mt-4 mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-4xl font-semibold mt-3 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-2xl font-semibold mt-2 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-2xl leading-relaxed">{children}</p>,
            li: ({ children }) => <li className="ml-4 list-disc text-2xl">{children}</li>,
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
          }}
          >{content}</ReactMarkdown>
        </div>
    </div>
  );
};

export default MarkdownLoader;
