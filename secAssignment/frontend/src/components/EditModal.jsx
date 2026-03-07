import { useContext, useState } from "react";
import { StudentContext } from "./StudentContext";

function EditModal({ data, close }) {
  const { updateStudent } = useContext(StudentContext);

  const [form, setForm] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudent(data.id, form);
    close();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Edit Student</h5>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <input
              className="form-control mb-2"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <input
              className="form-control mb-2"
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value })
              }
            />
            <button className="btn btn-success me-2">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={close}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditModal;