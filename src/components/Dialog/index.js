import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import CancelIcon from "@material-ui/icons/Cancel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SimpleDialog({ open, setOpen, children, onClose }) {
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="md" onClose={handleClose} fullWidth TransitionComponent={Transition}>
        <div className="d-flex" style={{ justifyContent: "flex-end", padding: "4px 15px" }}>
          <CancelIcon onClick={handleClose} />
        </div>
        <div style={{ padding: "10px" }}>{children}</div>
      </Dialog>
    </div>
  );
}
