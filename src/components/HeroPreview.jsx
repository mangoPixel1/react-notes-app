function HeroPreview({ className }) {
  return (
    <svg
      viewBox="0 0 680 410"
      className={className}
      role="img"
      aria-label="Noto app open in a browser window on a laptop and a phone"
    >
      <defs>
        <clipPath id="hp-laptop-screen">
          <rect x="42" y="30" width="356" height="224" rx="6" />
        </clipPath>
        <clipPath id="hp-phone-screen">
          <rect x="440" y="128" width="136" height="234" rx="10" />
        </clipPath>
      </defs>

      {/* Laptop */}
      <g className="drop-shadow-xl" transform="translate(0,17.4) scale(1.28)">
        <path
          d="M20 280 L420 280 L412 288 L28 288 Z"
          className="fill-zinc-300 dark:fill-zinc-600"
        />
        <rect
          x="30"
          y="270"
          width="380"
          height="10"
          rx="3"
          className="fill-zinc-600 dark:fill-zinc-500"
        />
        <rect
          x="30"
          y="18"
          width="380"
          height="252"
          rx="16"
          className="fill-zinc-800 dark:fill-zinc-700"
        />

        <g clipPath="url(#hp-laptop-screen)">
          <rect x="42" y="30" width="356" height="224" className="fill-white" />

          {/* browser chrome */}
          <rect x="42" y="30" width="356" height="20" className="fill-zinc-100" />
          <circle cx="54" cy="40" r="3" className="fill-red-400" />
          <circle cx="64" cy="40" r="3" className="fill-yellow-400" />
          <circle cx="74" cy="40" r="3" className="fill-green-400" />
          <rect x="100" y="35" width="180" height="10" rx="5" className="fill-zinc-200" />

          {/* sidebar */}
          <rect x="42" y="50" width="54" height="204" className="fill-orange-100" />
          <rect x="57" y="66" width="12" height="12" rx="3" className="fill-amber-500" />
          <rect x="57" y="96" width="12" height="12" rx="3" className="fill-amber-500" />
          <rect x="57" y="126" width="12" height="12" rx="3" className="fill-amber-500" />
          <rect x="57" y="156" width="12" height="12" rx="3" className="fill-amber-500" />

          {/* heading + toolbar */}
          <rect x="112" y="64" width="64" height="10" rx="2" className="fill-zinc-400" />
          <rect x="112" y="82" width="40" height="8" rx="4" className="fill-zinc-200" />
          <rect x="158" y="82" width="56" height="8" rx="4" className="fill-zinc-200" />

          {/* notes grid */}
          {/* card 1 - yellow, pinned */}
          <rect x="112" y="100" width="84" height="70" rx="6" className="fill-yellow-100 stroke-yellow-300" />
          <circle cx="186" cy="110" r="3" className="fill-amber-600" />
          <rect x="120" y="110" width="50" height="6" rx="2" className="fill-zinc-600" />
          <rect x="120" y="122" width="60" height="4" rx="2" className="fill-zinc-400" />
          <rect x="120" y="130" width="45" height="4" rx="2" className="fill-zinc-400" />

          {/* card 2 - orange */}
          <rect x="204" y="100" width="84" height="70" rx="6" className="fill-orange-100 stroke-orange-300" />
          <rect x="212" y="110" width="50" height="6" rx="2" className="fill-zinc-600" />
          <rect x="212" y="122" width="60" height="4" rx="2" className="fill-zinc-400" />
          <rect x="212" y="130" width="40" height="4" rx="2" className="fill-zinc-400" />

          {/* card 3 - blue */}
          <rect x="296" y="100" width="84" height="70" rx="6" className="fill-blue-100 stroke-blue-300" />
          <rect x="304" y="110" width="50" height="6" rx="2" className="fill-zinc-600" />
          <rect x="304" y="122" width="60" height="4" rx="2" className="fill-zinc-400" />
          <rect x="304" y="130" width="48" height="4" rx="2" className="fill-zinc-400" />

          {/* card 4 - green */}
          <rect x="112" y="178" width="84" height="70" rx="6" className="fill-green-100 stroke-green-300" />
          <rect x="120" y="188" width="50" height="6" rx="2" className="fill-zinc-600" />
          <rect x="120" y="200" width="60" height="4" rx="2" className="fill-zinc-400" />
          <rect x="120" y="208" width="40" height="4" rx="2" className="fill-zinc-400" />

          {/* card 5 - gray */}
          <rect x="204" y="178" width="84" height="70" rx="6" className="fill-gray-100 stroke-gray-300" />
          <rect x="212" y="188" width="50" height="6" rx="2" className="fill-zinc-600" />
          <rect x="212" y="200" width="60" height="4" rx="2" className="fill-zinc-400" />
          <rect x="212" y="208" width="45" height="4" rx="2" className="fill-zinc-400" />

          {/* card 6 - red */}
          <rect x="296" y="178" width="84" height="70" rx="6" className="fill-red-100 stroke-red-300" />
          <rect x="304" y="188" width="50" height="6" rx="2" className="fill-zinc-600" />
          <rect x="304" y="200" width="60" height="4" rx="2" className="fill-zinc-400" />
          <rect x="304" y="208" width="42" height="4" rx="2" className="fill-zinc-400" />
        </g>

        <rect
          x="30"
          y="18"
          width="380"
          height="252"
          rx="16"
          className="fill-none stroke-black/10 dark:stroke-white/10"
        />
      </g>

      {/* Phone */}
      <g className="drop-shadow-xl" transform="translate(70,0)">
        <rect
          x="430"
          y="104"
          width="156"
          height="282"
          rx="30"
          className="fill-zinc-900 dark:fill-zinc-800"
        />
        <rect x="488" y="114" width="40" height="6" rx="3" className="fill-zinc-700" />

        <g clipPath="url(#hp-phone-screen)">
          <rect x="440" y="128" width="136" height="234" className="fill-white" />

          {/* mobile browser chrome */}
          <rect x="440" y="128" width="136" height="20" className="fill-zinc-100" />
          <rect x="452" y="134" width="90" height="8" rx="4" className="fill-zinc-300" />
          <circle cx="558" cy="138" r="1.4" className="fill-zinc-400" />
          <circle cx="563" cy="138" r="1.4" className="fill-zinc-400" />
          <circle cx="568" cy="138" r="1.4" className="fill-zinc-400" />

          {/* note page */}
          <rect x="440" y="148" width="136" height="214" className="fill-yellow-100" />
          <path d="M456 160 L450 164 L456 168" className="fill-none stroke-zinc-600 stroke-2" />
          <circle cx="559" cy="164" r="1.4" className="fill-zinc-500" />
          <circle cx="564" cy="164" r="1.4" className="fill-zinc-500" />
          <circle cx="569" cy="164" r="1.4" className="fill-zinc-500" />

          <rect x="456" y="180" width="90" height="10" rx="2" className="fill-zinc-700" />
          <rect x="456" y="198" width="104" height="6" rx="3" className="fill-zinc-400" />
          <rect x="456" y="210" width="88" height="6" rx="3" className="fill-zinc-400" />
          <rect x="456" y="222" width="100" height="6" rx="3" className="fill-zinc-400" />
          <rect x="456" y="234" width="70" height="6" rx="3" className="fill-zinc-400" />
          <rect x="456" y="254" width="96" height="6" rx="3" className="fill-zinc-400" />
          <rect x="456" y="266" width="84" height="6" rx="3" className="fill-zinc-400" />
        </g>

        <rect
          x="430"
          y="104"
          width="156"
          height="282"
          rx="30"
          className="fill-none stroke-black/10 dark:stroke-white/10"
        />
      </g>
    </svg>
  );
}

export default HeroPreview;
