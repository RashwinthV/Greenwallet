import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaLightbulb,
  FaEnvelope,
  FaClipboardList,
  FaEnvelopeOpen,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/notification.css";
import LoadingSpinner from "../../components/Loading/Loadong";
import { Modal, Button } from "react-bootstrap";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("request");
  const [user, setUser] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setloading] = useState(true);

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

        if (!res.data.isadmin) {
          setNotifications(sorted);
        }
        setloading(false);
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

    if (!notification.isRead && user) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URI}/user/${
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

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4 vh-100">
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
      <div className="d-flex align-items-center mb-3 animate-jump">
        <i className="bi bi-info-circle-fill me-2 text-primary "></i>
        <h6 className="mb-0">
          Notifications here will auto delete after 30 Days
        </h6>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-info">No notifications found.</div>
      ) : (
        filtered.map((n) => (
          <div
            className={`card mb-3 shadow-sm `}
            key={n._id}
            onClick={() => openModal(n)}
            style={{
              cursor: "pointer",
              backgroundColor: n.isRead ? "#D3D3D3" : "white",
            }}
          >
            <div className="card-body d-flex align-items-start">
              {getIcon(n.type)}
              <div className="flex-grow-1">
                <p className="card-text mb-1">{n.message}</p>
                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleDateString("en-GB")}
                </small>
              </div>
              <div className="ms-2">
                {n.isRead ? (
                  <FaEnvelopeOpen className="text-secondary" title="Read" />
                ) : (
                  <FaEnvelope className="text-danger" title="Unread" />
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <>
              {selectedNotification.type === "request" && (
                <>
                  <h5 className="mb-3">Request Notification</h5>
                  <p>
                    <strong>Type:</strong> {selectedNotification.type}
                  </p>
                  <p>
                    <strong>Message:</strong> {selectedNotification.message}
                  </p>
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
                  </p>{" "}
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedNotification.requestStatus || "N/A"}
                  </p>{" "}
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(
                      selectedNotification.updatedAt
                    ).toLocaleDateString("en-GB")}
                  </p>
                </>
              )}{" "}
              {selectedNotification.type === "message" && (
                <>
                  <h5 className="mb-3">Message </h5>
                  <p>
                    <strong></strong> {selectedNotification.message}
                  </p>
                </>
              )}
              <p>
                <strong>Posted At:</strong>{" "}
                {new Date(selectedNotification.createdAt).toLocaleDateString(
                  "en-GB"
                )}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Notification;
