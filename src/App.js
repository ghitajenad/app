import './App.css';
import { Inscription } from './components/Inscription';
import { Login } from './components/Login';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Inscription" element={<Inscription />} />
            //this is a text
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
