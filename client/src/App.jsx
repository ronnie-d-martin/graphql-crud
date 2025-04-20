import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

const GET_USERS = gql`
  query {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      id
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $age: Int, $isMarried: Boolean) {
    updateUser(id: $id, name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`;


function App() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: '', age: 0, isMarried: false });

  const handleDelete = async (id) => {
    await deleteUser({ variables: { id } });
    refetch();
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateUser({ variables: { id: editingId, ...form, age: Number(form.age) } });
    } else {
      await createUser({ variables: { ...form, age: Number(form.age) } });
    }
    refetch();
    setForm({ name: '', age: 0, isMarried: false });
    setEditingId(null);
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      age: user.age,
      isMarried: user.isMarried,
    });
    setEditingId(user.id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>User Manager</h1>

      <h2>Create User</h2>
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        value={form.age}
        onChange={e => setForm({ ...form, age: parseInt(e.target.value) })}
      />
      <label>
        <input
          type="checkbox"
          checked={form.isMarried}
          onChange={e => setForm({ ...form, isMarried: e.target.checked })}
        />
        Married
      </label>
      <button onClick={handleSubmit}>
        {editingId ? 'Update' : 'Create'}
      </button>

      <h2>User List</h2>
      {data.getUsers.map((user) => (
        <div key={user.id} style={{ border: '1px solid gray', padding: 10, marginBottom: 10 }}>
          <p><strong>{user.name}</strong></p>
          <p>Age: {user.age}</p>
          <p>Married: {user.isMarried ? 'Yes' : 'No'}</p>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
          <button onClick={() => handleEdit(user)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default App;
