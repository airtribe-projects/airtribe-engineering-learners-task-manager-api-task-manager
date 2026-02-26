import { useContext, useState } from "react";
import { StudentContext } from "./StudentContext";

function StudentForm() {
  const { addStudent } = useContext(StudentContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addStudent(form);
    setForm({ name: "", email: "", course: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow">
      <div className="row">
        <div className="col">
          <input
            className="form-control"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Course"
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />
        </div>
        <div className="col">
          <button className="btn btn-primary w-100">
            Add Student
          </button>
        </div>
      </div>
    </form>
  );
}

export default StudentForm;