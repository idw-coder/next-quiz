"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import {
  Restore,
  Delete,
  Edit,
  Visibility,
  Add,
  PlayArrow,
} from "@mui/icons-material";
import { quizRepository } from "@/lib/quiz.repository";
import GoogleAdSense from "@/components/GoogleAdSense";

interface QuizCategory {
  id: number;
  category_name: string;
  description: string;
  // author_id: number;
  // created_at: string;
  // updated_at: string;
  // deleted_at?: string | null;
}

export default function Home() {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categories = await quizRepository.findAllCategory();
      setCategories(categories);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "問題カテゴリーの取得に失敗しました"
      )
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("問題カテゴリーを削除してもよろしいですか？")) {
      return;
    }
    // TODO: バックエンドAPI実装後に有効化
  };

  const handleRestore = async (id: number) => {
    if (!window.confirm("問題カテゴリーを復元してもよろしいですか？")) {
      return;
    }
    // TODO: バックエンドAPI実装後に有効化
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/quiz-categories/create")}
          size="small"
        >
          問題カテゴリー新規登録
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              fontSize: "12px",
              padding: "0.2rem 0.4rem",
            },
          }}
          size="small"
          aria-label="simple table"
        >
          <TableHead sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>カテゴリー名</TableCell>
              <TableCell>説明</TableCell>
              <TableCell>クイズ</TableCell>
              {/* <TableCell>作成日時</TableCell> */}
              {/* <TableCell>更新日時</TableCell> */}
              {/* <TableCell>削除日時</TableCell> */}
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  // backgroundColor: category.deleted_at ? "#f0f0f0" : "#fff",
                }}
              >
                <TableCell component="th" scope="row">
                  {category.id}
                </TableCell>
                <TableCell>{category.category_name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => router.push(`/quizzes/${category.id}`)}
                    sx={{ fontSize: '10px', padding: '0.2rem' }}
                  >
                    開始
                  </Button>
                </TableCell>

                {/* <TableCell>{formatDate(category.created_at)}</TableCell> */}
                {/* <TableCell>{formatDate(category.updated_at)}</TableCell> */}
                {/* <TableCell> */}
                  {/* {category.deleted_at
                    ? formatDate(category.deleted_at)
                    : "---"} */}
                {/* </TableCell> */}
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        router.push(`/quiz-categories/${category.id}`)
                      }
                      title="詳細"
                      sx={{
                        "& svg": { fontSize: "18px" },
                        color: "primary.main",
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        router.push(`/quiz-categories/${category.id}/edit`)
                      }
                      title="編集"
                      sx={{
                        "& svg": { fontSize: "18px" },
                        color: "primary.main",
                      }}
                    >
                      <Edit />
                    </IconButton>
                    {/* {category.deleted_at ? ( */}
                      {/* <IconButton
                        size="small"
                        onClick={() => handleRestore(category.id)}
                        title="復元"
                        sx={{
                          "& svg": { fontSize: "18px" },
                          color: "primary.light",
                        }}
                      > */}
                        {/* <Restore /> */}
                      {/* </IconButton> */}
                    {/* ) : ( */}
                      {/* <IconButton
                        size="small"
                        onClick={() => handleDelete(category.id)}
                        title="削除"
                        sx={{
                          "& svg": { fontSize: "18px" },
                          color: "error.light",
                        }}
                      > */}
                        {/* <Delete /> */}
                      {/* </IconButton> */}
                    {/* )} */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
