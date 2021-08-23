//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenDistributor is Ownable, AccessControl {
    using SafeMath for uint256;
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    event tokenShareCompleted(uint256 amount, uint256 share, address from);
    event ethShareCompleted(uint256 amount, uint256 share);

    modifier isPermittedDistributor() {
        require(
            hasRole(DISTRIBUTOR_ROLE, msg.sender) || owner() == msg.sender,
            "Not an approved distributor"
        );
        _;
    }

    modifier isAdminOrOwner() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || owner() == msg.sender,
            "You can't perform admin actions"
        );
        _;
    }

    modifier hasValidUsers(address[] memory users) {
        require(users.length > 0 && users.length < 256, "Invalid users array");
        _;
    }

    modifier hasEnoughBalance(uint256 balance, uint256 amount) {
        require(balance >= amount, "Not enough token balance");
        _;
    }

    constructor(address admin) public {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DISTRIBUTOR_ROLE, msg.sender);
        // in case of deploying with a different account
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(DISTRIBUTOR_ROLE, admin);
    }

    function splitEth(address[] memory users, uint256 amount)
        public
        isPermittedDistributor
        hasValidUsers(users)
        hasEnoughBalance(address(this).balance, amount)
    {
        uint256 share = _handleDistribution(
            users,
            amount,
            address(this),
            address(0),
            false
        );

        emit ethShareCompleted(amount, share);
    }

    // split contract's own token
    function splitTokenBalance(
        address[] memory users,
        uint256 amount,
        ERC20 token
    )
        public
        isPermittedDistributor
        hasValidUsers(users)
        hasEnoughBalance(token.balanceOf(address(this)), amount)
    {
        uint256 share = _handleDistribution(
            users,
            amount,
            address(this),
            address(token),
            true
        );

        emit tokenShareCompleted(amount, share, address(token));
    }

    function splitTokenFromUser(
        address[] memory users,
        uint256 amount,
        ERC20 token
    )
        public
        isPermittedDistributor
        hasValidUsers(users)
        hasEnoughBalance(token.balanceOf(msg.sender), amount)
    {
        uint256 share = _handleDistribution(
            users,
            amount,
            msg.sender,
            address(token),
            true
        );

        emit tokenShareCompleted(amount, share, msg.sender);
    }

    function _handleDistribution(
        address[] memory users,
        uint256 amount,
        address from,
        address token,
        bool isToken
    ) private returns (uint256 share) {
        uint256 totalMembers = users.length;
        share = amount.div(totalMembers);

        for (uint256 i = 0; i < users.length; i++) {
            // if split token is requested, split from specified user
            if (isToken) {
                ERC20(token).transferFrom(from, users[i], share);
            } else {
                payable(users[i]).transfer(share); // else split eth
            }
        }
    }

    function addNewDistributor(address user) public isAdminOrOwner {
        grantRole(DISTRIBUTOR_ROLE, user);
    }

    function revokeDistributor(address user) public isAdminOrOwner {
        revokeRole(DISTRIBUTOR_ROLE, user);
    }
}
