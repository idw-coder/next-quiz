"use client";

import { useState } from "react";

interface Choice {
  id: number;
  choice_text: string;
  is_correct: boolean;
}

interface Props {
  choices: Choice[];
  explanation: string;
}

export default function AnswerForm({ choices, explanation }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedChoice = choices.find((choice) => choice.id === selectedId);
  const isCorrect = selectedChoice?.is_correct || false;

  const handleSubmit = () => {
    if (selectedId === null) return;
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        {choices.map((choice) => {
          const isChoiceCorrect = submitted && choice.is_correct;
          const isChoiceIncorrect = submitted && !choice.is_correct && selectedId === choice.id;

          return (
            <label
              key={choice.id}
              className={`flex items-center gap-2 p-2 text-xs ${
                submitted ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={choice.id}
                checked={selectedId === choice.id}
                onChange={(e) => setSelectedId(Number(e.target.value))}
                disabled={submitted}
                className={`${submitted ? "cursor-default" : "cursor-pointer"} ${
                  isChoiceCorrect ? "accent-green-700" : ""
                } ${isChoiceIncorrect ? "accent-red-600" : ""}`}
              />
              <span
                className={`${isChoiceCorrect ? "font-semibold text-green-700" : ""} ${
                  isChoiceIncorrect ? "text-red-600" : ""
                }`}
              >
                {choice.choice_text}
              </span>
            </label>
          );
        })}
      </div>

      {submitted && (
        <div
          className={`my-4 rounded p-3 text-sm ${
            isCorrect
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <p className="mb-2 text-sm font-medium">
            {isCorrect ? "正解！" : "不正解..."}
          </p>
          <p className="text-xs">{explanation}</p>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selectedId === null}
          className="mt-4 rounded bg-blue-600 px-4 py-1.5 text-xs text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          回答する
        </button>
      )}
    </div>
  );
}