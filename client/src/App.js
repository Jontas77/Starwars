import "./App.css";
import logo from "./StarWars_Logo.png";
import { Routes, Route } from "react-router-dom";

// import StarWarsPeople from "./components/StarWarsPeople";
import PeopleDetails from "./components/PeopleDetails";
import StarWarsPeople from "./components/StarWarsPeople";

const App = () => {
  // const [dataValue, setDataValue] = useState([]);

  return (
    <div className="container">
      <img
        src={logo}
        alt="Starwars logo"
        style={{ width: 300, display: "block", margin: "auto" }}
      />
      <Routes>
        <Route path="/" element={<StarWarsPeople />} />
        <Route path="/people/:id" element={<PeopleDetails />} />
      </Routes>
    </div>
  );
};

export default App;
