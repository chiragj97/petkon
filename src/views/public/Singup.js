import React, { useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";

import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Custome_Input from "components/MyCustomeInput/MyCustomeInput";
import Button from "components/CustomButtons/Button.js";
import { Link as RouterLink } from "react-router-dom";
import { createStores } from "ApiService";
import LinearProgress from "@material-ui/core/LinearProgress";
import Danger from "components/Typography/Danger";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const methods = useForm();
  const classes = useStyles();
  const history = useHistory();
  const [isloading, setisloading] = useState(false);
  const { handleSubmit, watch } = methods;

  const onSubmit = (data) => {
    setisloading(true);
    createStores(data)
      .then(({ data }) => {
        toast.success(data.success);
        history.push("/app/login");
        setisloading(false);
      })
      .catch((error) => {
        setisloading(false);
        toast.error(error.response.data);
      });
  };
  const { password, repeatPassword } = watch();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register store
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            {isloading && <LinearProgress />}

            <Custome_Input name="name" label="Store Name" isrequired />
            <Custome_Input name="email" label="Email Address" type="email" isrequired />
            <Custome_Input name="password" label="Password" rules={{ minLength: 8 }} type="password" isrequired />
            <Custome_Input
              name="repeatPassword"
              label="Repeat Password"
              type="password"
              rules={{ minLength: 8 }}
              isrequired
            />
            {password !== repeatPassword && <Danger>Password not match</Danger>}
            <Button type="submit" className={classes.submit} fullWidth color="primary">
              Singup
            </Button>
          </form>
        </FormProvider>
        <Grid container>
          <Grid item />
          <Grid item>
            <Link to="/app/login" component={RouterLink}>
              {"Go to Login"}
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
