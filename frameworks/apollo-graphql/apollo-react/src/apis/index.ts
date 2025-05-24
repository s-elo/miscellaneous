import { ApolloClient, InMemoryCache } from '@apollo/client'
import { gql } from '../ql-utils'

export const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
})

export type User = {
  id: string
  name: string
}
// can be used for apollo useQuery
export const GET_USERS = gql(`
  query GetUsers {
    allUsers {
      id
      name
    }
  }
`)
// normal usage
export async function getUsers() {
  const { data } = await client.query({
    query: GET_USERS,
  })
  return data.allUsers?.filter(Boolean) as User[] || []
}

export const GET_USER = gql(`
  query user($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`)

export const ADD_USER = gql(`
  mutation addUser($name: String!) {
    addUser(name: $name) {
      id
      name
    }      
  }
`)
