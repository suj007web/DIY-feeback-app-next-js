'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';

interface FeedbackItem {
  _id: string;
  name: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

const CARD_SIZE_LG = 365;
const CARD_SIZE_SM = 290;
const BORDER_SIZE = 2;


const ROTATE_DEG = 2.5;
const STAGGER = 15;
const CENTER_STAGGER = -65;
const SECTION_HEIGHT = 600;

const Feedback: React.FC = () => {
  const [cardSize, setCardSize] = useState(CARD_SIZE_LG);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  const handleMove = (position: number) => {
    const copy = [...feedbacks];
    if (position > 0) {
      for (let i = position; i > 0; i--) {
        const firstEl = copy.shift();
        if (firstEl) copy.push({ ...firstEl, _id: Math.random().toString() });
      }
    } else {
      for (let i = position; i < 0; i++) {
        const lastEl = copy.pop();
        if (lastEl) copy.unshift({ ...lastEl, _id: Math.random().toString() });
      }
    }
    setFeedbacks(copy);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get<FeedbackItem[]>('/api/feedback');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();

    const handleSetCardSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? CARD_SIZE_LG : CARD_SIZE_SM);
    };
    window.addEventListener("resize", handleSetCardSize);
    handleSetCardSize();

    return () => window.removeEventListener("resize", handleSetCardSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-900" style={{ height: SECTION_HEIGHT }}>
      {feedbacks.map((feedback, idx) => {
        let position = 0;
        if (feedbacks.length % 2) {
          position = idx - (feedbacks.length + 1) / 2;
        } else {
          position = idx - feedbacks.length / 2;
        }

        return (
          <FeedbackCard
            key={feedback._id}
            feedback={feedback}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-8">
        <button
          onClick={() => handleMove(-1)}
          className="grid h-14 w-14 place-content-center text-3xl text-white transition-colors hover:bg-white hover:text-gray-900"
        >
          <GoArrowLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="grid h-14 w-14 place-content-center text-3xl text-white transition-colors hover:bg-white hover:text-gray-900"
        >
          <GoArrowRight />
        </button>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FeedbackCard = ({ position, feedback, handleMove, cardSize }: any) => {
  const isActive = position === 0;

  return (
    <motion.div
      initial={false}
      onClick={() => handleMove(position)}
      className={`absolute left-1/2 top-1/2 cursor-pointer border-white p-8 text-white transition-colors duration-500 ${
        isActive ? "z-10 bg-gray-800" : "z-0 bg-gray-700"
      }`}
      style={{
        borderWidth: BORDER_SIZE,
       
      }}
      animate={{
        width: cardSize,
        height: cardSize,
        x: `calc(-50% + ${position * (cardSize / 1.5)}px)`,
        y: `calc(-50% + ${
          isActive ? CENTER_STAGGER : position % 2 ? STAGGER : -STAGGER
        }px)`,
        rotate: isActive ? 0 : position % 2 ? ROTATE_DEG : -ROTATE_DEG,
        boxShadow: isActive ? "0px 8px 0px 4px white" : "0px 0px 0px 0px black",
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
    >
      <h3 className={`text-base sm:text-xl ${isActive ? "text-white" : "text-gray-300"}`}>
        {feedback.feedback}
      </h3>
      <p className={`absolute bottom-8 left-8 right-8 mt-2 text-sm italic ${isActive ? "text-gray-400" : "text-gray-500"}`}>
        - {feedback.name}
      </p>
    </motion.div>
  );
};

export default Feedback;
