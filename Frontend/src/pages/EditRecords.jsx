import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // ✅ Bootstrap Modal
import "bootstrap/dist/css/bootstrap.min.css";

function EditRecords() {
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ Modal state
  const [recordToDelete, setRecordToDelete] = useState(null); // ✅ To track which record to delete

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || "";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/user/records/${userId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data) setRecords(res.data.records || []);
      })
      .catch((err) => console.error("Error fetching records", err));
  }, [userId]);

  const handleEdit = (record) => {
    setEditingIndex(record._id);
    setFormData(record);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/user/edit-record/${userId}/${editingIndex}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updated = records.map((rec) =>
        rec._id === editingIndex ? formData : rec
      );

      setRecords(updated);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error saving record", err);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({});
  };

  const confirmDelete = (recordId) => {
    setRecordToDelete(recordId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/user/delete-record/${userId}/${recordToDelete}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.records) {
        setRecords(response.data.records);
      }

      setShowDeleteModal(false);
      setRecordToDelete(null);
    } catch (err) {
      console.error("Error deleting record", err);
    }
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <div className="container mt-4 vh-100">
      <h2 className="mb-4 text-center">Edit Records</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Income</th>
              <th>Expense</th>
              <th>Rate</th>
              <th>Kgs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No records found.
                </td>
              </tr>
            ) : (
              currentRecords.map((record, index) => {
                const globalIndex = index + indexOfFirstRecord;
                const isIncome = record.type === "income";

                return (
                  <tr key={globalIndex}>
                    {editingIndex === record._id ? (
                      <>
                        <td>
                          <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={formData.date?.substring(0, 10)}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <select
                            name="type"
                            className="form-select w-auto"
                            value={formData.type}
                            onChange={handleChange}
                          >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </td>
                        {formData.type === "income" ? (
                          <>
                            <td>
                              <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={formData.amount}
                                onChange={handleChange}
                              />
                            </td>
                            <td></td>
                          </>
                        ) : (
                          <>
                            <td></td>
                            <td>
                              <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={formData.amount}
                                onChange={handleChange}
                              />
                            </td>
                          </>
                        )}
                        <td>
                          <input
                            type="number"
                            name="rate"
                            className="form-control"
                            value={formData.rate}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="kgs"
                            className="form-control"
                            value={formData.kgs}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={handleSave}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.type}</td>
                        <td className={isIncome ? "text-success fw-bold" : ""}>
                          {isIncome ? record.amount : ""}
                        </td>
                        <td className={!isIncome ? "text-danger fw-bold" : ""}>
                          {!isIncome ? record.amount : ""}
                        </td>
                        <td>{record.rate}</td>
                        <td>{record.kgs}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-primary"
                              onClick={() => handleEdit(record)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => confirmDelete(record._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {records.length > recordsPerPage && (
        <div className="d-flex justify-content-center align-items-center mt-3 p-2">
          <button
            className="btn btn-outline-secondary mx-2"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="btn btn-outline-secondary mx-2"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this record?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditRecords;
