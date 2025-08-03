"use client"

import Image from "next/image"

// Este componente é apenas para exibir a imagem do professor.
// O balão de fala é renderizado separadamente na página que o utiliza.
export default function TeacherImage() {
  return (
    <div className="absolute bottom-4 left-4 z-20 h-20 w-20 flex-shrink-0 md:h-24 md:w-24">
      <Image
        src="/images/teacher.png"
        alt="WAcademy Professor"
        layout="fill"
        objectFit="contain"
        className="drop-shadow-md"
      />
    </div>
  )
}
