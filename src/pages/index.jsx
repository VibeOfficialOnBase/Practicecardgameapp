import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";
import Practice from "./Practice";
import Community from "./Community";
import Achievements from "./Achievements";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard";
import Settings from "./Settings";
import Journal from "./Journal";
import Favorites from "./Favorites";
import CategoryFilter from "./CategoryFilter";
import BonusPack from "./BonusPack";
import ChakraBlaster from "./ChakraBlaster";
import MindfulMaze from "./MindfulMaze";
import GratitudeGrid from "./GratitudeGrid";
import ChakraBlasterMax from "./ChakraBlasterMax";
import Games from "./Games";
import ChakraAchievements from "./ChakraAchievements";
import ChallengeBubbles from "./ChallengeBubbles";
import MyCards from "./MyCards";
import MemoryMatch from "./MemoryMatch";
import Friends from "./Friends";
import PremiumPacks from "./PremiumPacks";
import Cosmetics from "./Cosmetics";
import Groups from "./Groups";
import SocialFeed from "./SocialFeed";
import VibeAGotchi from "./VibeAGotchi";

import Login from "./Login";
import SignUp from "./SignUp";
import ProtectedRoute from "@/components/ProtectedRoute";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Dashboard: Dashboard,
    Practice: Practice,
    Community: Community,
    Achievements: Achievements,
    Profile: Profile,
    Leaderboard: Leaderboard,
    Settings: Settings,
    Journal: Journal,
    Favorites: Favorites,
    CategoryFilter: CategoryFilter,
    BonusPack: BonusPack,
    ChakraBlaster: ChakraBlaster,
    MindfulMaze: MindfulMaze,
    GratitudeGrid: GratitudeGrid,
    ChakraBlasterMax: ChakraBlasterMax,
    Games: Games,
    ChakraAchievements: ChakraAchievements,
    ChallengeBubbles: ChallengeBubbles,
    MyCards: MyCards,
    MemoryMatch: MemoryMatch,
    Friends: Friends,
    PremiumPacks: PremiumPacks,
    Cosmetics: Cosmetics,
    Groups: Groups,
    SocialFeed: SocialFeed,
    VibeAGotchi: VibeAGotchi,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();

    // Normalize path to remove trailing slashes and query params for the check
    const normalizedPath = location.pathname.toLowerCase().replace(/\/+$/, '');

    // Don't show layout on auth pages
    const isAuthPage = ['/login', '/signup'].includes(normalizedPath);
    const currentPage = _getCurrentPage(location.pathname);
    
    if (isAuthPage) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        );
    }

    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Practice" element={<Practice />} />
                    <Route path="/Community" element={<Community />} />
                    <Route path="/Achievements" element={<Achievements />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/Leaderboard" element={<Leaderboard />} />
                    <Route path="/Settings" element={<Settings />} />
                    <Route path="/Journal" element={<Journal />} />
                    <Route path="/Favorites" element={<Favorites />} />
                    <Route path="/CategoryFilter" element={<CategoryFilter />} />
                    <Route path="/BonusPack" element={<BonusPack />} />
                    <Route path="/ChakraBlaster" element={<ChakraBlaster />} />
                    <Route path="/MindfulMaze" element={<MindfulMaze />} />
                    <Route path="/GratitudeGrid" element={<GratitudeGrid />} />
                    <Route path="/ChakraBlasterMax" element={<ChakraBlasterMax />} />
                    <Route path="/Games" element={<Games />} />
                    <Route path="/ChakraAchievements" element={<ChakraAchievements />} />
                    <Route path="/ChallengeBubbles" element={<ChallengeBubbles />} />
                    <Route path="/MyCards" element={<MyCards />} />
                    <Route path="/MemoryMatch" element={<MemoryMatch />} />
                    <Route path="/Friends" element={<Friends />} />
                    <Route path="/PremiumPacks" element={<PremiumPacks />} />
                    <Route path="/Cosmetics" element={<Cosmetics />} />
                    <Route path="/Groups" element={<Groups />} />
                    <Route path="/SocialFeed" element={<SocialFeed />} />
                    <Route path="/VibeAGotchi" element={<VibeAGotchi />} />
                </Route>
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
