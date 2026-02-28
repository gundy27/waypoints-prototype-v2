export default function ContourBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M200,400 Q300,200 500,350 Q700,500 600,650 Q450,750 300,600 Q200,500 200,400Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.5"
        />
        <path
          d="M180,400 Q280,180 520,330 Q720,520 620,670 Q470,770 280,620 Q180,520 180,400Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.45"
        />
        <path
          d="M160,400 Q260,160 540,310 Q740,540 640,690 Q490,790 260,640 Q160,540 160,400Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.4"
        />
        <path
          d="M140,400 Q240,140 560,290 Q760,560 660,710 Q510,810 240,660 Q140,560 140,400Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.35"
        />
        <path
          d="M400,150 Q550,200 600,350 Q650,500 500,550 Q350,580 300,450 Q280,300 400,150Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.5"
        />
        <path
          d="M400,130 Q570,180 620,370 Q670,520 520,570 Q370,600 280,470 Q260,280 400,130Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.45"
        />
        <path
          d="M400,110 Q590,160 640,390 Q690,540 540,590 Q390,620 260,490 Q240,260 400,110Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.4"
        />
        <path
          d="M100,200 Q200,100 350,150 Q500,200 480,350 Q450,480 300,450 Q150,400 100,300 Q80,250 100,200Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.4"
        />
        <path
          d="M80,200 Q180,80 370,130 Q520,180 500,370 Q470,510 280,470 Q130,420 80,310 Q60,250 80,200Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.35"
        />
        <path
          d="M550,600 Q650,550 720,620 Q780,700 700,760 Q620,800 560,740 Q500,680 550,600Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.45"
        />
        <path
          d="M530,590 Q640,530 740,610 Q810,710 720,780 Q630,830 540,760 Q470,680 530,590Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.38"
        />
        <path
          d="M300,50 Q450,20 550,100 Q630,180 580,280 Q520,360 400,320 Q280,280 260,180 Q250,100 300,50Z"
          stroke="#D2C4A8" strokeWidth="1" opacity="0.42"
        />
      </svg>
    </div>
  )
}
