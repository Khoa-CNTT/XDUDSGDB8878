import { useState, useEffect } from "react";
import styles from "../../assets/css/auction-guideline.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineSolution } from "react-icons/ai";
import { BsHandIndexThumbFill } from "react-icons/bs";

const AuctionGuideLine = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(0);

  const getGuideSteps = () => {
    const steps = [
      {
        x: props?.elementCoordinates.itemInfo?.percent?.x + 5 || 30,
        y: props?.elementCoordinates.itemInfo?.percent?.y || 70,
        message: "Xem thông tin bất động sản đấu giá ở đây",
      },
      {
        x: props?.elementCoordinates.timeRemaining?.percent?.x || 70,
        y: props?.elementCoordinates.timeRemaining?.percent?.y || 40,
        message: "Xem thời gian còn lại của phiên đấu giá",
      },
      {
        x: props?.elementCoordinates.bidInput?.percent?.x || 70,
        y: props?.elementCoordinates.bidInput?.percent?.y || 65,
        message:
          "Nhập số tiền đấu giá của bạn (Hoặc bấm + - để tăng giảm số tiền đấu giá!)",
      },
      {
        x: props?.elementCoordinates.bidButton?.percent?.x || 70,
        y: props?.elementCoordinates.bidButton?.percent?.y + 3 || 75,
        message: "Nhấn nút đấu giá",
      },
      {
        x: props?.elementCoordinates.viewHistoryAuction?.percent?.x || 10,
        y: props?.elementCoordinates.viewHistoryAuction?.percent?.y || 50,
        message: "Xem lịch sử đấu giá",
      },
      {
        x: props?.elementCoordinates.viewGuestJoinAution?.percent?.x || 20,
        y: props?.elementCoordinates.viewGuestJoinAution?.percent?.y || 43,
        message: "Xem người tham gia đấu giá",
      },
      {
        x: props?.elementCoordinates.btnOutAuction?.percent?.x || 15,
        y: props?.elementCoordinates.btnOutAuction?.percent?.y + 5 || 88,
        message: "Rời phòng đấu giá",
      },
    ];
    return steps;
  };

  useEffect(() => {
    if (isVisible) {
      const steps = getGuideSteps();
      if (steps && steps.length > 0 && step < steps.length) {
        setPosition({
          x: steps[step].x,
          y: steps[step].y,
        });
      }
    }
  }, [step, isVisible, props?.elementCoordinates]);

  useEffect(() => {
    if (isVisible) {
      const steps = getGuideSteps();
      if (step >= steps.length) {
        setIsVisible(false);
        setStep(0);
        return;
      }
      const interval = setInterval(() => {
        setStep((prevStep) => {
          if (prevStep + 1 >= steps.length) {
            setIsVisible(false);
            clearInterval(interval);
            return prevStep;
          }
          return prevStep + 1;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isVisible, step]);

  const toggleGuideline = () => {
    if (!isVisible) {
      setStep(0);
    }
    setIsVisible((prev) => !prev);
  };

  const steps = getGuideSteps();

  const currentStep =
    steps && steps.length > 0 && step < steps.length
      ? steps[step]
      : { x: 50, y: 50, message: "Hướng dẫn đấu giá" };

  return (
    <div className={styles.guidelineContainer}>
      {isVisible && (
        <div
          className={styles.handIcon}
          style={{
            left: `${position?.x}%`,
            top: `${position?.y}%`,
          }}
        >
          <BsHandIndexThumbFill className={styles.iconGuideline} />
          <div className={styles.messageBox}>{currentStep?.message}</div>
        </div>
      )}
      <button
        className={styles.closeButton}
        onClick={toggleGuideline}
        aria-label={isVisible ? "Tắt hướng dẫn" : "Xem hướng dẫn"}
      >
        {isVisible ? <AiOutlineClose /> : <AiOutlineSolution />}
        {isVisible ? "Tắt hướng dẫn" : "Xem hướng dẫn"}
      </button>
    </div>
  );
};

export default AuctionGuideLine;
