import { create } from 'zustand'

type UserState = {
  name: string
  age: number
}

type UserActions = {
  setName: (name: string) => void
  setAge: (age: number) => void
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  name: 'John',
  age: 20,
  setName: (name: string) => set({ name }),
  setAge: (age: number) => set({ age }),
}))
