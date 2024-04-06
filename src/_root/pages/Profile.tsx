import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queries";
import { Loader, PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
interface StabBlockProps {
  value: string | number;
  label: string;
}
const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="text-dark-2 font-extrabold">{value}</p>
    <p className="text-dark-2 font-semibold">{label}</p>
  </div>
);
const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { data: currentUser } = useGetUserById(id || "");
  console.log(currentUser?.posts);
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full text-dark-1">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-dark-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser?.posts?.length} label="Posts" />
              {/* <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" /> */}
            </div>
            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm text-dark-1">
              {currentUser.bio}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-green-900 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            {/* <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_green px-8">
                Follow
              </Button>
            </div> */}
          </div>
        </div>
      </div>
      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg  text-dark-2 font-bold ${
              pathname === `/profile/${id}` && "!bg-yellow-400"
            }`}>
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg  text-dark-2 font-bold ${
              pathname === `/profile/${id}/liked-posts` && "!bg-yellow-400"
            }`}>
            Liked Posts
          </Link>
        </div>
      )}
      <Routes>
        <Route
          index
          // element={<GridPostList posts={currentUser.posts} showUser={false} />}
          element={
            <>
              {currentUser?.posts?.map((post: any) => (
                <div
                  key={post.$id}
                  className="post_details-card"
                  style={{cursor:'pointer'}}
                  onClick={() => {
                    navigate(`/posts/${post.$id}`);
                  }}>
                  <img
                    src={post?.imageUrl}
                    alt="creator"
                    className="post_details-img"
                  />
                  <div className="post_details-info">
                    <div className="flex-between w-full">
                      <Link
                        to={`/profile/${id}`}
                        className="flex items-center gap-3">
                        <img
                          src={
                            currentUser?.imageUrl ||
                            "/assets/icons/profile-placeholder.svg"
                          }
                          alt="creator"
                          className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                        />
                        <div className="flex gap-1 flex-col">
                          <p className="base-medium lg:body-bold text-dark-1">
                            {currentUser?.name}
                          </p>
                          <div className="flex-center gap-2 text-dark-3">
                            <p className="subtle-semibold lg:small-regular text-dark-2">
                              {multiFormatDateString(post?.$createdAt)}
                            </p>
                            •
                            <p className="subtle-semibold lg:small-regular text-dark-3">
                              {post?.location}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                      <p className="text-dark-4">{post?.caption}</p>
                      <ul className="flex gap-1 mt-2">
                        {post?.tags.map((tag: string, index: string) => (
                          <li
                            key={`${tag}${index}`}
                            className="text-light-4 small-regular">
                            #{tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-full">
                      <PostStats post={post} userId={user.id} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          }
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};
export default Profile;
