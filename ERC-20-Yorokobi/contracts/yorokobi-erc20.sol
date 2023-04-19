// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error Yorokobi__TransactionFailed();
error Yorokobi__InsufficientFunds();

contract Yorokobi {
    string private constant s_name = "Yorokobi";
    string private constant s_symbol = "YRKB";
    uint8 private constant s_decimals = 0;
    uint256 private constant s_totalSupply = 1e15;
    mapping(address => uint) private balances;

    constructor() {}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function name() public pure returns (string memory) {
        return s_name;
    }

    function symbol() public pure returns (string memory) {
        return s_symbol;
    }

    function decimals() public pure returns (uint8) {
        return s_decimals;
    }

    function totalSupply() public pure returns (uint256) {
        return s_totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        address _from = msg.sender;

        if (balanceOf(msg.sender) > _value) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;

            emit Transfer(_from, _to, _value);
            return (success);
        } else {
            revert Yorokobi__InsufficientFunds();
        }
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {}

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {}

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256 remaining) {}
}
