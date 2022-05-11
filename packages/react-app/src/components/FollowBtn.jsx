import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

const cyberConnect = new CyberConnect({
  namespace: "CyberConnect-Scaffold-Eth",
  env: Env.STAGING,
  chain: Blockchain.ETH,
  provider: window.ethereum,
});

function FollowButton({ targetAddress, isFollowing }) {
  const handleOnClick = async () => {
    try {
      if (isFollowing) {
        await cyberConnect.disconnect(targetAddress);
        alert(`Success: you've unfollowed ${targetAddress}!`);
      } else {
        await cyberConnect.connect(targetAddress);
        alert(`Success: you're following ${targetAddress}!`);
      }
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button className="followButton" onClick={handleOnClick} style={{ background: "gray" }}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;