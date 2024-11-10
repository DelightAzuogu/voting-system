import React, { useState } from "react";
import { API_URL } from "../variables/URLs";

const Login = (props) => {
  const [role, setRole] = useState(null);
  // for the login
  const loginHandler = async (e) => {
    try {
      e.preventDefault();

      const id = e.target[0].value;
      const password = e.target[1].value;

      // requesting to login from the database
      const url = `${API_URL}/auth/login/${role}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      // converting the response to usable object
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      localStorage.setItem("token", resData);
      localStorage.setItem("role", role);
      props.setIsAuth(true, role);
    } catch (err) {
      props.setIsAuth(false);
      console.error(err);
    }
  };

  if (!role) {
    function onClickButton(e, r) {
      e.preventDefault();
      setRole(r);
    }

    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ marginTop: "10%" }}
      >
        <form>
          <div className="input-group mb-3">
            <button
              style={{
                width: "200px",
                height: "50px",
              }}
              onClick={(e) => {
                onClickButton(e, "admin");
              }}
            >
              Admin
            </button>
          </div>
          <div className="input-group mb-3">
            <button
              style={{
                width: "200px",
                height: "50px",
              }}
              onClick={(e) => {
                onClickButton(e, "instructor");
              }}
            >
              Instructor
            </button>
          </div>
          <div className="input-group mb-3">
            <button
              style={{
                width: "200px",
                height: "50px",
              }}
              onClick={(e) => {
                onClickButton(e, "student");
              }}
            >
              Student
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      //is the login form
      <div
        className="h-100 d-flex align-items-center justify-content-center"
        style={{ marginTop: "10%" }}
      >
        <form
          onSubmit={(e) => {
            loginHandler(e);
          }}
        >
          {/* for the id/ */}
          <div className="input-group mb-3">
            <input
              className=""
              type="id"
              id="id"
              name="id"
              required
              placeholder="Enter Your ID"
              style={{
                width: "200px",
                height: "50px",
              }}
            />
          </div>
          {/* (//for the password) */}
          <div className="input-group m-form">
            <input
              className=""
              style={{
                width: "200px",
                height: "50px",
              }}
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
              required
            />
          </div>

          <div className="text-center m-form">
            <input
              style={{
                width: "200px",
                height: "50px",
              }}
              type="submit"
              value="LOGIN"
              className="btn btn-dark btn-lg"
            />
          </div>
        </form>
      </div>
    );
  }
};

export default Login;
