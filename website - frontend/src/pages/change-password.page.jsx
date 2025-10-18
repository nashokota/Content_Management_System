import { useRef } from "react"
import AnimationWrapper from "../common/page-animation"
import InputBox from "../components/input.component"
import { Toaster, toast } from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../App";
import axios from "axios";

const ChangePassword = () => {
    let {userAuth:{access_token}} = useContext(UserContext); 

    let changePasswordForm = useRef();

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for(let [key, value] of form.entries()){
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("Please fill all the fields.");
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password must be between 6 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter.");
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("Updating Password...");

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData,{ headers: { "Authorization": `Bearer ${access_token}` }}).then(({ data }) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.success("Password updated successfully.");
        }).catch(({response}) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.error(response.data.error);
        })
    }
    return (
        <AnimationWrapper>
            <Toaster />
            <form ref={changePasswordForm}>

                <h1 className="max-md:hidden">Change Password</h1>

                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox name="currentPassword" type="password" placeholder="Current Password" className="profile-edit-input" icon="fi-rr-unlock" />
                    <InputBox name="newPassword" type="password" placeholder="New Password" className="profile-edit-input" icon="fi-rr-unlock" />

                    <button onClick={handleSubmit} className="btn-dark px-10" type="submit">Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword