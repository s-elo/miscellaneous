import { User } from '../types';

export class UserService {
  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
    },
    {
      id: '2',
      name: 'Jane Doe',
    },
    {
      id: '3',
      name: 'Jim Doe',
    },
  ];

  async getUser(id: string) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async getUsers() {
    return this.users;
  }

  async addUser(name: string) {
    const id = this.users.length + 1;
    this.users.push({ id: id.toString(), name });
    return { id: id.toString(), name };
  }
}

export const userService = new UserService();
