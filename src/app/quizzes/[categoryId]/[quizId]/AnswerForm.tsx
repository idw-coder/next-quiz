'use client'

import { useState } from 'react'
import { Box, Button, Radio, RadioGroup, FormControlLabel, Alert } from '@mui/material'

interface Choice {
  id: number
  quiz_id: number
  choice_text: string
  is_correct: boolean
}

interface Props {
  choices: Choice[]
  explanation: string
}

export default function AnswerForm({ choices, explanation }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const selectedChoice = choices.find(c => c.id === selectedId)
  const isCorrect = selectedChoice?.is_correct || false

  const handleSubmit = () => {
    if (selectedId === null) return
    setSubmitted(true)
  }

  return (
    <Box>
      <RadioGroup
        value={selectedId}
        onChange={(e) => setSelectedId(Number(e.target.value))}
      >
        {choices.map((choice) => (
          <FormControlLabel
            key={choice.id}
            value={choice.id}
            control={<Radio />}
            label={choice.choice_text}
            disabled={submitted}
          />
        ))}
      </RadioGroup>

      {submitted && (
        <Alert severity={isCorrect ? 'success' : 'error'} sx={{ my: 2 }}>
          {isCorrect ? '正解！' : '不正解...'}
          <Box sx={{ mt: 1 }}>{explanation}</Box>
        </Alert>
      )}

      {!submitted && (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={selectedId === null}
          sx={{ mt: 2 }}
        >
          回答する
        </Button>
      )}
    </Box>
  )
}