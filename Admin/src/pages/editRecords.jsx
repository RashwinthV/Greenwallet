import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import "../styles/editrecords.css";

const EditRecords = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [records, setRecords] = useState([]);
  const [products, setProducts] = useState([]); 
  const [editRecord, setEditRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Show 10 records per page

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/api/getproducts`)
      .then((res) => {
        const groupedProducts = res.data;
        const productArray = Object.entries(groupedProducts).flatMap(
          ([category, items]) =>
            items.map((product) => ({ ...product, category }))
        );
        setProducts(productArray);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URI}/api/records/${selectedUser}?page=${page}&limit=${limit}`
        )
        .then((res) => {
          setRecords(res.data.records || []);
          setTotalPages(res.data.totalPages || 1);
        })
        .catch((err) => {
          console.error("Error fetching records:", err);
          toast.error("Failed to load records. ❌");
        });
    }
  }, [selectedUser, page]);
  

  const confirmDelete = (recordId) => {
    setRecordToDelete(recordId);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!recordToDelete) return;

    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/deleterecord/${selectedUser}/${recordToDelete}`
      )
      .then(() => {
        setRecords(records.filter((record) => record._id !== recordToDelete));
        setShowDeleteModal(false);
        setRecordToDelete(null);
        toast.success("Record deleted successfully! 🗑️");
      })
      .catch((err) => {
        console.error("Error deleting record:", err);
        toast.error("Failed to delete record. ❌");
      });
  };

  const handleEdit = (record) => {
    setEditRecord({
      ...record,
      date: new Date(record.date).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleSave = () => {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URI}/api/updaterecord/${selectedUser}/${editRecord._id}`,
        editRecord
      )
      .then((res) => {
        setRecords(res.data.records);
        setShowModal(false);
        toast.success("Record updated successfully! ✏️");
      })
      .catch((err) => {
        console.error("Error updating record:", err);
        toast.error("Failed to update record. ❌");
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Records</h2>

      <div className="mb-3">
        <label className="form-label">Select User</label>
        <Form.Select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setPage(1);
          }}
        >
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="min-width-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Product</th>
              <th>Rate</th>
              <th>Kgs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="scrollable-table-body">
            {records.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>₹{record.amount}</td>
                <td>{record.type}</td>
                <td>{record.productId?.name ||record.Expense|| "N/A"}</td>
                <td>{record.rate}</td>
                <td>{record.kgs}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(record)}
                    size="sm"
                  >
                    ✏ Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => confirmDelete(record._id)}
                    size="sm"
                  >
                    🗑 Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* ✅ Pagination Controls */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        />
      </Pagination>

        {/* ✅ Edit Modal */}
        {editRecord && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* ✅ Edit Date */}
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editRecord.date}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, date: e.target.value })
                  }
                />
              </Form.Group>

              {/* ✅ Edit Amount */}
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={editRecord.amount}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, amount: e.target.value })
                  }
                />
              </Form.Group>

              {/* ✅ Edit Type */}
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={editRecord.type}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, type: e.target.value })
                  }
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>

              {/* ✅ Edit Product */}
              <Form.Group className="mb-3">
                <Form.Label>Product</Form.Label>
                <Form.Select
                  value={editRecord.productId}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, productId: e.target.value })
                  }
                >
                  <option value="">-- Select a Product --</option>
                  {products.length > 0 &&
                    products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.category})
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              {/* ✅ Edit Rate */}
              <Form.Group className="mb-3">
                <Form.Label>Rate</Form.Label>
                <Form.Control
                  type="number"
                  value={editRecord.rate}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, rate: e.target.value })
                  }
                />
              </Form.Group>

              {/* ✅ Edit Kgs */}
              <Form.Group className="mb-3">
                <Form.Label>Kgs</Form.Label>
                <Form.Control
                  type="number"
                  value={editRecord.kgs}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, kgs: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
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
};

export default EditRecords;
