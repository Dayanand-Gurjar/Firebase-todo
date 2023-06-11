import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider,signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import './SignIn.css';

const SignIn = () => {
  const [authenticated, setAuth] = useState(
    false || window.localStorage.getItem("authenticated") === "true"
  );
  const [token, setToken] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem("authenticated", "true");
        userCred.getIdToken().then((token) => {
          setToken(token);
        });
      }
    });
  }, []);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        if (credential) {
          setAuth(true);
          window.localStorage.setItem("authenticated", "true");
          window.location.replace('/');
        }
      })
      .catch((error) => {
        // Handle Errors here.
        window.alert("Some error occurred: " + error)
        navigate('/signin');
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Login</span>
        <form className='input-form' onSubmit={handleSubmit}>
          Email 
          <input type="email" placeholder="email" />
          Password
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
        <br/>
         OR
        <button onClick={loginWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default SignIn;