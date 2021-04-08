import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Danger from "components/Typography/Danger";
import LinearProgress from "@material-ui/core/LinearProgress";

import { verifyPassword } from "ApiService";

export default function VerifyPassword() {
  const [loginForm, setloginForm] = useState({ password: "", confimPassword: "" });
  const [storeId, setstoreId] = useState("");
  const [isloading, setisloading] = useState(false);

  const history = useHistory();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token");

  useEffect(() => {
    try {
      const decoded = jwt_decode(token);
      if (decoded.id) {
        setstoreId(decoded.id);
      } else {
        history.push("/app/login");
      }
    } catch (error) {
      history.push("/app/login");
    }
  }, [token]);

  const loginAction = () => {
    if (!storeId) history.push("/app/login");
    setisloading(true);
    verifyPassword({ password: loginForm.password, storeId: storeId })
      .then(({ data }) => {
        setisloading(false);
        toast.success(data);
        history.push("/app/login");
      })
      .catch((error) => toast.error(error.response.data));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div style={{ display: "flex", marginTop: "130px", flexDirection: "column" }}>
        {isloading && <LinearProgress />}
        <Typography component="h1" style={{ textAlign: "center", marginTop: "10px" }} variant="h5">
          Reset Password
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          label="New password"
          onChange={(e) => setloginForm({ password: e.target.value, confimPassword: loginForm.confimPassword })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          label="Confim New Password"
          onChange={(e) => setloginForm({ confimPassword: e.target.value, password: loginForm.password })}
        />
        {loginForm.password !== loginForm.confimPassword && <Danger>Password not match</Danger>}
        <Button
          disabled={!Boolean(loginForm.password === loginForm.confimPassword) || !loginForm.password}
          style={{ marginTop: "20px" }}
          onClick={loginAction}
          fullWidth
          variant="contained"
          color="primary"
        >
          Forgot password
        </Button>
      </div>
    </Container>
  );
}
