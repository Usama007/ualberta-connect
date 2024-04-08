import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          {!imageLoaded ? (
            <Skeleton className="h-full w-full object-cover" />
          ) : (
            <>
              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="h-full w-full object-cover"
                  onLoad={handleImageLoaded}
                />
              </Link>

              <div className="grid-post_user">
                {showUser && (
                  <div className="flex items-center justify-start gap-2 flex-1">
                    <img
                      src={
                        post.creator.imageUrl ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1">{post.creator.name}</p>
                  </div>
                )}
                {showStats && <PostStats post={post} userId={user.id} />}
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
