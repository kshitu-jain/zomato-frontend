import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const Header = (props) => {
  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;
    try {
      let decodedData = jwt_decode(token);
      //save in browser
      localStorage.setItem("zc_auth_token", token);
      alert("login successfully");
      //reload page
      window.location.assign("/");
    } catch (error) {
      console.log(error);
      //remove data of localstorage
      localStorage.removeItem("zc_auth_token");
    }
  };
  let onError = () => {
    console.log("Login Failed");
  };

  let logOut = () => {
    let isLogOut = window.confirm("Are you sure to log out?");
    if (isLogOut === true) {
      localStorage.removeItem("zc_auth_token");
      window.location.reload();
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId="13542519931-vigdjdertohrm90ovrr6o91ar32cc0q1.apps.googleusercontent.com">
        <div
          className="modal fade"
          id="login"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Login/Sign-Up
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <GoogleLogin onSuccess={onSuccess} onError={onError} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <header className="main-section-header">
          {props.logo === false ? (
            <p></p>
          ) : (
            <div className="p">
              <p className="e">e!</p>
            </div>
          )}

          <div className="clickbtn">
            {props.user ? (
              <>
                <button className="btn btn-outline-light">Welcome, {props.user.name}</button>
                <button className="btn btn-outline-primary mx-2 btn-border" onClick={logOut}>
                  Log Out
                </button>
              </>
            ) : (
              <button
                className="btn btn-border login"
                data-bs-toggle="modal"
                data-bs-target="#login">
                Login / Sign-Up
              </button>
            )}

            {/* <button className="btn btn-border">Create an account</button> */}
          </div>
        </header>
      </GoogleOAuthProvider>
    </>
  );
};

export default Header;
