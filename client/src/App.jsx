import { useEffect } from "react"
import { Routes, Route, Outlet } from "react-router"
import { useAuth, SignIn, SignUp } from "@clerk/clerk-react"
import { registerTokenProvider } from "./utils/api"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Feed from "./pages/Feed"
import SearchUser from "./pages/SearchUser"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import Explore from "./pages/Explore"
import NotFound from "./pages/NotFound"
import CreatePost from "./pages/CreatePost"
import { Navbar } from "./components/Navbar"
import U from "./pages/u"

export default function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    // Register the token provider so api.js can fetch tokens securely
    registerTokenProvider(getToken);
  }, [getToken]);

  return (
    <Routes>
      <Route path="/sign-in" element={
        <div className="flex items-center justify-center min-h-screen bg-base-300">
          <SignIn />
        </div>
      } />
      <Route path="/sign-up" element={
        <div className="flex items-center justify-center min-h-screen bg-base-300">
          <SignUp />
        </div>
      } />

      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Feed />} />
          <Route path="users" element={<SearchUser />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="U/:username" element={<U />} />
          <Route path="settings" element={<Settings />} />
          <Route path="explore" element={<Explore />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

import { BottomNav } from "./components/nav/BottomNav"

function Layout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content antialiased pb-16 md:pb-0">
      <Navbar />
      <div className="container mx-auto p-4 max-w-2xl pt-20">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
