'use client'
import { useParams } from "next/navigation";
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import Link from "next/link";
import { quizRepository } from "@/lib/quiz.repository";
import { useQuery } from "@tanstack/react-query";

export default function QuizListPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => quizRepository.findAllCategory(),
  });
  const {
    data: quizzes = [],
    isLoading: quizzesLoading,
    error,
  } = useQuery({
    queryKey: ["quizzes", categoryId],
    queryFn: () => quizRepository.listByCategory(Number(categoryId)),
  });

  const category = categories.find((cat) => cat.id === Number(categoryId));
  const loading = categoriesLoading || quizzesLoading;

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return (
      <div>
        {error instanceof Error ? error.message : "データの取得に失敗しました"}
      </div>
    );
  }

  if (!category) {
    return <div>カテゴリーが見つかりません</div>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Link href="/home">
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
          ホームに戻る
        </Button>
      </Link>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        {category.category_name}
      </h2>
      <TableContainer component={Paper}>
        <Table
          sx={{
            //   minWidth: 650,
            "& .MuiTableCell-root": {
              fontSize: "clamp(8px, 2.5vw, 12px)",
              padding: "0.2rem 0.4rem",
            },
          }}
          size="small"
        >
          <TableHead sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>問題</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
            {quizzes.map((quiz, index) => (
              <TableRow
                key={quiz.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell sx={{ textAlign: "left !important" }}>
                  {quiz.question}
                </TableCell>
                <TableCell>
                  <Link href={`/quizzes/${categoryId}/${quiz.id}`}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ padding: "0", fontSize: "clamp(8px, 2vw, 12px)" }}
                    >
                      解く
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
