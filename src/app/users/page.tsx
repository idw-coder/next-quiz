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
import { Restore, Delete, Edit, Visibility, Add } from "@mui/icons-material";
import { userRepository, type User } from "@/lib/user.repository";
import ProtectedRoute from "@/components/ProtectedRoute";

function UsersContent() {
	const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
			const users = await userRepository.findAll()
			setUsers(users)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ユーザーの一覧の取得に失敗しました"
      );
			console.error(error)
			router.push('/home')
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("ユーザーを削除してもよろしいですか？")) {
      return;
    }
    try {
			setLoading(true)
			await userRepository.delete(id)
			fetchUsers()
		} catch (error) {
			setError(error instanceof Error ? error.message : 'ユーザーの削除に失敗しました')
		} finally {
			setLoading(false)
		}
  };

  const handleRestore = async (id: number) => {
    if (!window.confirm("ユーザーを復元してもよろしいですか？")) {
      return;
    }
    try {
			setLoading(true)
			await userRepository.restore(id)
			fetchUsers()
		} catch (error) {
			setError(error instanceof Error ? error.message : 'ユーザーの復元に失敗しました')
		} finally {
			setLoading(false)
		}
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 650,
          '& .MuiTableCell-root': {
            fontSize: '12px',
            padding: '0.2rem 0.4rem',
          },
        }}
        size="small"
        aria-label="simple table"
      >
        <TableHead sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>名前</TableCell>
            <TableCell>メールアドレス</TableCell>
            <TableCell>ロール</TableCell>
            <TableCell>作成日時</TableCell>
            <TableCell>更新日時</TableCell>
            <TableCell>削除日時</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: user.deleted_at ? '#f0f0f0' : '#fff',
              }}
            >
              <TableCell component="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role || '---'}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>{formatDate(user.updated_at)}</TableCell>
              <TableCell>{user.deleted_at ? formatDate(user.deleted_at) : '---'}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/users/${user.id}/edit`)}
                    title="編集"
                    sx={{ '& svg': { fontSize: '18px' }, color: 'primary.main' }}
                  >
                    <Edit />
                  </IconButton>
                  {user.deleted_at ? (
                    <IconButton
                      size="small"
                      onClick={() => handleRestore(user.id)}
                      title="復元"
                      sx={{ '& svg': { fontSize: '18px' }, color: 'primary.light' }}
                    >
                      <Restore />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(user.id)}
                      title="削除"
                      sx={{ '& svg': { fontSize: '18px' }, color: 'error.light' }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default function Users() {
  return (
    <ProtectedRoute>
      <UsersContent />
    </ProtectedRoute>
  );
}
