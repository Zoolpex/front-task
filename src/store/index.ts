import { reactive } from "vue"

export interface Person {
  id: number
  name: string
  ageInHours: number
}

export interface AppState {
  people: Person[]
  minimumAgeInMonths: number
}

export const store = reactive<AppState>({
  people: [
    { id: 1, name: "Alice", ageInHours: 262800 },
    { id: 2, name: "Bob", ageInHours: 350400 },
    { id: 3, name: "Charlie", ageInHours: 219000 },
  ],
  minimumAgeInMonths: 0,
})
