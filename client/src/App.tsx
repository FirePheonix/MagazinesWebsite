import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { Toaster } from "react-hot-toast";
import BackgroundImage from "@/assets/backdrop.png";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Toaster position="top-right" /> 
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
