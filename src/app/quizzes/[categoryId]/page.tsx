"use client";
import { useState, useEffect } from "react";
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
  import { quizRepository, QuizCategory, Quiz } from "@/lib/quiz.repository";
  
  export default function QuizListPage() {
    const params = useParams();
    const categoryId = params.categoryId as string;
    const [category, setCategory] = useState<QuizCategory | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const categories = await quizRepository.findAllCategory();
          /**
           * find()メソッドは、配列の要素を検索して最初に見つかった要素を返すメソッド
           */
          const foundCategory = categories.find((category) => category.id === Number(categoryId));
          
          if (!foundCategory) {
            setError("カテゴリが見つかりません");
            return;
          }

          setCategory(foundCategory);

          const categoryQuizzes = await quizRepository.listByCategory(Number(categoryId));
          setQuizzes(categoryQuizzes);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "データの取得に失敗しました"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [categoryId]);

    if (loading) {
      return <div>読み込み中...</div>;
    }

    if (error || !category) {
      return <div>{error || "カテゴリが見つかりません"}</div>;
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
        <h2 style={{textAlign: "center", marginBottom: "1rem"}}>{category.category_name}</h2>
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
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "left !important" }}>{quiz.question}</TableCell>
                  <TableCell>
                    <Link href={`/quizzes/${categoryId}/${quiz.id}`}>
                      <Button variant="outlined" size="small"
                      sx={{ padding: "0", fontSize: "clamp(8px, 2vw, 12px)"}}>
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