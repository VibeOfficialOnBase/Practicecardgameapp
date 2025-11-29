/**
 * WalletConnect Component
 * 
 * Legacy wrapper that uses the new ConnectWalletButton component.
 * Maintained for backward compatibility with existing code that imports
 * from this path.
 * 
 * @module components/wallet/WalletConnect
 */

import ConnectWalletButton from './ConnectWalletButton';

/**
 * WalletConnect Component
 * Renders the new ConnectWalletButton component
 */
export default function WalletConnect(props) {
  return <ConnectWalletButton {...props} />;
}
