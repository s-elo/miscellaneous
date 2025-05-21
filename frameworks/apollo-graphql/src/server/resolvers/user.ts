import { MutationResolvers, QueryResolvers } from '../types';
import { userService } from '../services/user';

export const userQueryResolvers: QueryResolvers = {
  allUsers: async () => userService.getUsers(),
  user: async (_, { id }) => userService.getUser(id),
};

export const userMutationResolvers: MutationResolvers = {
  addUser: async (_, { name }) => {
    if (name) {
      return userService.addUser(name);
    }
    return null;
  },
};
