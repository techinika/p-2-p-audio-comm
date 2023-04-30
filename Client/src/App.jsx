import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Room from "./Pages/Room";

function App() {
  return(
    <>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/room/:roomID" element={<Room/>}></Route>
      </Routes>
    </>
  );
}

export default App;
