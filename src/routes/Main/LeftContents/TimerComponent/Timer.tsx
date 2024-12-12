import { useEffect } from "react";
import { useTimerStore } from "../../../../store/store";

interface TimerType {
  style: {
    backgroundColor?: string;
    color?: string;
  };
  changingHours?: string;
  isStaticTime?: boolean;
  isFlowTime?: boolean;
  polygonForm?: "square" | "circle";
  alertSound?: boolean;
}

export default function Timer({
  style,
  changingHours,
  isStaticTime = false,
  isFlowTime = false,
  polygonForm = "square",
  alertSound = false,
}: TimerType) {
  const hours = useTimerStore((state) => state.hours);
  const minutes = useTimerStore((state) => state.minutes);
  const seconds = useTimerStore((state) => state.seconds);
  const staticHours = useTimerStore((state) => state.staticHours);
  const staticMinuites = useTimerStore((state) => state.staticMinuites);
  const staticSeconds = useTimerStore((state) => state.staticSeconds);
  const isAchieve = useTimerStore((state) => state.isAchieve);
  const setIsAchieve = useTimerStore((state) => state.setIsAchieve);
  const trophyModalViewed = useTimerStore((state) => state.trophyModalViewed);
  const setTrophyModalNotViewed = useTimerStore(
    (state) => state.setTrophyModalNotViewed
  );

  // 시간 달성 체크 기능
  useEffect(() => {
    const checkAchievement = () => {
      if (Number(staticHours) < hours) {
        !isAchieve && setIsAchieve();
        return;
      } else if (
        Number(staticHours) === hours &&
        Number(staticMinuites) < minutes
      ) {
        !isAchieve && setIsAchieve();
        return;
      } else if (
        Number(staticHours) === hours &&
        Number(staticMinuites) === minutes &&
        Number(staticSeconds) <= seconds
      ) {
        !isAchieve && setIsAchieve();
        return;
      } else {
        isAchieve && setIsAchieve();
      }
    };
    checkAchievement();
  }, [seconds]);

  useEffect(() => {
    if (isAchieve) {
      if (alertSound) {
        const audio = new Audio("/src/asset/achieved_alarm.mp3");
        audio.play().catch((error) => {
          console.error("❌ 알람 소리가 재생되지 않았습니다.", error);
        });
      }
    }
    if (!isAchieve) {
      if (trophyModalViewed === true) {
        setTrophyModalNotViewed();
      }
    }
  }, [isAchieve]);
  return (
    <>
      <article
        className={`LAB-digital timer-shadow flex flex-col gap-[10px] items-center justify-center w-[25rem] h-[25rem] bg-[#F0F5F8] mb-5 transition-colors duration-200 mix-blend-multiply ${
          polygonForm === "circle" ? "rounded-full" : "rounded-[10px]"
        }`}
        style={style}
      >
        {isStaticTime ? (
          <>
            <article className="flex gap-1 text-4xl text-gray-400">
              <span>{changingHours}</span>

              <span>:</span>

              <span>{"00"}</span>

              <span>:</span>

              <span>{"00"}</span>
            </article>
          </>
        ) : null}
        {isFlowTime ? (
          <>
            <article className="flex gap-1 text-4xl text-gray-400">
              <span>{staticHours}</span>

              <span>:</span>

              <span>{staticMinuites}</span>

              <span>:</span>

              <span>{staticSeconds}</span>
            </article>
            <span className="text-[20px] font-black">ㅡ</span>
            <article className="flex gap-1 text-5xl mt-[15px]">
              <span>{hours < 10 ? `0${hours}` : hours}</span>

              <span>:</span>

              <span>{minutes < 10 ? `0${minutes}` : minutes}</span>

              <span>:</span>

              <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
            </article>
          </>
        ) : null}
      </article>
    </>
  );
}
