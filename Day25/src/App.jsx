import { useState } from "react";
import Navbar from "./components/Navbar";
import TaskTaker from "./components/TaskTaker";
import Output from "./components/Output";
import "./App.css";

function App() {
  const [input, setinput] = useState({taskTaken:"",timeTaken:''});
  const [Outputs, setOutputs] = useState([
   
  ]);
  function handleTextChange(e){
    const{name,value}=e.target;
    setinput({...input,[name]:value})
  }

  function handleAddTask(){
    if(input.taskTaken===''||input.timeTaken==='')return;
    setOutputs([...Outputs,input]);
    setinput({taskTaken:'',timeTaken:''})
  }
  return (
    <>
      <center>
        <Navbar />
        <TaskTaker 
        input={input} 
        setinput={setinput} 
        handleAddTask={handleAddTask} 
        handleTextChange={handleTextChange}>
        </TaskTaker>

        <Output 
        outputs={Outputs} 
        setOutputs={setOutputs}></Output>
      </center>
    </>
  );
}

export default App;
