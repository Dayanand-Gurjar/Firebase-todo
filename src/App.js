import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TodoApp from './components/Todo';
import SignIn from './components/SignIn';
import Register from './components/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route  exact path='/signin' element={<SignIn/>} />
        <Route exact path='/register' element={<Register/>} />
        <Route exact path='/' element={<TodoApp/>} />
      </Routes>
    </Router>
  );
};

export default App;
