// Define o tipo para o conteúdo da disciplina
export type ContentItem = {
  type: "lesson" | "exercise"
  title: string
  text?: string // Para aulas
  question?: string // Para exercícios
  correctAnswer?: string // Para exercícios
}
