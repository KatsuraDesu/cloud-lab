import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error('Lỗi khi lấy danh sách sinh viên:', err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Cập nhật sinh viên
      fetch(`/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then(() => {
          setFormData({ studentId: '', name: '', email: '' });
          setEditingId(null);
          fetchStudents();
        })
        .catch((err) => console.error('Lỗi khi cập nhật sinh viên:', err));
    } else {
      // Thêm sinh viên mới
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then(() => {
          setFormData({ studentId: '', name: '', email: '' });
          fetchStudents();
        })
        .catch((err) => console.error('Lỗi khi thêm sinh viên:', err));
    }
  };

  const handleEdit = (sv) => {
    setFormData({ studentId: sv.studentId, name: sv.name, email: sv.email });
    setEditingId(sv._id);
  };

  const handleCancelEdit = () => {
    setFormData({ studentId: '', name: '', email: '' });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return;
    fetch(`/api/students/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => fetchStudents())
      .catch((err) => console.error('Lỗi khi xóa sinh viên:', err));
  };

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm sinh viên'}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
              <td>
                <button onClick={() => handleEdit(sv)}>Sửa</button>
                <button onClick={() => handleDelete(sv._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Phiên bản 2.0 - Docker Compose Multi-Container</p>
    </div>
  );
}

export default App;