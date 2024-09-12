// components/TerminalContact.tsx
"use client";

import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { Fragment, useEffect, useRef, useState, FormEvent } from "react";
import axios from "axios";

interface Question {
  key: string;
  text: string;
  postfix: string;
  complete: boolean;
  value: string;
}

const QUESTIONS: Question[] = [
  {
    key: "name",
    text: "Awesome! And what's ",
    postfix: "your name?",
    complete: false,
    value: "",
  },
  {
    key: "feedback",
    text: "Perfect, and ",
    postfix: "how can we help you? (feedback)",
    complete: false,
    value: "",
  },
];

const TerminalContact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [questions, setQuestions] = useState(QUESTIONS);
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const curQuestion = questions.find((q) => !q.complete);

  const handleSubmitLine = async (value: string) => {
    if (curQuestion) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.key === curQuestion.key
            ? {
                ...q,
                complete: true,
                value,
              }
            : q
        )
      );
    }

    
    if (!curQuestion) {
      const formData = questions.reduce((acc, val) => {
        return { ...acc, [val.key]: val.value };
      }, {});

      try {
        await axios.post("/api/feedback", formData);
        alert("Feedback submitted successfully!");
      } catch (error) {
        alert("Error submitting feedback");
      }
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmitLine(text);
    setText("");
    scrollToBottom();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    scrollToBottom();
  };

  useEffect(() => {
    inputRef.current?.focus();
    return () => setFocused(false);
  }, []);

  return (
    <section
    
      className="px-4 py-12"
    >
      <div
  ref={containerRef}
  onClick={() => inputRef.current?.focus()}
  className="h-96 bg-slate-950/70 backdrop-blur rounded-lg w-full max-w-3xl mx-auto overflow-y-scroll scrollbar-hide shadow-xl cursor-text font-mono"
>

        <TerminalHeader />
        <TerminalBody
          questions={questions}
          curQuestion={curQuestion}
          inputRef={inputRef}
          text={text}
          focused={focused}
          setText={setText}
          setFocused={setFocused}
          onSubmit={onSubmit}
          onChange={onChange}
          containerRef={containerRef}
        />
      </div>
    </section>
  );
};

const TerminalHeader: React.FC = () => {
  return (
    <div className="w-full p-3 bg-slate-900 flex items-center gap-1 sticky top-0 ">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="text-sm text-slate-200 font-semibold absolute left-[50%] -translate-x-[50%]">
        contact@sujalchauhan
      </span>
    </div>
  );
};

interface TerminalBodyProps {
  questions: Question[];
  curQuestion: Question | undefined;
  inputRef: React.RefObject<HTMLInputElement>;
  text: string;
  focused: boolean;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (e: FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TerminalBody: React.FC<TerminalBodyProps> = ({
  questions,
  curQuestion,
  inputRef,
  text,
  focused,
  setText,
  setFocused,
  onSubmit,
  onChange,
  containerRef,
}) => {
  return (
    <div className="p-2 text-slate-100 text-lg ">
      <InitialText />
      <PreviousQuestions questions={questions} />
      <CurrentQuestion curQuestion={curQuestion} />
      {curQuestion ? (
        <CurLine
          text={text}
          focused={focused}
          setText={setText}
          setFocused={setFocused}
          inputRef={inputRef}
          command={curQuestion?.key || ""}
          onSubmit={onSubmit}
          onChange={onChange}
          containerRef={containerRef}
        />
      ) : (
        <Summary questions={questions} />
      )}
    </div>
  );
};

const InitialText: React.FC = () => (
  <>
    <p>Hey there! We&apos;re excited to link 🔗</p>
    <p className="whitespace-nowrap overflow-hidden font-light">
      ------------------------------------------------------------------------
    </p>
  </>
);

const PreviousQuestions: React.FC<{ questions: Question[] }> = ({
  questions,
}) => (
  <>
    {questions.map((q, i) =>
      q.complete ? (
        <Fragment key={i}>
          <p>
            {q.text}
            <span className="text-violet-300">{q.postfix}</span>
          </p>
          <p className="text-emerald-300">
            <FiCheckCircle className="inline-block mr-2" />
            {q.value}
          </p>
        </Fragment>
      ) : null
    )}
  </>
);

const CurrentQuestion: React.FC<{ curQuestion: Question | undefined }> = ({
  curQuestion,
}) => (
  <p>
    {curQuestion?.text}
    <span className="text-violet-300">{curQuestion?.postfix}</span>
  </p>
);

const CurLine: React.FC<{
  text: string;
  focused: boolean;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement>;
  command: string;
  onSubmit: (e: FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({
  text,
  focused,
 
  setFocused,
  inputRef,
  command,
  onSubmit,
  onChange,

}) => {

  useEffect(() => {
    return () => setFocused(false);
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          onChange={onChange}
          value={text}
          type="text"
          className="sr-only"
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </form>
      <p>
        <span className="text-emerald-400">➜</span>{" "}
        <span className="text-cyan-300">~</span>{" "}
        {command && <span className="opacity-50">Enter {command}: </span>}
        {text}
        {focused && (
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
              times: [0, 0.5, 0.5, 1],
            }}
            className="inline-block w-2 h-5 bg-slate-400 translate-y-1 ml-0.5"
          />
        )}
      </p>
    </>
  );
};

const Summary: React.FC<{ questions: Question[] }> = ({ questions }) => {
  const [complete, setComplete] = useState(false);

  const submitForm = async () => {
    const formData = questions.reduce((acc, val) => {
      return { ...acc, [val.key]: val.value };
    }, {});

    try {
      await axios.post("/api/feedback", formData);
      setComplete(true);
    } catch (error) {
      alert("Error submitting feedback");
    }
  };

  return complete ? (
    <p className="text-emerald-400">Thank you for your feedback!</p>
  ) : (
    <motion.button
      onClick={submitForm}
      className="px-4 py-2 bg-emerald-600 rounded-lg text-slate-100 mt-2"
    >
      Submit Feedback
    </motion.button>
  );
};

export default TerminalContact;
