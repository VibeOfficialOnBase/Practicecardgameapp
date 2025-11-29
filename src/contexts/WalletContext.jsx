/**
 * WalletContext - Legacy export
 * 
 * This file re-exports from the new web3/WalletContext.jsx for backward
 * compatibility. All wallet functionality has been moved to src/web3/
 * for better organization.
 * 
 * @deprecated Import from '@/web3/WalletContext' instead
 */

export { WalletProvider, useWallet } from '@/web3/WalletContext';
