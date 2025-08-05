export type ContentItem =
  | {
      type: "lesson"
      title: string
      text: string
    }
  | {
      type: "exercise"
      question: string
      correctAnswer: string
      tip?: string // Adicionando a propriedade de dica opcional
    }
