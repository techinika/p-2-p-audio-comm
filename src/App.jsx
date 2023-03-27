import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Context/ProtectedRoute";
import Index from "./Pages";
import Home from "./Pages/Home";
function App() {
  return (
    <>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Index/>}></Route>
        <Route path="/home" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>}
        ></Route>
      </Routes>
    </AuthContextProvider>
    </>
  );
}

export default App;
