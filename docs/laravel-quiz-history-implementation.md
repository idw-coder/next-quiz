## 概要

ユーザーのクイズ回答履歴をサーバー側で保存する機能を追加したい。

現状、Next.js側でlocalStorageに保存しているが、ログインユーザーはサーバー側で保持し、複数デバイス間で履歴を共有できるようにする。

---

## 必要なテーブル

### quiz_histories

| カラム | 型 | 説明 |
|--------|-----|------|
| id | bigint (PK) | 主キー |
| user_id | bigint (FK → users.id) | ユーザーID。ユーザー削除時はカスケード削除 |
| quiz_id | bigint | クイズID |
| category_id | bigint | カテゴリID |
| is_correct | boolean | 正解したかどうか |
| answered_at | timestamp | 回答日時（クライアントから送信される） |
| created_at | timestamp | レコード作成日時 |
| updated_at | timestamp | レコード更新日時 |

インデックス:
- `(user_id, category_id)` - カテゴリ別履歴取得用
- `(user_id, quiz_id)` - クイズ別履歴取得用

---

## 必要なAPI

既存の `/quiz/categories`, `/quiz/tags` などと同じ規約で作成。

### 1. 履歴一覧取得

- **メソッド**: GET
- **パス**: `/quiz/histories`
- **用途**: ログインユーザーの全履歴を取得
- **レスポンス**: 履歴の配列（answered_at降順）

```json
[
    {
        "id": 1,
        "user_id": 1,
        "quiz_id": 10,
        "category_id": 2,
        "is_correct": true,
        "answered_at": "2026-02-01T10:30:00.000000Z",
        "created_at": "2026-02-01T10:30:00.000000Z",
        "updated_at": "2026-02-01T10:30:00.000000Z"
    }
]
```

### 2. 履歴1件保存

- **メソッド**: POST
- **パス**: `/quiz/histories`
- **用途**: クイズ回答時に1件保存
- **リクエスト**:

```json
{
    "quiz_id": 10,
    "category_id": 2,
    "is_correct": true,
    "answered_at": "2026-02-01T10:30:00.000000Z"
}
```

- **レスポンス**: 作成されたレコード（201 Created）

### 3. 履歴一括保存

- **メソッド**: POST
- **パス**: `/quiz/histories/bulk`
- **用途**: ログイン時にlocalStorageの履歴をサーバーに同期するため
- **リクエスト**:

```json
{
    "histories": [
        {
            "quiz_id": 10,
            "category_id": 2,
            "is_correct": true,
            "answered_at": "2026-02-01T10:30:00.000000Z"
        },
        {
            "quiz_id": 11,
            "category_id": 2,
            "is_correct": false,
            "answered_at": "2026-02-01T10:31:00.000000Z"
        }
    ]
}
```

- **レスポンス**:

```json
{
    "message": "Synced successfully",
    "count": 2
}
```

- **備考**: 同じquiz_idの履歴が既に存在しても、追加で保存してよい（履歴なので複数回の回答を残す）

### 4. 履歴クリア

- **メソッド**: DELETE
- **パス**: `/quiz/histories`
- **用途**: ログインユーザーの履歴を全削除
- **レスポンス**:

```json
{
    "message": "History cleared"
}
```

---

## 補足

- 同じクイズを複数回解いた場合、すべて履歴として保存する（上書きではなく追加）
- Next.js側では最新の回答を「現在の状態」として使用する
- バリデーションエラー時は既存APIと同じ形式でエラーレスポンスを返す
