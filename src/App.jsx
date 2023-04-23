import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";
import Index from "./Pages/Index";
import Room from "./Pages/Room";
import Account from "./Pages/Account";
import Avatar from "./Pages/Avatar";
import Sandbox from "./Pages/Sandbox";
import Singlespeaker from "./Components/Singlespeaker";
import Multispeaker from "./Components/Multispeaker";
function App() {
  return (
    <>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
        <Route path="/join" element={<Index/>}></Route>
        <Route path="/u/:username" element={<ProtectedRoute><Account/></ProtectedRoute>}></Route>
        <Route path="/avatar/:roomID" element={<Avatar/>}></Route>
        <Route path="/:roomID" element={<Room/>}></Route>
        <Route path="/sandbox" element={<Sandbox/>}></Route>
        <Route path="/compsandbox" element={<Singlespeaker/>}></Route>
      </Routes>
    </AuthContextProvider>
    </>
  );
}

export default App;
