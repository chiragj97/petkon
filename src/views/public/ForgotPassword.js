import React, { useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import { sendForgotPasswordLink } from "ApiService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const loginAction = () => {
    sendForgotPasswordLink({ email })
      .then(({ data }) => {
        toast.success(data);
        history.push("/app/login");
      })
      .catch((error) => toast.error(error.response.data));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ display: "flex", marginTop: "130px", alignItems: "center", flexDirection: "column" }}>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Email Address"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          disabled={!Boolean(email)}
          style={{ marginTop: "20px" }}
          onClick={loginAction}
          fullWidth
          variant="contained"
          color="primary"
        >
          Send mail to Forgot password
        </Button>
      </div>
    </Container>
  );
}
