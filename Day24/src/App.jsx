import { useState } from "react";
import BoxInput from "./components/Box";
import OutputBox from "./components/OutputBox";
import "./App.css";

function App() {
  const [form, setform] = useState({
    Name: "",
    email: "",
    message: "",
  });

  return (
    <div className="holder">
      <BoxInput form={form} setform = {setform}/>
      <OutputBox  form={form} setform = {setform}/>
    </div>
  );
}

export default App;
