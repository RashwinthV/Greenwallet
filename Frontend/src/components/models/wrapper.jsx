import React from "react";
import '../../styles/filter.css'

const ModalWrapper = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 min-vh-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
      <div className="modal  d-block w-100 px-3" >
        <div id="forget" className="bg-white rounded shadow p-3 mx-auto " >
          <div className="modal-header">
            <h5 className="modal-title">Forgot Password</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
