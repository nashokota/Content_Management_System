import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { useRef, useContext, useState, useEffect } from "react"; // ✅ Added useState
import  { EditorContext } from "../pages/editor.pages";
import { uploadFile } from "../common/cloudinary";
import EditorJS from '@editorjs/editorjs';
import { tools } from "../components/tools.component";
import { Toaster, toast} from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {
  // ✅ ADD THIS LINE - Missing state declaration
  const [uploading, setUploading] = useState(false);
  
  let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);

  let { userAuth: { access_token } } = useContext(UserContext);
  let { blog_id} = useParams();

  let navigate = useNavigate();

  //useEffect
  useEffect(() => {
    if(!textEditor.isReady){
        setTextEditor(new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Write your blog here...",
      }))
    }
  },[])

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (images + MP4 video)
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const validVideoTypes = ['video/mp4'];
    const isValid = validImageTypes.includes(file.type) || validVideoTypes.includes(file.type);
    
    if (!isValid) {
      alert("Please upload a valid image (JPG/PNG) or MP4 video.");
      return;
    }

    // Optional: file size limit (e.g., 100MB for free tier)
    if (file.size > 100 * 1024 * 1024) {
      alert("File too large! Max size: 100MB");
      return;
    }

    setUploading(true); // ✅ Now this works!
    try {
      // ✅ Upload to Cloudinary
      const secureUrl = await uploadFile(file);
      
      // ✅ Update blog state with Cloudinary URL
      setBlog({ ...blog, banner: secureUrl });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload media. Please try again.");
    } finally {
      setUploading(false); // ✅ Now this works!
    }
  };

  const handleTitleKeyDown = (e) => {
    if(e.keyCode === 13){
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    e.target.src = defaultBanner;
  };

  const handlePublishEvent = () =>{
    if(!banner.length){
        return toast.error("Upload a banner to publish your blog.");
    }

    if(!title.length){
        return toast.error("Enter a title to publish your blog.");
    }
    if(textEditor.isReady){
        textEditor.save().then(data=>{
            if(data.blocks.length){
                setBlog({...blog, content: data});
                setEditorState("Publish")
            }else{
                return toast.error("Write something to publish your blog.");
            }
        }).catch((err) =>{
            console.log(err);
        })
    }
  }

  const handleSaveDraft = (e) =>{

        if(e.target.className.includes('disable')){
            return ;
        }

        if(!title.length){
            return toast.error("Write blog title before saving as draft.");
        }

        let loadingToast = toast.loading("Saving Draft....");

        e.target.classList.add('disable');

        if (textEditor.isReady) {
          textEditor.save().then(content => {
            
        let blogObj = {
            title, banner, des, content, tags, draft: true
        }
            axios
              .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
                {...blogObj, id: blog_id},
                { headers: { Authorization: `Bearer ${access_token}` } }
              )
              .then(({ data }) => {
                e.target.classList.remove("disable");

                toast.dismiss(loadingToast);
                toast.success("Saved as draft.");

                setTimeout(() => {
                  navigate("/dashboard/blogs?tab=drafts");
                }, 500);
              })
              .catch(({ response }) => {
                e.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                return toast.error(response.data.error);
              });
          });
        }

  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="Logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title?.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button 
            className="btn-dark py-2"
            disabled={uploading} // ✅ Disable during upload
            onClick={handlePublishEvent}
          >
            Publish
          </button>
          <button className="btn-light py-2"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-grey cursor-pointer">
              <label htmlFor="uploadBanner">
                <img 
                  src={banner} 
                  className="z-20"
                  onError= {handleError}
                />
                <input 
                  id="uploadBanner" 
                  type="file" 
                  accept=".png,.jpg,.jpeg,.webp,.mp4" 
                  hidden 
                  onChange={handleBannerUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                    Uploading...
                  </div>
                )}
              </label>
            </div>
            <textarea 
              placeholder="Blog Title" 
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
              defaultValue={title}
            ></textarea>

            <hr className="w-full opacity-10 my-5"/>

            <div id="textEditor" className="font-gelasio"></div>

          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;