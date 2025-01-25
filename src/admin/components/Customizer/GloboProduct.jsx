import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DashboardScreen from "./components/DashboardScreen";
import NewOptionSetScreen from "./components/NewOptionSetScreen";

const GloboProduct = () => {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [editingOptionSet, setEditingOptionSet] = useState(null);
  
  const handleCreateOptionSet = () => {
    setEditingOptionSet(null);
    setCurrentScreen("newOptionSet");
  };

  const handleSaveOptionSet = (newOptionSet) => {
    // Save option set logic
  };

  return (
    <div className="customizer-container">
      {currentScreen === "dashboard" && (
        <DashboardScreen 
          onCreateOptionSet={handleCreateOptionSet}
        />
      )}
      
      {currentScreen === "newOptionSet" && (
        <NewOptionSetScreen
          editingOptionSet={editingOptionSet}
          onSave={handleSaveOptionSet}
          onBack={() => setCurrentScreen("dashboard")}
        />
      )}
    </div>
  );
};

export default GloboProduct;
