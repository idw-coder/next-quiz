# ランダム連続解答機能

クイズ一覧ページから「ランダム5問」を開始し、連続で問題を解いて結果を確認できる機能を追加する。

## 概要

現状は一覧ページ `/quizzes/[categoryId]` から個別の問題ページ `/quizzes/[categoryId]/[quizId]` に遷移して1問ずつ解答する流れ。これに加えて、カテゴリーからランダムに5問出題し、ページ遷移なしで連続して解答できるモードを実装する。

## Laravel API

新規エンドポイント `GET /quiz/category_{categoryId}/random?count=5` を作成する。

カテゴリー内の問題からランダムにN問を選び、各問題の選択肢も含めて一括で返す。Eloquentの `inRandomOrder()->take($count)` でランダム抽出し、選択肢はEager Loadする。

レスポンス例:
```json
{
  "quizzes": [
    {
      "id": 12,
      "question": "問題文...",
      "explanation": "解説...",
      "choices": [
        { "id": 1, "choice_text": "選択肢A", "is_correct": false },
        { "id": 2, "choice_text": "選択肢B", "is_correct": true }
      ]
    }
  ]
}
```

## Next.js

`src/lib/quiz.repository.ts` に `getRandomQuizzes(categoryId, count)` メソッドを追加して上記APIを呼び出す。

新規ページ `src/app/quizzes/[categoryId]/random/page.tsx` を作成する。実際のロジックはClient Componentとして `RandomSessionClient.tsx` に分離する。

RandomSessionClientが管理する状態は、出題する5問のデータ、現在何問目か、各問題の正誤結果、フェーズ（loading / playing / finished）の4つ。

画面の流れは、ローディング → 問題表示（5問繰り返し）→ 結果画面。解答後に「次の問題へ」ボタンを表示し、5問終了後は正解数と各問題の正誤を表示する。

一覧ページ `src/app/quizzes/[categoryId]/page.tsx` には「ランダム5問」ボタンを追加し、ランダム連続解答ページへの導線とする。

## AnswerFormの共通化

既存の `src/app/quizzes/[categoryId]/[quizId]/AnswerForm.tsx` をランダム連続解答モードでも使用する。

現状のAnswerFormは解答後に解説を表示して完結する作りになっている。ランダム連続解答モードでは解答確定後に「次の問題へ」ボタンを表示する必要があるため、propsで以下を追加する。

- `onAnswered?: (isCorrect: boolean) => void` — 解答確定時のコールバック
- `showNextButton?: boolean` — 「次の問題へ」ボタンを表示するか
- `onNext?: () => void` — 「次の問題へ」クリック時のコールバック

通常の個別問題ページではこれらのpropsを渡さず、従来通りの挙動を維持する。ランダム連続解答モードではコールバックを渡して進行を制御する。

