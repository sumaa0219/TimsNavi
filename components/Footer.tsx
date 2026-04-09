import React, { useRef } from "react";
import { useRouter } from "next/router";

const Footer: React.FC = () => {
  const router = useRouter();
  const boobyAudioRef = useRef<HTMLAudioElement | null>(null);

  // ブービー音の再生
  const handleBooby = () => {
    if (boobyAudioRef.current) {
      boobyAudioRef.current.currentTime = 0;
      boobyAudioRef.current.play();
    }
  };

  // ブービー音再生後にページ遷移
  const handleBoobyAndRoute = (path: string) => {
    handleBooby();
    router.push(path);
  };

  return (
    <>
      <audio ref={boobyAudioRef} src="/sound.mp3" preload="auto" />
      <footer className="flex items-center justify-between mt-2 bg-black h-20">
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 w-24 h-12 rounded-md flex flex-col items-center justify-center"
            onClick={() => handleBoobyAndRoute("/menu")}
          >
            <span className="text-white text-sm leading-tight">運転士</span>
            <span className="text-white text-xs leading-tight">メニュー</span>
          </button>
          <button
            className="bg-blue-600 w-24 h-12 rounded-md flex flex-col items-center justify-center"
            onClick={handleBooby}
          >
            <span className="text-white text-sm leading-tight">高速</span>
            <span className="text-white text-sm leading-tight">切替</span>
          </button>
          <button
            className="bg-blue-600 w-24 h-12 rounded-md flex flex-col items-center justify-center"
            onClick={handleBooby}
          >
            <span className="text-white text-sm leading-tight">戻し</span>
          </button>
          <button
            className="bg-blue-600 w-24 h-12 rounded-md flex flex-col items-center justify-center"
            onClick={handleBooby}
          >
            <span className="text-white text-sm leading-tight">送り</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-grow flex flex-col space-y-1 w-48">
            <div className="bg-gray-700 h-5 flex items-start justify-start">
              <span className="bg-green-400 text-black text-[15px] leading-tight">
                オンライン
              </span>
            </div>
            <div className="bg-gray-700 h-5 "></div>
          </div>
          <button
            className="bg-blue-600 w-10 h-12 rounded-md flex items-center justify-center"
            onClick={handleBooby}
          >
            {/* 音量アイコン */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5L6 9H2v6h4l5 4V5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.54 8.46a5 5 0 010 7.07"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.07 4.93a9 9 0 010 12.73"
              />
            </svg>
          </button>
          <button
            className="bg-blue-600 w-10 h-12 rounded-md flex items-center justify-center"
            onClick={handleBooby}
          >
            {/* 明るさアイコン */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="5"
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
              />
              <path
                stroke="currentColor"
                strokeWidth={2}
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
          </button>
        </div>
      </footer>
    </>
  );
};

export default Footer;
