import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { IUser } from "@/types";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList: React.FC<GridPostListProps> = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <List
          key={post.$id}
          post={post}
          showUser={showUser}
          showStats={showStats}
          user={user}
        />
      ))}
    </ul>
  );
};

export default GridPostList;

type ListProps = {
  post: Models.Document;
  showUser: boolean;
  showStats: boolean;
  user: IUser;
};

const List: React.FC<ListProps> = ({
  post,
  showUser,
  showStats,
}: ListProps) => {
  const { user } = useUserContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {!imageLoaded && (
        <Skeleton
          className="relative min-w-80 h-80 "
          style={{ borderRadius: 20 }}
        />
      )}

      <li
        className={`relative min-w-80 h-80 ${imageLoaded ? "visible" : "hidden"}`}>
        <Link to={`/posts/${post.$id}`} className="grid-post_link hidden">
          <img
            src={post.imageUrl}
            alt="post"
            className={`h-full w-full object-cover ${imageLoaded ? "visible" : "hidden"}`}
            onLoad={handleImageLoaded}
          />
        </Link>
        {imageLoaded && (
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
            {showStats && <PostStats post={post} userId={user.id} />}{" "}
            {/* Conditional rendering based on showStats prop */}
          </div>
        )}
      </li>
    </>
  );
};
