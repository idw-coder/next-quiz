"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { AccountCircle, ArrowBackIosNew } from "@mui/icons-material";
import { userRepository, getUserImageUrl } from "@/lib/user.repository";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useConfirmDialog } from "@/store/useConfirmDialog";

function UserEditContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { open } = useConfirmDialog();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    new_password: "",
  });
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setStatus({ loading: true, success: false, error: false, message: "" });
        const userData = await userRepository.findOne(Number(id));
        const roles = await userRepository.findAllRoles();

        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role || "",
        });
        setProfileImage(userData.profile_image || null);
        setAvailableRoles(roles || []);
      } catch (error) {
        /**
         * errorオブジェクトはunknown型ですがError型として扱えるように
         * 「instanceof」を使用
         */
        const errorMessage =
          error instanceof Error
            ? error.message
            : "ユーザー情報の取得に失敗しました";
        setStatus({
          loading: false,
          success: false,
          error: true,
          message: errorMessage,
        });
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, role: role }));
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    open("ユーザー情報を更新してもよろしいですか？", async () => {
      setStatus({ loading: true, success: false, error: false, message: "" });
      try {
        const data = await userRepository.update(Number(id), {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: data.message || "ユーザー情報を更新しました",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "ユーザー情報の更新に失敗しました";
        setStatus({
          loading: false,
          success: false,
          error: true,
          message: errorMessage,
        });
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    open("パスワードをリセットしてもよろしいですか？", async () => {
      setStatus({ loading: true, success: false, error: false, message: "" });
      try {
        const data = await userRepository.resetPassword(
          Number(id),
          passwordData.new_password
        );
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: data.message || "パスワードをリセットしました",
        });
        setPasswordData({ new_password: "" });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "パスワードのリセットに失敗しました";
        setStatus({
          loading: false,
          success: false,
          error: true,
          message: errorMessage,
        });
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    open("プロフィール画像を更新してもよろしいですか？", async () => {
      setStatus({ loading: true, success: false, error: false, message: "" });
      try {
        const data = await userRepository.updateImage(Number(id), file);
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: data.message || "プロフィール画像を更新しました",
        });
        setProfileImage(data.profile_image || null);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "プロフィール画像の更新に失敗しました";
        setStatus({
          loading: false,
          success: false,
          error: true,
          message: errorMessage,
        });
      }
    });
  };

  const handleImageDelete = () => {
    open(
      "プロフィール画像を削除してもよろしいですか？この操作は取り消せません",
      async () => {
        setStatus({ loading: true, success: false, error: false, message: "" });
        try {
          const data = await userRepository.deleteImage(Number(id));
          setStatus({
            loading: false,
            success: true,
            error: false,
            message: data.message || "プロフィール画像を削除しました",
          });
          setProfileImage(null);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "プロフィール画像の削除に失敗しました";
          setStatus({
            loading: false,
            success: false,
            error: true,
            message: errorMessage,
          });
        }
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "300px",
        fontSize: "12px",
      }}
    >
      {/* 戻るボタン */}
      <Button
        variant="text"
        startIcon={<ArrowBackIosNew fontSize="small" />}
        onClick={() => router.push("/users")}
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
        ユーザー一覧に戻る
      </Button>

      {/* プロフィール画像セクション */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {profileImage ? (
          <img
            src={getUserImageUrl(profileImage) || ""}
            alt="プロフィール画像"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
              border: "1px solid #ccc",
            }}
          />
        ) : (
          <div
            style={{
              width: "100px",
              height: "120px",
              borderRadius: "0%",
              border: "1px solid #ccc",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountCircle style={{ fontSize: "100px", color: "#666" }} />
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              size="small"
              component="span"
              disabled={status.loading}
            >
              新しく画像をアップロード
            </Button>
          </label>
          {profileImage && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleImageDelete}
              disabled={status.loading}
            >
              削除
            </Button>
          )}
        </div>
      </div>

      {/* ユーザー情報更新フォーム */}
      <form
        onSubmit={handleProfileSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <h3 style={{ textAlign: "center", margin: "0" }}>ユーザー情報</h3>
        <div>
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.4rem 0.8rem",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.4rem 0.8rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* ロール選択セクション */}
        <div>
          <label>ロール</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {availableRoles.map((role, index) => (
              <label
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={formData.role === role}
                  onChange={() => handleRoleChange(role)}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={status.loading}
        >
          {status.loading ? "更新中..." : "ユーザー情報を更新"}
        </Button>
      </form>

      {/* パスワードリセットフォーム */}
      <form
        onSubmit={handlePasswordSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <h3 style={{ textAlign: "center", margin: "0" }}>パスワードリセット</h3>
        <div>
          <label htmlFor="new_password">新しいパスワード</label>
          <input
            id="new_password"
            type="password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            required
            minLength={8}
            style={{
              width: "100%",
              padding: "0.4rem 0.8rem",
              boxSizing: "border-box",
            }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={status.loading}
        >
          {status.loading ? "リセット中..." : "パスワードをリセット"}
        </Button>
      </form>

      {/* ステータスメッセージ */}
      {status.error && <p style={{ color: "red" }}>{status.message}</p>}
      {status.success && <p style={{ color: "green" }}>{status.message}</p>}
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <UserEditContent />
    </ProtectedRoute>
  );
}
