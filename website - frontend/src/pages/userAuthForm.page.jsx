import { useContext } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
  const serverRoute = type === "sign-in" ? "/signin" : "/signup";

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response?.data?.error || "Server error");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Safely get form data from the submitted form (e.target)
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const fullname = type !== "sign-in" ? form.fullname?.value : "";

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // Form validation
    if (type !== "sign-in") {
      if (!fullname || fullname.length < 3) {
        return toast.error("Full name must be at least 3 characters long.");
      }
    }

    if (!email) {
      return toast.error("Enter a valid email.");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid.");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be between 6 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter."
      );
    }

    const formData = { fullname, email, password };
    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        toast.error("Trouble signing in with Google");
        console.log(error);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyvalue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center md-24">
            {type === "sign-in" ? "Welcome back" : "Join us today!"}
          </h1>
          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              placeholder="Full Name"
              type="text"
              icon="fi-rr-user"
            />
          ) : null}
          <InputBox
            name="email"
            placeholder="Email"
            type="email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            placeholder="Password"
            type="password"
            icon="fi-rr-lock"
          />
          <button className="btn-dark center mt-14" type="submit">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button
            className="btn-dark flex items-center gap-4 justify-center w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            Continue with Google
          </button>
          {type === "sign-in" ? (
            <p className="text-center mt-6 text-dark-grey text-size-xl">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="text-center mt-6 text-dark-grey text-size-xl">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign In here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;