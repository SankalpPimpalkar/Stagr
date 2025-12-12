import { Routes, Route } from "react-router"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Feed from "./pages/Feed"
import SearchUser from "./pages/SearchUser"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import Explore from "./pages/Explore"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Feed />} />
        <Route path="users" element={<SearchUser />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="explore" element={<Explore />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
