import React, { Suspense, use } from 'react'
import { useQuery, useSuspenseQuery, useMutation } from '@apollo/client';
import { getUsers, type User, GET_USER, GET_USERS, ADD_USER } from "../../apis"

export const List: React.FC<{ promise: Promise<User[]> }> = ({ promise }) => {
  const users = use(promise);

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const QueryUser: React.FC = () => {
    const [id, setId] = React.useState('1');
  const { 
    loading, 
    error, 
    data: { user } = { user: null },
    refetch
  } = useQuery(GET_USER, { variables: { id: '1' } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={() => id && refetch({ id })}>Fetch User</button>
      <p>{user?.name}</p>
      <p>{user?.id}</p>
      { !user && <p>No user found</p> }
    </div>
  )
}

export const SuspenseList: React.FC = () => {
  const { data: { allUsers: users = [] }, refetch } = useSuspenseQuery(GET_USERS);

  return (
    <div>
      <button onClick={() => refetch()}>Fetch Users</button>
      <ul>
        {users?.map((user) => (
          <li key={user?.id}>
            {user?.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

const AddUser: React.FC = () => {
  const [name, setName] = React.useState('')
  const [addUser, { loading, error }] = useMutation(ADD_USER)

  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => name && addUser({ variables: { name } })}>Add User</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}

export const UserList: React.FC = () => {
  const [fetchUsers, setFetchUsers] = React.useState(getUsers())

  return (
    <div>
      <h2>User List</h2>
      <button onClick={() => setFetchUsers(getUsers())}>Fetch Users</button>
      <Suspense fallback={<div>Loading...</div>}>
        <List promise={fetchUsers}/>
      </Suspense>
      <hr />
      <QueryUser />
      <hr />
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseList />
      </Suspense>
      <AddUser />
    </div>
  )
}