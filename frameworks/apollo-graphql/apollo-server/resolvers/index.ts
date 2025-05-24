import { Resolvers } from '../types';
import { userMutationResolvers, userQueryResolvers } from './user';

// Query and Mutation are root types
export const resolvers: Resolvers = {
  Query: {
    root: () => 'root',
    ...userQueryResolvers,
  },
  Mutation: {
    root: () => 'root',
    ...userMutationResolvers,
  },
};
