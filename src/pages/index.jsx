import Layout from "./Layout.jsx";

import Practice from "./Practice";
import Community from "./Community";
import Achievements from "./Achievements";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard";
import Calendar from "./Calendar";
import Giveaways from "./Giveaways";
import MyCards from "./MyCards";
import Games from "./Games";

// Games
import ChakraBlasterMax from "./ChakraBlasterMax";
import ChallengeBubbles from "./ChallengeBubbles";
import MemoryMatch from "./MemoryMatch";
import VibeAGotchi from "./VibeAGotchi";

import Login from "./Login";
import SignUp from "./SignUp";
import NotFound from "./NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Helper to determine current page for Layout highlighting
function _getCurrentPage(pathname) {
    const normalizedPath = pathname.toLowerCase().replace(/\/+$/, '').split('/').pop();
    const pageMap = {
        'mycards': 'Cards',
        'practice': 'Pull',
        'leaderboard': 'Leaderboard',
        'giveaways': 'Giveaways',
        'community': 'Community',
        'profile': 'Profile',
        'games': 'Games',
        'calendar': 'Calendar',
        'chakrablastermax': 'Games',
        'vibeagotchi': 'Games',
        'challengebubbles': 'Games',
        'memorymatch': 'Games'
    };
    return pageMap[normalizedPath] || 'Practice';
}

function PagesContent() {
    const location = useLocation();
    const normalizedPath = location.pathname.toLowerCase().replace(/\/+$/, '');
    const isAuthPage = ['/login', '/signup'].includes(normalizedPath);
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={
                isAuthPage ? <NotFound /> : (
                    <Layout currentPageName={currentPage}>
                        <Routes>
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Practice />} />
                                <Route path="/practice" element={<Practice />} />
                                <Route path="/mycards" element={<MyCards />} />
                                <Route path="/leaderboard" element={<Leaderboard />} />
                                <Route path="/giveaways" element={<Giveaways />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/games" element={<Games />} />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route path="/achievements" element={<Achievements />} />
                                <Route path="/premiumpacks" element={<Giveaways />} />
                                <Route path="/chakrablastermax" element={<ChakraBlasterMax />} />
                                <Route path="/vibeagotchi" element={<VibeAGotchi />} />
                                <Route path="/challengebubbles" element={<ChallengeBubbles />} />
                                <Route path="/memorymatch" element={<MemoryMatch />} />
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </Layout>
                )
            } />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
