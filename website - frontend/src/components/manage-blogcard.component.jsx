import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useState } from "react";

const BlogStats = ({stats}) => {
    return(
        <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
            {
                Object.keys(stats).map((info, i) => {
                    return !info.includes("parent") ?<div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 " + (i != 0 ? "border-grey border-l " : "")}>
                        <h1 className="text-xl lg:text-2xl mb-2">{stats[info].toLocaleString()}</h1>
                        <p className="max-lg:text-dark-grey capitalize">{info.split("_")[1]}</p>
                    </div> :"";
                })
            }
        </div>
    )
}

const ManagePublishedBlogsCard = ({blog}) => {

    let {banner, blog_id, title, publishedAt, activity} = blog;

    let [showStat, setShowStat] = useState(false);

    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
                <img src={banner} className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover"/>

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link to={`/blog/${blog_id}`} className="blog-title mb-4 hover:underline">{title}</Link>
                        <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
                    </div>

                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">Edit</Link>

                        <button className="lg:hidden pr-4 py-2 underline"
                        onClick={() => setShowStat(currentVal => !currentVal)}>Stats</button>

                        <button className="pr-4 py-2 underline text-red">Delete</button>
                    </div>
                </div>

                <div className="max-lg:hidden">
                    <BlogStats stats={activity}/>
                </div>

            </div>

            {
                showStat ? <div className="lg:hidden"><BlogStats stats={activity}/></div>
                : ""
            }
        </>
    )
}

export default ManagePublishedBlogsCard;