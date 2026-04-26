import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signin from "../pages/authentication/Signin";
import Signup from "../pages/authentication/Signup";
import ForgetPassword from "../pages/authentication/ForgetPassword";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="*" element={<Navigate replace to="/signup" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
