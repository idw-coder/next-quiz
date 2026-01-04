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
  
  interface Category {
    id: number;
    category_name: string;
  }
  
  interface Quiz {
    id: number;
    category_id: number;
    question: string;
  }
  
  const categories: Category[] = [
    { id: 1, category_name: "JavaScript基礎" },
    { id: 2, category_name: "React基礎" },
  ];
  
  const quizzes: Quiz[] = [
    { id: 1, category_id: 1, question: "変数を宣言するキーワードは？" },
    { id: 2, category_id: 1, question: "配列の長さを取得するプロパティは？" },
    { id: 3, category_id: 1, question: "console.log()の役割は？" },
    { id: 4, category_id: 2, question: "ステート管理のフックは？" },
    { id: 5, category_id: 2, question: "JSXで変数を埋め込む記法は？" },
    { id: 6, category_id: 2, question: "コンポーネントに値を渡す仕組みは？" },
  ];
  
  type Params = Promise<{ categoryId: string }>;
  
  export default async function QuizListPage({ params }: { params: Params }) {
    const { categoryId } = await params;
    const category = categories.find((c) => c.id === Number(categoryId));
    const categoryQuizzes = quizzes.filter((q) => q.category_id === Number(categoryId));
  
    if (!category) {
      return <div>カテゴリが見つかりません</div>;
    }
  
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <h2>{category.category_name}</h2>
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
          >
            <TableHead sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>問題</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
              {categoryQuizzes.map((quiz, index) => (
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
                      sx={{ padding: "0", fontSize: "12px"}}>
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