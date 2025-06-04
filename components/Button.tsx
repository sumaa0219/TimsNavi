// components/Button.tsx
import React from 'react';

interface ButtonProps {
  /** ボタンに表示するテキストまたは数値 */
  label: string | number;
  /** ボタンがクリックされたときのコールバック関数 */
  onClick: () => void;
  /** 追加のTailwind CSSクラスを適用するためのプロパティ */
  className?: string;
  /** ボタンが無効かどうか */
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, disabled = false }) => {
  return (
    <button
      className={`
        bg-custom-blue text-white font-bold rounded
        flex items-center justify-center
        text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl /* 画面サイズに応じたスケーリング */
        aspect-square /* 正方形に近い形状を維持 */
        transition-colors duration-200 /* ホバー時のアニメーション */
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800'}
        ${className || ''}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;