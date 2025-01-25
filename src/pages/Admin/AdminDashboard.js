// src/pages/AdminDashboard.js

import OptionSet from "../../components/Customizer/OptionSet";
import OptionPreview from "../../components/Customizer/OptionSetPreview";
import React, { useState } from "react";

const AdminDashboard = () => {
  const [options, setOptions] = useState([]);

  const handleAddOption = (newOption) => {
    setOptions([...options, newOption]);
  };

  return (
    <div className="admin-dashboard">
      <h2>Product Options Admin</h2>
      <OptionSet onAddOption={handleAddOption} />
      <OptionPreview options={options} />
    </div>
  );
};

export default AdminDashboard;
