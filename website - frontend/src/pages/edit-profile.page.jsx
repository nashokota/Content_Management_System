import { useContext } from "react";
import { UserContext } from "../App";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { profileDataStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import  {toast, Toaster } from "react-hot-toast";
import InputBox from "../components/input.component";
import { useRef } from "react";
import { storeInSession } from "../common/session";
import { uploadFile } from "../common/cloudinary";


const EditProfile = () => {
    let {userAuth = {}, setUserAuth} = useContext(UserContext) || {};
    let access_token = userAuth?.access_token;

    let bioLimit = 150;

    let profileImgEle = useRef();
    let editProfileForm = useRef();

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [charactersLeft, setCharactersLeft] = useState(bioLimit);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

    let { 
        personal_info: { 
            fullname = "", 
            username: profile_username = "", 
            profile_img = "", 
            email = "", 
            bio = "" 
        } = {}, 
        social_links = {} 
    } = profile || {};

    //corrected 
//     let {
//   personal_info: {
//     fullname = "",
//     username: profile_username = "",
//     profile_img = "",
//     email = "",
//     bio = ""
//   } = {},
//   social_links = {}
// } = profile || {};


    useEffect(() => {

        if(access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile",{username: userAuth.username})
            .then(({data}) => {
                setProfile(data.user);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [access_token])

    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length);
    }

    const handleImagePreview = (e) =>{
        let img = e.target.files[0];

        profileImgEle.current.src = URL.createObjectURL(img);

        setUpdatedProfileImg(img);
    }

    const handleImageUpload = (e) =>{
        e.preventDefault();

        if(updatedProfileImg) {
            let loadingToast = toast.loading("Uploading Image...");
            e.target.setAttribute("disabled", true);

            uploadFile(updatedProfileImg)
            .then(url =>{

                if(url){
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", {url}, {headers: {Authorization: `Bearer ${access_token}`}})
                    .then(({data}) => {
                        let newUserAuth = {...userAuth, profile_img: data.url};

                        storeInSession("user", JSON.stringify(newUserAuth));
                        setUserAuth(newUserAuth);

                        setUpdatedProfileImg(null);

                        toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                        toast.success("Image uploaded successfully.");
                    })
                    .catch(({response}) => {
                        toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                        toast.error(response.data.error);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!editProfileForm.current) {
            return toast.error("Form not loaded yet");
        }

        let form = new FormData(editProfileForm.current);
        let formData = {};

        for(let [key, value] of form.entries()){
            formData[key] = value || ""; // Ensure empty strings instead of undefined
        }

        let { username = "", bio = "", youtube = "", facebook = "", twitter = "", instagram = "", github = "", website = "" } = formData;

        if(!username || username.length < 3){
            return toast.error("Username must be at least 3 characters long.");
        }
        if(bio.length > bioLimit){
            return toast.error(`Bio must be less than ${bioLimit} characters long.`);
        }
        let loadingToast = toast.loading("Updating Profile...");
        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile",{username, bio, social_links: {youtube, facebook, twitter, instagram, github, website}}, {headers: {Authorization: `Bearer ${access_token}`}})
        .then(({data}) => {
           
            if(userAuth.username != data.username){
                let newUserAuth = {...userAuth, username: data.username};

                storeInSession("user", JSON.stringify(newUserAuth));
                setUserAuth(newUserAuth);
            }

            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.success("Profile updated successfully.");
        })
        .catch(({response}) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.error(response.data.error);
        })
    }    

    return (
            <AnimationWrapper>
                {
                    loading ? <Loader/> :
                    <form ref={editProfileForm}>
                        <Toaster/>

                        <h1 className="max-md:hidden">Edit Profile</h1>

                        <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">

                            <div className="max-lg:center mb-5">
                                <label htmlFor="uploadImg" id="profileImgLabel"
                                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden">
                                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                                        Upload Image
                                    </div>
                                    <img ref={profileImgEle} src={profile_img}/>
                                </label>
                                <input type="file" accept=".jpeg, .jpg, .png" id="uploadImg" hidden onChange={handleImagePreview}/>

                                <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={handleImageUpload}>Upload</button>
                            </div>

                            <div className="w-full">

                                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                    <div>
                                        <InputBox name="fullname" type="text" 
                                        placeholder="Full Name" value={fullname} 
                                        disable={true} icon="fi-rr-user"/>
                                    </div>
                                    <div>
                                        <InputBox name="email" type="email" 
                                        placeholder="Email" value={email} 
                                        disable={true} icon="fi-rr-envelope"/>
                                    </div>
                                </div>

                                <InputBox name="username" type="text" 
                                placeholder="Username" value={profile_username} 
                                disable={false} icon="fi-rr-at"/>

                                <p className="text-dark-grey -mt-3">Username will use to search user and will be visible to all users</p>

                                <textarea name="bio" maxLength={bioLimit} defaultValue={bio} 
                                placeholder="Bio" className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" onChange={handleCharacterChange}></textarea>

                                <p className="mt-1 text-dark-grey">{ charactersLeft } characters left</p>

                                <p className="my-6 text-dark-grey">Add your social handles below</p>

                                <div className="md:grid md:grid-cols-2 gap-x-6">
                                    {
                                        Object.keys(social_links).map((key,i) =>{
                                            let link = social_links[key] || "";

                                            return <InputBox 
                                                key={i} 
                                                name={key} 
                                                type="text" 
                                                placeholder="https://" 
                                                value={link}
                                                defaultValue=""
                                                icon={"fi " +(key!='website' ? "fi-brands-" + key : "fi-rr-globe")} 
                                            />
                                        })
                                    }
                                </div>

                                <button className="btn-dark w-auto px-10" 
                                type="submit" onClick={handleSubmit}>Update</button>
                            </div>

                        </div>
                    </form>
                }
            </AnimationWrapper>
    )
}

export default EditProfile;