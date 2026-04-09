// pages/index.tsx
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TrainDisplayPage = () => {
  const buttonClasses =
    "w-full h-full bg-[#6082A6] text-white rounded-lg cursor-pointer flex items-center justify-center";
  const leftButtonBaseClasses = "w-[200px] h-[200px] text-2xl bg-blue-600"; // 左側のボタン固有のサイズとフォント
  const rightButtonBaseClasses = "w-[170px] h-[70px] text-lg ml-3 bg-blue-600"; // 右側のボタン固有のサイズとフォント

  const [now, setNow] = useState<string>(() => {
    const d = new Date();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    const ss = d.getSeconds().toString().padStart(2, "0");
    return `${hh}時${mm}分${ss}`;
  });

  // 速度のstate
  const [speed, setSpeed] = useState<string>("0");

  const router = useRouter(); // 追加

  // ブービー音のAudio要素を用意
  const boobyAudioRef = useRef<HTMLAudioElement | null>(null);

  // 座標のstateを追加
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [location, setLocation] = useState<string>("");

  const [distance, setDistance] = useState<number>(0);

  // 速度からキロ程（距離）を算出
  useEffect(() => {
    // 速度はkm/h、1秒ごとに加算
    const interval = setInterval(() => {
      const speedNum = parseFloat(speed); // speedは文字列
      if (!isNaN(speedNum)) {
        // 1秒ごとに進む距離[km] = (km/h) / 3600
        setDistance((prev) => prev + speedNum / 3600);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [speed]);

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
        let pref = "";
        let city = "";

        if (data.display_name) {
          const parts = data.display_name
            .split(",")
            .map((s: string) => s.trim());

          // 47都道府県リスト
          const prefs = [
            "北海道",
            "青森県",
            "岩手県",
            "宮城県",
            "秋田県",
            "山形県",
            "福島県",
            "茨城県",
            "栃木県",
            "群馬県",
            "埼玉県",
            "千葉県",
            "東京都",
            "神奈川県",
            "新潟県",
            "富山県",
            "石川県",
            "福井県",
            "山梨県",
            "長野県",
            "岐阜県",
            "静岡県",
            "愛知県",
            "三重県",
            "滋賀県",
            "京都府",
            "大阪府",
            "兵庫県",
            "奈良県",
            "和歌山県",
            "鳥取県",
            "島根県",
            "岡山県",
            "広島県",
            "山口県",
            "徳島県",
            "香川県",
            "愛媛県",
            "高知県",
            "福岡県",
            "佐賀県",
            "長崎県",
            "熊本県",
            "大分県",
            "宮崎県",
            "鹿児島県",
            "沖縄県",
          ];

          // 都道府県をリストから厳密に探す
          pref = parts.find((p: string) => prefs.includes(p)) || "";

          // 市区町村を探す（従来通り）
          city = parts.find((p: string) => /(市|区|町|村)$/.test(p)) || "";
        }
        setLocation(`${pref}${city ? " " + city : ""}`);
      } catch (e) {
        setLocation(`${e}取得失敗`);
      }
    };
    fetchLocation();
  }, [coords]);

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
        <Header
          now={now}
          speed={speed}
          distance={distance}
          coords={coords}
          location={location}
          onInitSelect={() => {
            /* 初期選択ボタンの処理 */
          }}
        />

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
          <div className="flex gap-12 p-0 bg-neutral-600  items-start">
            {/* 左側のボタン配置 */}
            <div className="flex flex-col gap-2 w-60 h-38 p-2 ml-6">
              <button className={`${buttonClasses} ${leftButtonBaseClasses}`}>
                運転情報
              </button>
              <button className={`${buttonClasses} ${leftButtonBaseClasses}`}>
                運番設定
              </button>
            </div>

            {/* 右側のボタン配置 (table) */}
            <table
              className="border-separate h-38 w-180 mr-4"
              style={{ borderSpacing: "10px" }}
            >
              <tbody>
                {/* 1行目 */}
                <tr>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                      onClick={() => handleBoobyAndRoute("/setRoute")}
                    >
                      案内設定
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 2
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 3
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 4
                    </button>
                  </td>
                </tr>
                {/* 2行目 */}
                <tr>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 5
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 6
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 7
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 8
                    </button>
                  </td>
                </tr>
                {/* 3行目 */}
                <tr>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 9
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 10
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 11
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${buttonClasses} ${rightButtonBaseClasses}`}
                    >
                      ボタン 12
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Bar */}
        </main>

        {/* <hr className="border-gray-700 mt-2 mb-2" /> */}

        {/* Footer Section */}
        <Footer />
      </div>
    </>
  );
};

export default TrainDisplayPage;
