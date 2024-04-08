import { Routes, Route, useLocation } from "react-router-dom";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  // Home,
  // Explore,
  // Saved,
  // CreatePost,
  // Profile,
  // EditPost,
  // PostDetails,
  UpdateProfile,
  // AllUsers,
} from "@/_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetCurrentUser } from "./lib/react-query/queries";
import { useEffect } from "react";
import { setRecentPostLoaded } from "./lib/utils";
const App = () => {
  const location = useLocation();
  const { data: currentUser } = useGetCurrentUser();
  useEffect(() => {
    setRecentPostLoaded(false);
  }, [location?.pathname]);
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          {/* <Route index element={<UpdateProfile />} /> */}
          {currentUser?.$id && <Route index element={<Home />} />}
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};
export default App;
