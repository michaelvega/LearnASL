import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Login.css"
import logo from "../../assets/images/three.png";

function Login() {



  return (
    <div className={"loginTextWrapperHorizontal"}>
      <div className={"formWrapper"}>
        <img src={logo} alt="" width="72" height="72"/>
        <form className={"formWrapper2"}>

          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
              <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
              <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"/> Remember Me
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
          <p className="mt-5 mb-3 text-muted">&copy; 2023 EsoLingo</p>
        </form>
      </div>
    </div>
  );
}

export default Login;