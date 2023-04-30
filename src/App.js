import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Account from "./components/MessengerPage/Messenger";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Resetpassword from "./components/Auth/Resetpassword";
import { AuthContextProvider } from "./context/AuthContext";

import { Route, Routes, Navigate } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import DBdump from "./components/DBdump/DBdump";

function App() {


  return (
    <div>
      <h1 className="text-center text-3xl font-bold">Messenger</h1>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dbdump" element={<DBdump/>} />

          {/* <Route path="/chat" element={<Chat/>} /> */}
          <Route
            path="/messenger"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="/reset" element={<Resetpassword />}></Route>
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
