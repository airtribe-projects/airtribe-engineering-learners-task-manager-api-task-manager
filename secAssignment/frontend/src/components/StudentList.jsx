import { useContext, useState } from "react";
import EditModal from "./EditModal";
import Pagination from "./Pagination";
import { StudentContext } from "./StudentContext";

function StudentList() {
  const { students, search, setSearch, deleteStudent } =
    useContext(StudentContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState(null);

  const itemsPerPage = 3;

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(
    indexOfLast - itemsPerPage,
    indexOfLast
  );

  return (
    <>
      <input
        className="form-control mb-3"
        placeholder="Search by name..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditData(student)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />

      {editData && (
        <EditModal
          data={editData}
          close={() => setEditData(null)}
        />
      )}
    </>
  );
}

export default StudentList;