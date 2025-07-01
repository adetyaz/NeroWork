<script>
  import { getSigner, mintNFT } from '../utils/aaUtils';
  import { API_KEY, NERO_CHAIN_CONFIG } from '../config';

  let loading = $state(false);
  let txHash = $state('');

  const handleMint = async () => {
    try {
      loading = true;
      
      // Get signer from browser wallet
      const signer = await getSigner();
      
      // Define NFT metadata (can be fetched from form)
      const metadataUri = "ipfs://bafkreiabag3ztnhe5pg7js3cokbq3id2b3t6evbncbpzzh2c5sdioxngoe";
      
      // Execute the mint operation with sponsored gas
      const result = await mintNFT(
        signer,
        await signer.getAddress(), // Mint to the connected wallet
        metadataUri,
        0 // Replace 0 with the appropriate number if needed
      );
      
      txHash = result.transactionHash;
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT: " + error);
    } finally {
      loading = false;
    }
  };
</script>

<div class="minter-container">
  <button 
    onclick={handleMint}
    disabled={loading}
  >
    {#if loading}
     Minting...
     {:else}
     Mint NFT   
    {/if}
  
  </button>
  
  {#if txHash}
     <div class="tx-info">
      <p>Transaction successful!</p>
      <a 
        href={`${NERO_CHAIN_CONFIG.explorer}/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Explorer
      </a>
    </div>
  {/if}

</div>