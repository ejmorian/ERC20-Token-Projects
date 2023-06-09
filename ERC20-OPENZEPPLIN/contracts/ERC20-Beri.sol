// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error Beri__UnAuthorised();
error Beri__InsufficientMaxSupply(uint256 remainder);

contract Beri is ERC20 {
    modifier OnlyCreator() {
        if (msg.sender != _creator) {
            revert Beri__UnAuthorised();
        }
        _;
    }

    uint256 public constant _maxSupply = 1e15 * 1e18;
    address private immutable _creator;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _creator = msg.sender;
        mint(1e18);
    }

    function _mint(
        address account,
        uint256 amount
    ) internal override OnlyCreator {
        if (totalSupply() + amount < _maxSupply) {
            super._mint(account, amount);
        } else {
            uint256 remaining = _maxSupply - totalSupply();
            revert Beri__InsufficientMaxSupply(remaining);
        }
    }

    function mint(uint256 amount) public {
        address account = msg.sender;
        _mint(account, amount);
    }
}
