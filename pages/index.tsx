// pages/index.tsx
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";

const TrainDisplayPage = () => {
  // 現在時刻のstate
  // 現在時刻のstate
  const [now, setNow] = useState<string>(() => {
    const d = new Date();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    const ss = d.getSeconds().toString().padStart(2, "0");
    return `${hh}時${mm}分${ss}`;
  });

  // 速度のstate
  const [speed, setSpeed] = useState<string>("0");

  // ブービー音のAudio要素を用意
  const boobyAudioRef = useRef<HTMLAudioElement | null>(null);

  // 座標のstateを追加
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [location, setLocation] = useState<string>("");

  // ボタン押下時のハンドラ
  const handleBooby = () => {
    if (boobyAudioRef.current) {
      boobyAudioRef.current.currentTime = 0;
      boobyAudioRef.current.play();
    }
  };

  // 1秒ごとに時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      const ss = d.getSeconds().toString().padStart(2, "0");
      setNow(`${hh}時${mm}分${ss}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // GPSから速度と座標を取得
  useEffect(() => {
    let watchId: number | null = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          // 速度(m/s)が取得できればkm/hに変換
          if (pos.coords.speed !== null && !isNaN(pos.coords.speed)) {
            const kmh = (pos.coords.speed * 3.6).toFixed(1);
            setSpeed(`${kmh}`);
          } else {
            setSpeed("0");
          }
          // 座標をstateにセット
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          console.log(
            `緯度: ${pos.coords.latitude}, 経度: ${pos.coords.longitude}, 速度: ${pos.coords.speed}`
          );
        },
        () => {
          setSpeed("0");
          setCoords(null);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    } else {
      setSpeed("0");
      setCoords(null);
    }
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    if (!coords) {
      setLocation("");
      return;
    }
    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=ja`
        );
        const data = await res.json();
        // display_nameから都道府県・市区町村を抽出
        // 例: "弁本屋酒店, 福音寮道, 桜上水五丁目, 桜上水, 世田谷区, 東京都, 156-0045, 日本"
        let pref = "";
        let city = "";
        if (data.display_name) {
          const parts = data.display_name
            .split(",")
            .map((s: string) => s.trim());
          // 都道府県を探す
          pref = parts[5] || "";
          // 市区町村を探す
          city = parts.find((p: string) => /(市|区|町|村)$/.test(p)) || "";
        }
        setLocation(`${pref}${city ? " " + city : ""}`);
      } catch (e) {
        setLocation("取得失敗");
      }
    };
    fetchLocation();
  }, [coords]);

  // ...表示したい場所に追加...

  return (
    <>
      <Head>
        <title>運行情報表示</title>
        <meta
          name="description"
          content="Train information display UI replica"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <audio ref={boobyAudioRef} src="/sound.mp3" preload="auto" />

      <div className="bg-neutral-800 text-white min-h-screen p-1 flex flex-col font-sans">
        {/* Header Section */}
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
                  <td className="font-semibold">100k</td>
                  <td className="font-semibold text-left">m</td>
                </tr>
              </tbody>
            </table>
          </div>
          {coords && (
            <div className="text-xs text-gray-300 px-2 py-1">
              緯度: {coords.lat.toFixed(6)} / 経度: {coords.lng.toFixed(6)}
              <br />
              {location && <span>現在地: {location}</span>}
            </div>
          )}
          <div className="flex items-center space-x-2 h-15 bg-neutral-800 px-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold py-1 px-3 rounded-md text-xs">
              初期選択
            </button>
          </div>
        </header>

        {/* <hr className="border-gray-700 p-0.5" /> */}

        {/* Main Content Area */}
        <main
          className="bg-neutral-700 text-white flex flex-col p-0 "
          style={{ fontFamily: 'Meiryo, "MS PGothic", sans-serif' }} // Common Japanese sans-serif fonts
        >
          {/* Top Bar */}
          <div className="bg-neutral-800 p-1 text-sm">
            {/* 1段目：CO1AB 運転情報 */}
            <div className="flex items-center mb-1">
              <span className="text-gray-300 whitespace-nowrap text-xs tracking-tight leading-none">
                CO1AB
              </span>
              <span className="text-green-400 ml-15 whitespace-nowrap text-xm tracking-tight leading-none">
                運転情報
              </span>
            </div>
            {/* 2段目：運行パターン・経路・運行番号 */}
            <div className="flex items-center justify-between leading-none">
              <div className="flex items-center space-x-2 leading-none">
                <span className="text-gray-400 whitespace-nowrap text-xs ml-10 tracking-tight leading-none">
                  運行パターン
                </span>
                <span className="text-yellow-300 text-xs tracking-tight leading-none">
                  急行
                </span>
                <span className="text-yellow-300 whitespace-nowrap text-xs tracking-tight leading-none">
                  府中→大阪市内
                </span>
              </div>
              <div className="flex items-center leading-none">
                <table className="table-fixed border-separate border-spacing-0 text-xs">
                  <tbody>
                    <tr>
                      <td className="text-gray-400 px-1 py-0  text-lg  whitespace-nowrap">
                        運行番号
                      </td>
                      <td className="px-1 py-0">　　　</td>
                      <td className="text-green-400 text-lg px-1 py-0 whitespace-nowrap">
                        25
                      </td>
                      <td className="px-1 py-0">　</td>
                      <td className="text-green-400 text-lg px-1 py-0 whitespace-nowrap">
                        S
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Content Area Below Top Bar */}
          <div className="flex flex-grow p-9 items-stretch space-x-5">
            {" "}
            {/* items-stretch for vertical alignment of children */}
            {/* Left Black Panel */}
            {/* <div className="w-[120px] bg-black rounded-sm"> {/* Adjusted width, it will stretch vertically. Added slight rounding if desired, remove if strictly rectangular. */}
            {/* This panel is empty in the image */}
            {/* </div> */}
            {/* Route Visualization (Centered in its allocated space) */}
            <div className="flex-grow flex items-center justify-center space-x-4">
              <div className="bg-neutral-600 border border-neutral-400 text-white text-4xl font-semibold py-5 px-10 rounded-sm">
                府中
              </div>
              <div className="text-white text-4xl font-light">→</div>
              <div className="bg-neutral-600 border border-neutral-400 text-white text-4xl font-semibold py-5 px-10 rounded-sm">
                桜上水
              </div>
            </div>
            {/* Train Type/Destination (to the right) */}
            <div className="text-left space-y-2 flex flex-col justify-center ml-4">
              <div>
                <span className="text-yellow-300 text-3xl font-bold py-2 px-4 rounded-md whitespace-nowrap">
                  急行
                </span>
              </div>
              <div>
                <span className="text-yellow-300 text-3xl font-bold py-2 px-4 rounded-md whitespace-nowrap">
                  <span className="text-yellow-300 text-3xl font-bold py-2 px-1 rounded-md whitespace-nowrap">
                    高幡不動
                  </span>
                  <span className="text-white text-3xl font-bold py-2 px-4 rounded-md whitespace-nowrap justify-end">
                    行
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
        </main>

        {/* <hr className="border-gray-700 mt-2 mb-2" /> */}

        {/* Footer Section */}
        <footer className="flex items-center justify-between mt-2 bg-black h-20">
          <div className="flex space-x-2">
            <button
              className="bg-blue-600 w-24 h-12 rounded-md flex flex-col items-center justify-center"
              onClick={handleBooby}
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
                <span className="bg-green-400 text-black text-[15px]   leading-tight">
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
      </div>
    </>
  );
};

export default TrainDisplayPage;
