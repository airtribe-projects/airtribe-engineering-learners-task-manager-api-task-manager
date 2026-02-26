import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StudentContext = createContext();

const API = "http://localhost:5000/students";

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    const res = await axios.get(API);
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async (data) => {
    await axios.post(API, data);
    fetchStudents();
  };

  const updateStudent = async (id, data) => {
    await axios.put(`${API}/${id}`, data);
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchStudents();
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        search,
        setSearch,
        addStudent,
        updateStudent,
        deleteStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};