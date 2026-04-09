import React from "react";

type HeaderProps = {
  now: string;
  speed: string;
  distance: number;
  coords: { lat: number; lng: number } | null;
  location: string;
  onInitSelect?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  now,
  speed,
  distance,
  coords,
  location,
  onInitSelect,
}) => (
  <header className="flex justify-between items-center mb-2 h-15 min-h-0 bg-black p-0 border-b border-gray-700">
    <div className="flex flex-col justify-center h-full">
      <table className="w-full text-right text-[15px]">
        <tbody>
          <tr>
            <td className="text-gray-400 pr-1">時刻</td>
            <td className="font-semibold">{now}</td>
            <td className="font-semibold text-left">秒</td>
          </tr>
          <tr>
            <td className="text-gray-400 pr-1">速度</td>
            <td className="font-semibold">{speed}k</td>
            <td className="font-semibold text-left">m/h</td>
          </tr>
          <tr>
            <td className="text-gray-400 pr-1">キロ程</td>
            <td className="font-semibold">{distance.toFixed(2)}k</td>
            <td className="font-semibold text-left">m</td>
          </tr>
        </tbody>
      </table>
    </div>
    {coords && (
      <div className="flex-grow flex flex-col space-y-1 w-20 items-end p-2">
        <div className="bg-gray-700 h-6 w-65 flex items-start justify-start">
          <span className="text-xs text-gray-300 px-2 py-1 text-left font-bold">
            {coords
              ? `緯度: ${coords.lat.toFixed(6)} / 経度: ${coords.lng.toFixed(
                  6
                )}`
              : "緯度: - / 経度: -"}
          </span>
        </div>
        <div className="bg-gray-700 h-6 w-65 flex items-start justify-start">
          <span className="text-xs text-gray-300 px-2 py-1 text-left font-bold">
            {location && <span>現在地: {location}</span>}
          </span>
        </div>
      </div>
    )}
    <div className="flex items-center space-x-2 h-15 bg-neutral-800 px-3">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold py-1 px-3 rounded-md text-xs"
        onClick={onInitSelect}
      >
        初期選択
      </button>
    </div>
  </header>
);

export default Header;
