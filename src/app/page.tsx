import { getPost } from "@/actions/post.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {
  const user = await currentUser()
  const posts = await getPost();
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-10 gap-6">

      <div className="lg:col-span-6 ">
        {user ? <CreatePost /> : null}
      </div>

      <div className=" space-y-6">
        {
          posts.map( (post) => (
            <PostCard key={post.id} post={post} />
          ))
        }
      </div>

      <div className=" hidden lg:block lg:col-span-4">
        <WhoToFollow />
      </div>
    
    </div>
  );
}
