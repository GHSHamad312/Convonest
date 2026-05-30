import './App.css';
import Signup from './components/sign_up'; 
import Login from './components/login'; 
import Frontpage from './components/frontpage'; 
import  Main from './components/Main'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;

