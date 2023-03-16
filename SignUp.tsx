import React, { useState } from "react";
import { Button, FormField, TextInput, Pane, Heading, Select } from 'evergreen-ui'
import {signUpPost} from "../utils/datafetcher"
import { Auth } from "../Auth";

import Recaptcha from 'react-recaptcha';

export default function Signup(this: any) {

  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("Client");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupError, setSignupError] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [recaptchaVerify,setRecaptchaVerify] = useState(false);
  const [captchaResponse,setCaptchaResponse] = useState("");

  function verifyCallback(response){
    setCaptchaResponse(response);
    if (response){
      setRecaptchaVerify(true);
    }
  }
  
  function validateForm() {
    return email.length > 0 && password.length > 8 && firstName.length > 0 &&
    lastName.length > 0 && userRole.length > 0 && recaptchaVerify;
  }

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    signUpPost(email, password, firstName, lastName, userRole, captchaResponse)
    .then(res => { 
        if (res.status === 200) {
          localStorage.setItem("jwt", res.data.jwt);

          window.location.href = `/${userRole}`;
          return
        }
        setSignupError(true);
    })
    .catch(err => { 
        setSignupError(true);
        console.error(err);
    });
  }

  if(Auth.isAuthenticated()) {
    window.location.href = "/"
  }

  return (
    <Pane 
    display="flex"
    alignItems="center"
    justifyContent="center"
    paddingTop={300}
    >
        <Pane
        elevation={4}
        padding={20}
        paddingTop={50}
        paddingBottom={50}
        alignItems="center"
        background ="blueTint">
  
            <FormField textAlign='center'>
              <Heading marginTop={15} marginBottom={15} size={700}>Sign Up</Heading>
                <Pane style={{padding: '20px'}}>
                <TextInput
                    name="First Name"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setFirstName(e.target.value)}
                  />
                  </Pane>
                  <TextInput
                    name="Last Name"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLastName(e.target.value)}
                  />
                  <Pane style={{padding: '20px'}}>
                  <TextInput
                    name="Email"
                    placeholder="Email"
                    value={email}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                  />
                  </Pane>
                    <TextInput
                    required
                    name="Password"
                    placeholder="Password"
                    value={password}
                    type="password"
                    onChange={(e: { target: { value: React.SetStateAction<string>; } }) => {
                        setPassword(e.target.value)
                        setPasswordTouched(true)
                    }}
                    />
                    {passwordTouched && password.length < 8 &&  <FormField label='' validationMessage='Password should be more than 8 characters.' />}
                    {signupError &&  <FormField label='' validationMessage='Email already taken.' />}
                <Pane style={{padding: '20px', paddingBottom: '10px'}}>
                    <Select
                      onChange={(e: { target: { value: any; }; }) => setUserRole(e.target.value)}
                      width='100%'
                    >
                      <option value="Client">Client</option>
                      <option value="Employee">Employee</option>
                    </Select>
                  </Pane>

                    <div style = {{margin:"10px"}}>
                    <Recaptcha
                    sitekey="6LcjqWQaAAAAAA_KNpNiiQhQT7rHtpo_AJySY_64"
                    render="explicit"
                    onloadCallback={()=>console.log("im loaded")}
                    verifyCallback={verifyCallback}
                    />
                    </div>

                <Button disabled={!validateForm()} type='submit' appearance="primary" onClick={handleSubmit}>Sign Up</Button>
                <Button type='submit' marginLeft={15} onClick={ () => {window.location.href = "/login"}}>Go to Login</Button>
                <Pane marginBottom={15}></Pane>
            </FormField>
        </Pane>
      </Pane>
  );
}
