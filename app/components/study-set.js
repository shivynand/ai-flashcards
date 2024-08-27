import React from "react";

const StudySet = ({ title, description, onClick }) => {
  return (
    <div
      className="bg-zinc-700 rounded-md p-6 hover:bg-zinc-600 cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default StudySet;
