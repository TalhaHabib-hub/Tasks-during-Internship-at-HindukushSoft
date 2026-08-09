import React from "react";
import "./Output.css";

export default function Output({ outputs, setOutputs }) {
  return (
    <div>
      {outputs.map((each, idx) => (
        <div className="shower" key={idx}>
           <div className="taskTaken">{each.taskTaken}</div>
          <div className="timeTaken">{each.timeTaken}</div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setOutputs(outputs.filter((_, i) => i !== idx))}
          >
            remove
          </button>
        </div>
      ))}
    </div>
  );
}
