"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Paper, Button } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import Link from "next/link";
import AnswerForm from "./AnswerForm";
import { quizRepository, Quiz, Choice } from "@/lib/quiz.repository";

export default function QuizPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizChoices, setQuizChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizzes = await quizRepository.listByCategory(Number(categoryId));
        const foundQuiz = quizzes.find((q) => q.id === Number(quizId));
        
        if (!foundQuiz) {
          setError("問題が見つかりません");
          return;
        }

        setQuiz(foundQuiz);
        
        const choices = await quizRepository.listByQuiz(Number(quizId));
        setQuizChoices(choices);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "問題の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [categoryId, quizId]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error || !quiz) {
    return <div>{error || "問題が見つかりません"}</div>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Link href={`/quizzes/${categoryId}`}>
          <Button
            variant="text"
            startIcon={<ArrowBackIosNew fontSize="small" />}
            sx={{
              alignSelf: "flex-start",
              "& .MuiButton-startIcon": {
                backgroundColor: "currentColor",
                borderRadius: "50%",
                padding: "4px",
                marginRight: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& svg": {
                  color: "white",
                  fontSize: "10px",
                },
              },
            }}
          >
            一覧に戻る
          </Button>
        </Link>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {quiz.question}
        </Typography>
        <AnswerForm choices={quizChoices} explanation={quiz.explanation} />
      </Paper>
    </Box>
  );
}
