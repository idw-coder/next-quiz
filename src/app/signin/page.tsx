"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Link } from "@mui/material";
import { authRepository } from "@/lib/auth.repository";
import { USER_QUERY_KEY } from "@/hooks/useAuth";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await authRepository.login({ email, password })
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY }) // 認証状態を再取得
      router.push("/home");
    } catch (error) {
      alert("ログインに失敗しました");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <p style={{ fontSize: "14px" }}>
        アカウントを持っていない場合は<Link href="/signup">新規登録</Link>から
      </p>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          border: "1px solid #ccc",
          padding: "1rem 2rem",
          borderRadius: "0.25rem",
          maxWidth: "300px",
          fontSize: "12px",
        }}
      >
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="test@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.4rem 0.8rem",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="password123"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.4rem 0.8rem",
              boxSizing: "border-box",
            }}
          />
        </div>
        <Button type="submit" variant="contained" size="small">
          ログイン
        </Button>
      </form>
    </div>
  );
}
