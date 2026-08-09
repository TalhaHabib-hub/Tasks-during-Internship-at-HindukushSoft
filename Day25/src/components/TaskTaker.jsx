import React from "react";
import "./TaskTaker.css";
import "bootstrap/dist/css/bootstrap.min.css";
function TaskTaker({ input, setinput, handleTextChange, handleAddTask }) {
  return (
    <div className="TaskDown">
      <input 
      type="text" 
      name="taskTaken" 
      id="task" 
      value={input.taskTaken} 
      onChange={handleTextChange} />

      <input 
      type="time" 
      name="timeTaken" 
      id="time"  
      value={input.timeTaken} 
      onChange={handleTextChange} />

      <button  
      type="button" 
      className="btn btn-success" 
      onClick={handleAddTask}>
        +add
      </button>

    </div>
  );
}

export default TaskTaker;
