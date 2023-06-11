import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import "./Todo.css";

const TodoApp = () => {
  const [user, setUser] = useState(null);
  const [todoval, setTodoVal] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Redirect to sign-in page if not signed in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        window.location.replace("/signin");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    
    if (user) {
      auth.currentUser.getIdToken( true).then().catch(function(error) {
        console.log(error);
      });
      
      const q = query(
        collection(db, "todos"),
        where("userId", "==", user.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const todosData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(todosData);
        });

      return () => unsubscribe();
    }
},[user]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async (todoText) => {
    try {
      await addDoc(collection(db, "todos"), {
        userId: user.uid,
        text: todoText,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, "todos", todoId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-container">
      <div className="header-container">
        <h1>ToDo App</h1>
        <div className="user-container">
        {user === null ? null : (
          <>
            <h2>
              Welcome, <span style={{color:"#541a0f"}}>{user.displayName}</span>
            </h2>
            <div className="image-container">
              <img src={user.photoURL} alt="user" />
            </div>
            <button id='signout' onClick={handleSignOut}>Sign Out</button>
          </>
        )}
        </div>
      </div>
      <div className="writer-container">
        <input
          id="todo-id"
          type="text"
          value={todoval}
          placeholder="Add an item"
          onChange={(e) => setTodoVal(e.target.value)}
        />
        <button
          onClick={() => {
            addTodo(todoval);
            setTodoVal("");
          }}
        >
          Add todo
        </button>
      </div>

      <div className="todos-container">
        <ul>
          {todos.map((todo) => (
            <div>
            <li key={todo.id}>
              {todo.text}
            </li>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
