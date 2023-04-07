import React, { useState } from "react";
import "./App.css";
import ReceiptTable from "./ReceiptTable";
import Header from "./Header";

function App() {
  const [showData, setShowData] = useState(false);

  const handleClick = () => {
    setShowData(true);
  };
  return (
    <div className="App">
      <Header />
      <button
        onClick={handleClick}
        className={`button ${showData ? "hide" : ""}`}
      >
        Get Reciept
      </button>
      {showData ? <ReceiptTable /> : ""}
    </div>
  );
}

export default App;
