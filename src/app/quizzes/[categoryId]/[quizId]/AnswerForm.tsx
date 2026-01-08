'use client'

import { useState } from 'react'
import { Box, Button, Radio, RadioGroup, FormControlLabel, Alert, Typography } from '@mui/material'

interface Choice {
  id: number
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

  const selectedChoice = choices.find((choice) => choice.id === selectedId)
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
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: '12px',
          },
        }}
      >
        {choices.map((choice) => (
          <FormControlLabel
            key={choice.id}
            value={choice.id}
            control={<Radio size="small" />}
            label={choice.choice_text}
            disabled={submitted}
            sx={{ mb: 1 }}
          />
        ))}
      </RadioGroup>

      {submitted && (
        <Alert 
          severity={isCorrect ? 'success' : 'error'} 
          sx={{ 
            my: 2,
            '& .MuiAlert-message': {
              fontSize: '14px',
            },
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            {isCorrect ? '正解！' : '不正解...'}
          </Typography>
          <Box sx={{ mt: 1, fontSize: '12px' }}>{explanation}</Box>
        </Alert>
      )}

      {!submitted && (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={selectedId === null}
          sx={{ 
            mt: 2,
            fontSize: '12px',
            padding: '0.4rem 1rem',
          }}
        >
          回答する
        </Button>
      )}
    </Box>
  )
}