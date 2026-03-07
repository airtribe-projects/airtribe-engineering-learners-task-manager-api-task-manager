import { StudentProvider } from "./components/StudentContext";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

function App() {
  return (
    <StudentProvider>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Student Management</h2>
        <StudentForm />
        <StudentList />
      </div>
    </StudentProvider>
  );
}

export default App;