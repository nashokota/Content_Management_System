import InputBox from "../components/input.component";
import googleIcon from '../imgs/google.png';
import { Link } from "react-router-dom";

const UserAuthForm = ({ type }) => {
  return (
    <section className="h-cover flex items-center justify-center">
      <form className="w-[80%] max-w-[400px]">
        <h1 className="text-4xl font-gelasio capitalize text-center md-24">
            {type === "sign-in" ? "Welcome back" : "Join us today!"}
        </h1>
        {
            type != "sign-in" ?
            <InputBox 
              name="fullname"
              placeholder="Full Name"
              type="text"
              icon="fi-rr-user"
            /> : ""
        }
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

        <button className="btn-dark center mt-14"
                type="submit">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
        </button>
        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black"/>
            <p>or</p>
            <hr className="w-1/2 border-black"/>
        </div>
        <button className="btn-dark flex items-center gap-4 justify-center w-[90%] center">
            <img src={googleIcon} className="w-5"/>
            Continue with Google
        </button>
        {
            type === "sign-in" ?
            <p className="text-center mt-6 text-dark-grey text-size-xl">
                Don't have an account? 
                <Link to="/signup" className="underline text-black text-xl ml-1">Join us today</Link>
            </p>
            :
            <p className="text-center mt-6 text-dark-grey text-size-xl">
                Already a member? 
                <Link to="/signin" className="underline text-black text-xl ml-1">Sign In here.</Link>
            </p>
        }
      </form>
    </section>
  )
}

export default UserAuthForm;