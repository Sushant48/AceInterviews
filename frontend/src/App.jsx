import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
    <ToastContainer position="bottom-right" />
      <AppRoutes />
    </>
  );
}

export default App;
  