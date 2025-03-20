import './App.css';
import { Inscription } from './components/Inscription';
import { Login } from './components/Login';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Inscription" element={<Inscription />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
