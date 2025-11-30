/**
 * WalletConnect Component
 * 
 * Legacy wrapper that uses the new ConnectWalletButton component.
 * Maintained for backward compatibility with existing code that imports
 * from this path.
 * 
 * NOTE: The wallet connection UI has been simplified to only support
 * Base network (EVM/WalletConnect v2). Algorand/Pera wallet support
 * has been disabled. See ConnectWalletButton.jsx and WalletModal.jsx
 * for details.
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
