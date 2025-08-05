export type ContentItem = {
  type: "lesson" | "exercise"
  title?: string
  text?: string
  question?: string
  correctAnswer?: string
  tip?: string // Adicionada a propriedade tip
}
