import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import CommentField from "./comment-field.component";

const CommentCard = ({index, leftVal, commentData}) => {

    let { commented_by: { personal_info: {fullname, username, profile_img}}, commentedAt, comment , _id } = commentData;

    let {userAuth: { access_token}} = useContext(UserContext);

    const [ isReplying, setReplying ] = useState(false);

    const handleReplyClick = () => {
        if(!access_token){
            return toast.error("You must be logged in to reply");
        }

        setReplying(preVal=> !preVal);
    }

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal}px` }}>
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} className="w-6 h-6 rounded-full"/>
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>
                
                <p className="font-gelasio text-xl ml-3">{commentData.comment}</p>

                <div className="flex ga-5 items-center mt-5">
                    <button className="underline"
                    onClick={handleReplyClick}>
                        Reply
                    </button>
                </div>
                {
                    isReplying ? 
                        <div className="mt-8">
                            <CommentField action="Reply" index={index} replyingTo={_id} setReplying={setReplying}/>
                        </div> : ""
                    
                }
            </div>
        </div>
    )
}

export default CommentCard;