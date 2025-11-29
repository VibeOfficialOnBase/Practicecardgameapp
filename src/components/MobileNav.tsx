import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Award, Users, Trophy, Gift, Info, Wallet, Copy, RefreshCw, LogOut, Check, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Address } from 'viem';

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
}

const primaryNavItems: NavItem[] = [
  { id: 'home', label: 'Pull', icon: Home },
  { id: 'achievements', label: 'Wins', icon: Award },
  { id: 'leaderboard', label: 'Games', icon: Trophy },
];

const secondaryNavItems: NavItem[] = [
  { id: 'raffle', label: 'Giveaway', icon: Gift },
  { id: 'community', label: 'Social', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAboutClick: () => void;
  address?: Address;
  onDisconnect?: () => void;
  onRefreshBalance?: () => void;
  isRefreshing?: boolean;
}

export function MobileNav({ activeTab, onTabChange, onAboutClick, address, onDisconnect, onRefreshBalance, isRefreshing }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      {/* Desktop Navigation - Scrollable horizontal on tablet */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {[...primaryNavItems, ...secondaryNavItems].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap min-w-[44px] min-h-[44px] ${
                activeTab === item.id
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onAboutClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-white/60 hover:text-white hover:bg-white/10 whitespace-nowrap min-w-[44px] min-h-[44px]"
          aria-label="About PRACTICE"
        >
          <Info className="w-5 h-5" />
          <span className="text-sm font-semibold">About</span>
        </button>
      </div>

      {/* Mobile Navigation - Primary tabs + Hamburger menu */}
      <div className="flex sm:hidden items-center gap-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-[56px] min-h-[56px] ${
                activeTab === item.id
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
        
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 text-white/60 hover:text-white hover:bg-white/10 min-w-[56px] min-h-[56px]"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-xs font-semibold">Menu</span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-[72px] left-0 right-0 z-50 bg-gradient-to-b from-indigo-950/98 to-purple-900/98 backdrop-blur-lg border-b border-white/10 shadow-2xl sm:hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {/* Wallet Controls - Only show if address exists */}
                {address && (
                  <>
                    <div className="pb-2 mb-2 border-b border-white/10">
                      <div className="flex items-center gap-2 px-4 py-2 mb-2">
                        <Wallet className="w-4 h-4 text-green-400" />
                        <span className="text-white/80 text-sm font-semibold">Wallet Connected</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto"></div>
                      </div>
                      
                      {/* Copy Address */}
                      <button
                        onClick={handleCopyAddress}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10 min-h-[48px]"
                        aria-label="Copy wallet address"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        <span className="text-sm font-medium">{copied ? 'Copied!' : truncateAddress(address)}</span>
                      </button>
                      
                      {/* Refresh Balance */}
                      {onRefreshBalance && (
                        <button
                          onClick={() => {
                            onRefreshBalance();
                            setIsMenuOpen(false);
                          }}
                          disabled={isRefreshing}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10 min-h-[48px] disabled:opacity-50"
                          aria-label="Refresh token balance"
                        >
                          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                          <span className="text-sm font-medium">{isRefreshing ? 'Refreshing...' : 'Refresh Balance'}</span>
                        </button>
                      )}
                      
                      {/* Disconnect */}
                      {onDisconnect && (
                        <button
                          onClick={() => {
                            onDisconnect();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 min-h-[48px]"
                          aria-label="Disconnect wallet"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Disconnect Wallet</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
                
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[52px] ${
                        activeTab === item.id
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      aria-label={item.label}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-base font-semibold">{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    onAboutClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10 min-h-[52px]"
                  aria-label="About PRACTICE"
                >
                  <Info className="w-5 h-5" />
                  <span className="text-base font-semibold">About PRACTICE</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
