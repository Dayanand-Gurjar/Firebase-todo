import React, { useState } from "react";
import "./Register.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password)
        .then()
        .catch((err) => {
          setErrMessage(
            "Sorry, either User exists or your password is too short !"
          );
          e.target[0].value = null;
          e.target[1].value = null;
          e.target[2].value = null;
          e.target[3].value = null;
        });
        if (file === undefined) {
          await updateProfile(res.user, {
            displayName,
            photoURL: process.env.REACT_APP_DEFAULT_PIC,
          });
          navigate("/");
        }
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);
        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              //Update profile
              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });
              console.log(res.user.photoURL);
              navigate("/");
            } catch (err) {
              console.log(err);
              setErr(true);
              setLoading(false);
            }
          });
        });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Register</span>
        <form className="input-form" onSubmit={handleSubmit}>
          Name*
          <input required type="text" placeholder="Your name" />
          Email*
          <input required type="email" placeholder="Your email" />
          Password*
          <input
            required
            type="password"
            placeholder="Password atleast 8 digits long"
          />
          Add Profile Pic (Optional)
          <input type="file" id="file" />
        
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading data... Please wait..."}
          {err && <span>{errMessage}</span>}
        </form>
        <p>
          You do have an account? <Link to="/signin">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
