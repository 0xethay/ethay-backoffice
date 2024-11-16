import { FC, useState } from 'react';

interface EthayProps {
  type: string;
  val: string | number | null;
}

const Ethay: FC<EthayProps> = ({ type, val }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `<Ethay type="${type}" val="${val}" />`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={copyToClipboard}
        className="group flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors cursor-pointer font-mono bg-green-500/5 px-3 py-1 rounded"
      >
        <span>{`<Ethay type="${type}" val="${val}" />`}</span>
        <span className="flex items-center">
          {copied ? (
            // Checkmark icon when copied
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-400"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          ) : (
            // Copy icon before clicking
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
};

export default Ethay; 