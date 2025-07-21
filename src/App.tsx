import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage"; // 有需要再写

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        {/* 其他页面... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
