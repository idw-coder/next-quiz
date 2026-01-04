import { Box, Typography, Paper } from "@mui/material";
import Link from "next/link";
import AnswerForm from "./AnswerForm";

interface Quiz {
  id: number;
  category_id: number;
  question: string;
  explanation: string;
}

interface Choice {
  id: number;
  quiz_id: number;
  choice_text: string;
  is_correct: boolean;
}

const quizzes: Quiz[] = [
  {
    id: 1,
    category_id: 1,
    question: "変数を宣言するキーワードは？",
    explanation: "varは古い書き方で、現在はletやconstが推奨されます",
  },
  {
    id: 2,
    category_id: 1,
    question: "配列の長さを取得するプロパティは？",
    explanation: "lengthプロパティで配列の要素数を取得できます",
  },
  {
    id: 3,
    category_id: 1,
    question: "console.log()の役割は？",
    explanation: "デバッグ時にコンソールに値を出力します",
  },
  {
    id: 4,
    category_id: 2,
    question: "ステート管理のフックは？",
    explanation: "useStateでコンポーネントの状態を管理します",
  },
  {
    id: 5,
    category_id: 2,
    question: "JSXで変数を埋め込む記法は？",
    explanation: "波括弧{}で囲むとJavaScript式を埋め込めます",
  },
  {
    id: 6,
    category_id: 2,
    question: "コンポーネントに値を渡す仕組みは？",
    explanation: "propsで親から子へデータを渡します",
  },
];

const choices: Choice[] = [
  { id: 1, quiz_id: 1, choice_text: "var", is_correct: true },
  { id: 2, quiz_id: 1, choice_text: "int", is_correct: false },
  { id: 3, quiz_id: 1, choice_text: "string", is_correct: false },
  { id: 4, quiz_id: 1, choice_text: "def", is_correct: false },
  { id: 5, quiz_id: 2, choice_text: "size", is_correct: false },
  { id: 6, quiz_id: 2, choice_text: "length", is_correct: true },
  { id: 7, quiz_id: 2, choice_text: "count", is_correct: false },
  { id: 8, quiz_id: 2, choice_text: "total", is_correct: false },
  { id: 9, quiz_id: 3, choice_text: "エラー表示", is_correct: false },
  { id: 10, quiz_id: 3, choice_text: "コンソール出力", is_correct: true },
  { id: 11, quiz_id: 3, choice_text: "ファイル保存", is_correct: false },
  { id: 12, quiz_id: 3, choice_text: "画面描画", is_correct: false },
  { id: 13, quiz_id: 4, choice_text: "useEffect", is_correct: false },
  { id: 14, quiz_id: 4, choice_text: "useState", is_correct: true },
  { id: 15, quiz_id: 4, choice_text: "useRef", is_correct: false },
  { id: 16, quiz_id: 4, choice_text: "useMemo", is_correct: false },
  { id: 17, quiz_id: 5, choice_text: "{{ }}", is_correct: false },
  { id: 18, quiz_id: 5, choice_text: "{% %}", is_correct: false },
  { id: 19, quiz_id: 5, choice_text: "{ }", is_correct: true },
  { id: 20, quiz_id: 5, choice_text: "<% %>", is_correct: false },
  { id: 21, quiz_id: 6, choice_text: "state", is_correct: false },
  { id: 22, quiz_id: 6, choice_text: "props", is_correct: true },
  { id: 23, quiz_id: 6, choice_text: "context", is_correct: false },
  { id: 24, quiz_id: 6, choice_text: "ref", is_correct: false },
];

type Params = Promise<{ categoryId: string; quizId: string }>;

export default async function QuizPage({ params }: { params: Params }) {
  const { categoryId, quizId } = await params;

  console.log('categoryId', categoryId)
  console.log('quizId', quizId)
  const quiz = quizzes.find((q) => q.id === Number(quizId));
  const quizChoices = choices.filter((c) => c.quiz_id === Number(quizId));

  if (!quiz) {
    return <div>問題が見つかりません</div>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Link
        href={`/quizzes/${categoryId}`}
        style={{ display: "block", marginBottom: "16px" }}
      >
        ← 一覧に戻る
      </Link>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {quiz.question}
        </Typography>
        <AnswerForm choices={quizChoices} explanation={quiz.explanation} />
      </Paper>
    </Box>
  );
}
