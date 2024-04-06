import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import {
  useGetCurrentUser,
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queries";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";

const Home = () => {
  const { ref, inView } = useInView();
  const { data: currentUser } = useGetCurrentUser();

  // Call useGetRecentPosts only when user?.id is available
  // const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts(user?.id);

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isError: isErrorPosts,
  } = useGetRecentPosts(currentUser);

  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (posts) {
      console.log(posts);
    }
  }, [posts]);

  if (!posts || isRefetching)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left text-dark-4 w-full">
            Campus Feed
          </h2>
          {/* {(isLoading || isPostLoading) && !posts ? ( // Simplified loading check
            <Loader />
          ) : ( */}
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {posts?.pages?.map((post: Models.Document, index) => (
              <Fragment key={index}>
                {post?.documents?.map((item: Models.Document) => (
                  <li key={item.$id} className="flex justify-center w-full">
                    <PostCard post={item} />
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
          {/* )} */}
        </div>
        {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-dark-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
