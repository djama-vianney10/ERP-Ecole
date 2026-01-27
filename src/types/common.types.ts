export type TeacherClass =  {
  id: string
  name: string
  level: 'SIXIEME' | 'CINQUIEME' | 'QUATRIEME' | 'TROISIEME'
  subject: string
  studentCount: number
  nextSession: string
  room: string
}