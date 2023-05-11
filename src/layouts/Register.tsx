import  {  useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
// import axios from '../api/axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Alert, AlertTitle, Checkbox, Divider, FormControl, FormControlLabel, Modal } from '@mui/material';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { endpointsURL } from '../api/endpoints';
import { FcGoogle } from 'react-icons/fc';
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
const theme = createTheme();

export default function SignUp() {
  const {
    user: data,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  // const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [name, setname] = useState(data?.nickname);
  const [nickname, setnickname] = useState(data?.name);
  const [email, setEmail] = useState(data?.email);
  const [emailSender, setEmailSender] = useState(email);
  const [emailOpen, setEmailOpen] = useState(false);

  const [companyNames, setCompanyNames] = useState([]); /// TODO: change it to useState([])
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState<
    "customer" | "supplier" | null
  >(null);
  const [isNewCompany, setisNewCompany] = useState(false);
  const [address, setAddress] = useState("");
  const [ProjectSize, setProjectSize] = useState("");
  const [Expertise, setExpertise] = useState("");
  const [employeesNumber, setEmployeesNumber] = useState("");
  const [open, setOpen] = useState(false);
  const [checkEmailOpen, setCheckEmailOpen] = useState("");
  const [errorRegister, setErrorRegister] = useState(false);

  useEffect(() => {
    const supliersNames = axios
      .get(endpointsURL.customerCompanyNames)
      .then((response) => response.data);
    const customersNames = axios
      .get(endpointsURL.supplierCompanyNames)
      .then((response) => response.data);
    Promise.all([supliersNames, customersNames]).then((values) =>
      setCompanyNames([...values[0].concat(values[1])])
    );
  }, [endpointsURL]);
  console.log({ companyNames });
  console.log("rendering");

  const logoutHandler = () => {
    localStorage.setItem("typeAuth", "na");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("submitted");
    // console.log("eeee",{company_id: companyName , company_type: companyName})
    // console.log("eeee",{...companyNames.filter(e=> companyName==e.company_name )[0] }.id)

    // company_id: {...companyNames.filter(e=> companyName==e.company_name )[0] }.id , company_type: {...companyNames.filter(e=> companyName==e.company_name )[0] }.company_type

    await axios
      .post(
        endpointsURL.register,
        JSON.stringify(
          companyType == "supplier"
            ? {
              id_user:data?.sub,
                username: user,
                email: email,
                first_name: name,
                last_name: nickname,
                is_active: false,
                company_name: companyName,
                adress: address,
                employees_number: employeesNumber,
                company_type: companyType,
                project_size: ProjectSize,
                expertise: Expertise,
                company_owner: user,
              }
            : {
              id_user:data?.sub,

                username: user,
                email: email,
                first_name: name,
                last_name: nickname,
                is_active: false,
                company_name: companyName,
                adress: address,
                employees_number: employeesNumber,
                company_type: companyType,
                company_owner: user,
              }
        ),
        {
          headers: { "Content-Type": "application/json", id_user: data?.sub },
        }
      )
      .then(async (response) => {
        // TODO: remove console.logs before deployment
        console.log(JSON.stringify(response?.data));
        setErrorRegister(false);
        setOpen(true);
        setUser("");

        setname("");
        setnickname("");
        setEmployeesNumber("0");
        setAddress("");
        setCompanyType(null);
        setCompanyName("");
      })
      .catch(async (err) => {
        setOpen(true);
        setErrorRegister(true);
        setTimeout(() => setErrorRegister(false), 10000);
        if (!err) {
          console.log("No Server Response");
        } else if (err.response?.status === 409) {
          console.log("Username Taken");
        } else {
          console.log("Registration Failed");
        }
      });

    if (!isNewCompany) {
      await axios
        .post(
          "http://127.0.0.1:8000/employees/customer/register/",
          JSON.stringify({
            company_name: companyName,
            company_id: companyNames.map((e: any) => {
              if (companyName == e.company_name) {
                return e.id;
              }
            })[0],
            company_type: companyNames.map((e) => {
              if (companyName == e.company_name) {
                return e.company_type;
              }
            })[0],
          }),
          {
            headers: { "Content-Type": "application/json", id_user: data?.sub },
          }
        )
        .then((response) => {
          // TODO: remove console.logs before deployment
          console.log(JSON.stringify(response?.data));

          setUser("");
          setname("");
          setnickname("");
          setEmail("");
        })
        .catch((err) => {
          if (!err) {
            console.log("No Server Response");
          } else if (err.response?.status === 409) {
            console.log("Username Taken");
          } else {
            console.log("Registration Failed");
          }
        });
    }
  };

  const sendEmail = async () => {
    console.log(email);
    await axios
      .post(
        "http://127.0.0.1:8000/users/reactivate/",
        JSON.stringify({ email: email }),
        {
          headers: { "Content-Type": "application/json", id_user: data?.sub },
        }
      )
      .then((response: any) => {
        // TODO: remove console.logs before deployment
        setCheckEmailOpen("true");
        setTimeout(() => setCheckEmailOpen(""), 3000);
        setUser("");

        setname("");
        setnickname("");
      })
      .catch((err: any) => {
        setCheckEmailOpen("false");
        setTimeout(() => setCheckEmailOpen(""), 10000);
        if (!err) {
          console.log("No Server Response");
        } else if (err.response?.status === 409) {
          console.log("Username Taken");
        } else {
          console.log("Registration Failed");
        }
      });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {errorRegister ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Registration failed — <strong>Try again!</strong>
          </Alert>
        ) : (
          ""
        )}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* <FormControlLabel control={<Checkbox 
            checked={ isNewCompany  } 
            onChange={()=>{setisNewCompany(prev => !prev);setOpen(prev => !prev)}} />
            }label="create new company" /> */}
            {/* {
            !isNewCompany ?  */}

            {/*<FormControl fullWidth>
               <InputLabel id="demo-simple-select-label">companyName</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={companyName}
                label="companyName"
                onChange={(e) => {
                  setCompanyName(e.target.value)
                  console.log(e.target.value)
                }}
              >
                {companyNames.map(name => <MenuItem value={name.company_name}>{name.company_name}</MenuItem>)}
              </Select>
            </FormControl> : 
              ""
            } */}
            <TextField
              value={companyName}
              margin="normal"
              required
              fullWidth
              id="companyName"
              label="companyName"
              name="companyName"
              autoComplete="companyName"
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <TextField
              value={address}
              margin="normal"
              required
              fullWidth
              id="address"
              label="address"
              name="address"
              autoComplete="address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              value={employeesNumber}
              margin="normal"
              required
              fullWidth
              id="employeesNumber"
              label="Employees Number"
              name="employeesNumber"
              autoComplete="Employees Number"
              onChange={(e) => setEmployeesNumber(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">companyType</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={companyType}
                label="companyType"
                onChange={(e) =>
                  setCompanyType(
                    e.target.value as "customer" | "supplier" | null
                  )
                }
              >
                <MenuItem value={"customer"}>customer</MenuItem>
                <MenuItem value={"supplier"}>supplier</MenuItem>
              </Select>
            </FormControl>
            {companyType === "supplier" ? (
              <>
                <TextField
                  value={ProjectSize}
                  margin="normal"
                  required
                  fullWidth
                  id="ProjectSize"
                  label="Project size"
                  name="ProjectSize"
                  autoComplete="ProjectSize"
                  onChange={(e) => setProjectSize(e.target.value)}
                />
                <TextField
                  value={Expertise}
                  margin="normal"
                  required
                  fullWidth
                  id="Expertise"
                  label="Expertise"
                  name="Expertise"
                  autoComplete="Expertise"
                  onChange={(e) => setExpertise(e.target.value)}
                />
              </>
            ) : null}
            {/* <TextField
              value={user}
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUser(e.target.value)}
            /> */}
            <TextField
              value={name}
              margin="normal"
              required
              fullWidth
              id="name"
              label="name"
              name="name"
              autoComplete="name"
              disabled={true}
            />
            <TextField
              value={nickname}
              margin="normal"
              required
              fullWidth
              id="nickname"
              label="nickname"
              name="nickname"
              autoComplete="nickname"
              disabled={true}
            />
            <TextField
              value={email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              disabled={true}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Button
              sx={{ mb: 2 }}
              fullWidth
              onClick={() => logoutHandler()}
              variant="contained"
            >
              Logout
            </Button>
            <Grid container>
              <Grid item xs>
                {<Link to="/login">Already Have an account Sign In ?</Link>}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              sx={{ marginBottom: 3, textAlign: "center", fontWeight: "bold" }}
              id="transition-modal-title"
              variant="h6"
              component="h2"
            >
              Company created successfully !!
            </Typography>
            <Divider />
            <Typography
              sx={{
                marginBottom: 3,
                textAlign: "center",
                fontWeight: "normal",
                display: "flex",
                justifyContent: "center",
                paddingTop: 3,
              }}
              id="transition-modal-title"
              variant="h6"
              component="h2"
            >
              Check your email please !!{" "}
              <FcGoogle
                onClick={() => {
                  window.open("https://mail.google.com/", "_blank");
                }}
                style={{ cursor: "pointer" }}
                size={30}
              />
            </Typography>
            <Divider />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => sendEmail()}
            >
              Send Email
            </Button>

            {checkEmailOpen == "true" ? (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Email was resend seccessfully — <strong>check it out!</strong>
              </Alert>
            ) : (
              <>
                {checkEmailOpen == "false" ? (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Email resend failed — <strong>check it out!</strong>
                  </Alert>
                ) : (
                  ""
                )}
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}