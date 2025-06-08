import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FaLightbulb,
  FaEnvelope,
  FaClipboardList,
  FaEnvelopeOpen,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Modal, Button } from "react-bootstrap";
import { ThemeContext } from "../Context/ThemeContext";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("request");
  const [user, setUser] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const mode = darkMode;

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    type: "",
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/notifications/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sorted = res.data.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [user]);

  const getIcon = (type) => {
    switch (type) {
      case "request":
        return <FaClipboardList className="text-primary me-2" />;
      case "ideas":
        return <FaLightbulb className="text-warning me-2" />;
      case "message":
        return <FaEnvelope className="text-success me-2" />;
      default:
        return null;
    }
  };

  const openModal = async (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);

    if (!notification.AdminisRead && user) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URI}/api/${
            user._id
          }/notifications/mark-read/${notification._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleApprove = () => {
    if (selectedNotification) {
      setNewProduct({
        name: selectedNotification.productName || "",
        type: "",
        category: "",
        description: "",
        price: "",
        image: "",
      });
    }

    setShowModal(false);

    // Open the add product modal after modal closes
    setTimeout(() => {
      const modalBtn = document.getElementById("openAddProductModalBtn");
      modalBtn?.click();
    }, 300);
  };

  const handleRejectClick = () => {
    setShowRejectConfirm(true);
  };

  const handleConfirmReject = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/user/${
          user._id
        }/notifications/reject/${selectedNotification._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === selectedNotification._id
            ? { ...n, requestStatus: "rejected", isRead: true }
            : n
        )
      );
      setShowRejectConfirm(false);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to reject request:", err);
      setShowRejectConfirm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedNotification || !user) {
      console.error("Missing notification or user info");
      return;
    }

    try {
      const payload = {
        ...newProduct,
        notificationId: selectedNotification._id,
      };
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/${user._id}/products/${
          selectedNotification._id
        }`,

        newProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewProduct({
        name: "",
        category: "",
        type: "",
        price: "",
        description: "",
        image: "",
      });

      // Hide AddProduct modal
      const modalEl = document.getElementById("addProductModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();

      // Update notification message locally
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === selectedNotification._id
            ? {
                ...n,
                message:
                  "Your product request is approved and added to products.",
                requestStatus: "approved",
                productAdded: true,
                isRead: true,
              }
            : n
        )
      );

      // Close notification modal (in case it is open)
      setShowModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="container mt-5 vh-100">
      {/* Filter Buttons */}
      <div className="btn-group mb-4" role="group">
        <button
          className={`btn btn-outline-primary ${
            filter === "request" ? "active" : ""
          }`}
          onClick={() => setFilter("request")}
        >
          <FaClipboardList /> Request
        </button>
        <button
          className={`btn btn-outline-warning ${
            filter === "ideas" ? "active" : ""
          }`}
          onClick={() => setFilter("ideas")}
        >
          <FaLightbulb /> Ideas
        </button>
        <button
          className={`btn btn-outline-success ${
            filter === "message" ? "active" : ""
          }`}
          onClick={() => setFilter("message")}
        >
          <FaEnvelope /> Message
        </button>
      </div>

      {/* Auto delete info */}
      <div className="d-flex align-items-center mb-3 animate-jump">
        <i className="bi bi-info-circle-fill me-2 text-primary "></i>
        <h6 className="mb-0">
          Notifications here will auto delete after 30 Days
        </h6>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="alert alert-info">No notifications found.</div>
      ) : (
        filtered.map((n) => (
          <div
            className={`card mb-3 shadow-sm`}
            key={n._id}
            onClick={() => openModal(n)}
            style={{
              cursor: "pointer",
              backgroundColor: n.AdminisRead ? "#D3D3D3" : "white",
            }}
          >
            <div className="card-body d-flex align-items-start">
              {getIcon(n.type)}
              <div className="flex-grow-1">
                {n.type === "request" ? (
                  <p className="card-text mb-1">{`request to add ${n.productName}`}</p>
                ) : (
                  <p className="card-text mb-1">{`${n.message}`}</p>
                )}

                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleDateString("en-GB")}
                </small>
              </div>
              <div className="ms-2">
                {n.AdminisRead ? (
                  <FaEnvelopeOpen className="text-secondary" title="Read" />
                ) : (
                  <FaEnvelope className="text-danger" title="Unread" />
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal: Notification Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          className={darkMode ? "bg-dark text-light" : "bg-white text-dark"}
        >
          <>
            <Modal.Title>Notification Details</Modal.Title>
            <button
              type="button"
              className={`btn-close ${
                darkMode ? "btn-close-white" : "btn-close-dark"
              }`}
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeModal"
              onClick={() => setShowModal(false)}
            ></button>
          </>
        </Modal.Header>
        <Modal.Body
          className={darkMode ? "bg-dark text-light" : "bg-white text-dark"}
        >
          {selectedNotification && (
            <>
              <p>
                <strong>Type:</strong> {selectedNotification.type}
              </p>
              <p>
                <strong>Message:</strong> {selectedNotification.message}
              </p>
              {selectedNotification.type === "request" && (
                <>
                  <p>
                    <strong>Product Name:</strong>{" "}
                    {selectedNotification.productName || "N/A"}
                  </p>
                  <p>
                    <strong>Product Type:</strong>{" "}
                    {selectedNotification.productType || "N/A"}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {selectedNotification.productCategory || "N/A"}
                  </p>
                  <p>
                    <strong>Added to Product List:</strong>{" "}
                    {selectedNotification.productAdded ? "Yes" : "No"}
                  </p>
                </>
              )}
              <p>
                <strong>Status:</strong>{" "}
                {selectedNotification.requestStatus || "N/A"}
              </p>
              <p>
                <strong>Posted At:</strong>{" "}
                {new Date(selectedNotification.createdAt).toLocaleDateString(
                  "en-GB"
                )}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          className={darkMode ? "bg-dark text-light" : "bg-white text-dark"}
        >
          {selectedNotification?.type === "request" && (
            <>
              <Button
                variant="danger"
                onClick={handleRejectClick}
                disabled={
                  selectedNotification.requestStatus === "rejected" ||
                  selectedNotification.requestStatus === "approved"
                }
              >
                Reject
              </Button>
              <Button
                variant="primary"
                onClick={handleApprove}
                disabled={
                  selectedNotification.requestStatus === "rejected" ||
                  selectedNotification.requestStatus === "approved"
                }
              >
                Approve
              </Button>
            </>
          )}
          {selectedNotification?.type === "message" && (
            <Button
              variant="danger"
              onClick={handleRejectClick}
              disabled={
                selectedNotification.requestStatus === "rejected" ||
                selectedNotification.requestStatus === "approved"
              }
            >
              Reject
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Confirm Modal */}
      <Modal
        show={showRejectConfirm}
        onHide={() => setShowRejectConfirm(false)}
        centered
      >
        <Modal.Header
          className={darkMode ? "bg-dark text-light" : "bg-white text-dark"}
          closeButton
        >
          <Modal.Title>Confirm Reject</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={darkMode ? "bg-dark text-light" : "bg-white text-dark"}
        >
          Are you sure you want to reject this request?
        </Modal.Body>
        <Modal.Footer
          className={darkMode ? "bg-dark text-light" : "bg-white text-dark"}
        >
          <Button
            variant="secondary"
            onClick={() => setShowRejectConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmReject}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hidden button triggers AddProduct Modal */}
      <button
        id="openAddProductModalBtn"
        type="button"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
      ></button>

      {/* Add Product Modal */}
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-labelledby="addProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className={`modal-content ${
              darkMode ? "bg-dark text-light" : "bg-white text-dark"
            }`}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">
                Add Product
              </h5>
              <button
                type="button"
                className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Input Fields */}
                {[
                  { label: "Product Name", name: "name", type: "text" },
                  {
                    label: "Category",
                    name: "category",
                    type: "select",
                    options: ["consumable", "fertilizer", "pesticide"],
                  },
                  {
                    label: "Type",
                    name: "type",
                    type: "select",
                    options: [
                      "vegetable",
                      "Fruit",
                      "Coconut",
                      "chemical",
                      "organic",
                    ],
                  },
                  { label: "Price", name: "price", type: "number" },
                  {
                    label: "Description",
                    name: "description",
                    type: "textarea",
                  },
                  { label: "Image URL", name: "image", type: "text" },
                ].map(({ label, name, type, options }) => (
                  <div className="mb-3" key={name}>
                    <label htmlFor={name} className="form-label">
                      {label}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        id={name}
                        name={name}
                        className="form-control"
                        rows="3"
                        value={newProduct[name]}
                        onChange={handleInputChange}
                      />
                    ) : type === "select" ? (
                      <select
                        id={name}
                        name={name}
                        className="form-select"
                        value={newProduct[name]}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select {label}</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={name}
                        name={name}
                        type={type}
                        className="form-control"
                        value={newProduct[name]}
                        onChange={handleInputChange}
                        required={name !== "image" && name !== "description"}
                        min={name === "price" ? "0" : undefined}
                        step={name === "price" ? "0.01" : undefined}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
