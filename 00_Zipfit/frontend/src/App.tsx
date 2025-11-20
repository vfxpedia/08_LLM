import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { LandingPage } from "./pages/LandingPage";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { AnnouncementListPage } from "./pages/AnnouncementListPage";
import { AnnouncementDetailPage } from "./pages/AnnouncementDetailPage";
import { ComparisonPage } from "./pages/ComparisonPage";
import { EligibilityCheckPage } from "./pages/EligibilityCheckPage";
import { LoanInfoPage } from "./pages/LoanInfoPage";
import { MyPage } from "./pages/MyPage";
import { NotificationSettingsPage } from "./pages/NotificationSettingsPage";
import { FAQPage } from "./pages/FAQPage";
import { UserProfileModal } from "./components/UserProfileModal";

export interface UserProfile {
  name: string;
  age: number;
  residence: string;
  residenceDuration: number;
  maritalStatus: "single" | "married" | "other";
  hasChildren: boolean;
  numberOfChildren?: number;
  income: number;
}

function AppContent() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] =
    useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [pendingNavigation, setPendingNavigation] = useState<
    string | null
  >(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Load favorites and compare list
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedCompareList =
      localStorage.getItem("compareList");
    if (savedCompareList) {
      setCompareList(JSON.parse(savedCompareList));
    }
  }, []);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(
      "userProfile",
      JSON.stringify(profile),
    );
    setShowProfileModal(false);
    // 프로필 저장 후 이동할 경로가 있으면 이동
    const targetPath = pendingNavigation || "/home";
    setPendingNavigation(null);
    navigate(targetPath);
  };

  const handleProfileEdit = () => {
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setFavorites([]);
    setCompareList([]);
    localStorage.removeItem("userProfile");
    localStorage.removeItem("favorites");
    localStorage.removeItem("compareList");
    navigate("/");
  };

  const handleStartClick = (targetPath: string = "/home") => {
    if (!userProfile) {
      setPendingNavigation(targetPath);
      setShowProfileModal(true);
    } else {
      navigate(targetPath);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem(
        "favorites",
        JSON.stringify(newFavorites),
      );
      return newFavorites;
    });
  };

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        const newList = prev.filter((cid) => cid !== id);
        localStorage.setItem(
          "compareList",
          JSON.stringify(newList),
        );
        return newList;
      } else if (prev.length < 3) {
        const newList = [...prev, id];
        localStorage.setItem(
          "compareList",
          JSON.stringify(newList),
        );
        return newList;
      }
      return prev;
    });
  };

  return (
    <>
      <Routes>
        {/* Landing Page - No Layout */}
        <Route
          path="/"
          element={
            <LandingPage
              onStartClick={() => handleStartClick()}
            />
          }
        />

        {/* All other pages with Layout */}
        <Route
          path="/home"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <HomePage userProfile={userProfile} />
            </Layout>
          }
        />
        <Route
          path="/chat"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <ChatPage userProfile={userProfile} />
            </Layout>
          }
        />
        <Route
          path="/announcements"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <AnnouncementListPage
                userProfile={userProfile}
                favorites={favorites}
                compareList={compareList}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            </Layout>
          }
        />
        <Route
          path="/announcements/:id"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <AnnouncementDetailPage
                favorites={favorites}
                compareList={compareList}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            </Layout>
          }
        />
        <Route
          path="/comparison"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <ComparisonPage compareList={compareList} />
            </Layout>
          }
        />
        <Route
          path="/eligibility"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <EligibilityCheckPage userProfile={userProfile} />
            </Layout>
          }
        />
        <Route
          path="/loans"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <LoanInfoPage userProfile={userProfile} />
            </Layout>
          }
        />
        <Route
          path="/mypage"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <MyPage
                userProfile={userProfile}
                favorites={favorites}
                onEditProfile={handleProfileEdit}
              />
            </Layout>
          }
        />
        <Route
          path="/notifications"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <NotificationSettingsPage
                userProfile={userProfile}
              />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout
              userProfile={userProfile}
              onEditProfile={handleProfileEdit}
              onLogout={handleLogout}
            >
              <FAQPage />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showProfileModal && (
        <UserProfileModal
          initialProfile={userProfile}
          onSave={handleProfileSave}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}