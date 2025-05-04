import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import translations from "../translation";

function EditRecords() {
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setproduct] = useState([]);
  const t = translations[localStorage.getItem("language")]; 
  const recordsPerPage = 8;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

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
        if (res.data) {
          setRecords(res.data.records || []);
          setproduct(res.data.products || []);
        }
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
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/user/edit-record/${userId}/${editingIndex}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.records) {
        setRecords(res.data.records);
      }

      setEditingIndex(null);
      setFormData({});
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
        `${
          import.meta.env.VITE_BACKEND_URI
        }/user/delete-record/${userId}/${recordToDelete}`,
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // returns 'yyyy-MM-dd'
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <div className="container mt-4 vh-100">
      <h2 className="mb-4 text-center">{t.EditRecords}</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>{t.date}</th>
              <th>{t.type}</th>
              <th>{t.product}</th>
              <th>{t.income}</th>
              <th>{t.expense}</th>
              <th>{t.rate}</th>
              <th>{t.kgsOrQty}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  {t.noRecordsFound}
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
                            value={formatForInput(formData.date)}
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
                            <option value="expense">{t.expense}</option>
                            <option value="income">{t.income}</option>
                          </select>
                        </td>

                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              className="w-100"
                            >
                              {formData.productName
                                ? products.find(
                                    (p) => p._id === formData.productName
                                  )?.name
                                : t.selectProduct}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                              style={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                width: "110%",
                              }}
                            >
                              {products.map((product) => (
                                <Dropdown.Item
                                  key={product._id}
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      productId: product._id,
                                    }))
                                  }
                                >
                                  <img
                                    src={product.image}
                                    style={{
                                      borderRadius: "5px",
                                      width: "20px",
                                      height: "20px",
                                    }}
                                  ></img>
                                  {"   "}
                                  {product.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
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
                              {t.save}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancel}
                            >
                              {t.cancel}
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.type}</td>
                        <td>{record.productName}</td>
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
            {t.prev}
          </button>
          <span>
            {t.page} <strong>{currentPage}</strong> {t.of} <strong>{totalPages}</strong>
          </span>
          <button
            className="btn btn-outline-secondary mx-2"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {t.next}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t.confirmDeletion}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t.deleteRecord}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t.cancel}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t.yesDelete}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditRecords;
