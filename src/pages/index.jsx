import Layout from "./Layout.jsx";

// Main pages
import PullCards from "./PullCards";
import Wins from "./Wins";
import Giveaways from "./Giveaways";
import Games from "./Games";
import Community from "./Community";
import Profile from "./Profile";
import Calendar from "./Calendar";
import About from "./About";

// Legacy pages kept for backward compatibility
import MyCards from "./MyCards";

// Games
import ChakraBlasterMax from "./ChakraBlasterMax";
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
        'pullcards': 'PullCards',
        'pull': 'PullCards',
        'wins': 'Wins',
        'giveaways': 'Giveaway',
        'giveaway': 'Giveaway',
        'games': 'Games',
        'community': 'Social',
        'social': 'Social',
        'profile': 'Profile',
        'calendar': 'Calendar',
        'about': 'About',
        // Legacy paths
        'mycards': 'PullCards',
        'practice': 'PullCards',
        'achievements': 'Wins',
        'chakrablastermax': 'Games',
        'vibeagotchi': 'Games',
        'memorymatch': 'Games'
    };
    return pageMap[normalizedPath] || 'PullCards';
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
                                {/* New Primary Routes */}
                                <Route path="/" element={<PullCards />} />
                                <Route path="/pullcards" element={<PullCards />} />
                                <Route path="/pull" element={<PullCards />} />
                                <Route path="/wins" element={<Wins />} />
                                <Route path="/giveaway" element={<Giveaways />} />
                                <Route path="/games" element={<Games />} />
                                <Route path="/social" element={<Community />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route path="/about" element={<About />} />

                                {/* Legacy Routes for Backward Compatibility */}
                                <Route path="/practice" element={<PullCards />} />
                                <Route path="/mycards" element={<MyCards />} />
                                <Route path="/giveaways" element={<Giveaways />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="/achievements" element={<Wins />} />
                                <Route path="/premiumpacks" element={<Giveaways />} />

                                {/* Game Routes */}
                                <Route path="/chakrablastermax" element={<ChakraBlasterMax />} />
                                <Route path="/vibeagotchi" element={<VibeAGotchi />} />
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
