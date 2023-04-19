// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error Yorokobi__TransactionFailed();
error Yorokobi__InsufficientFunds();
error Yorokobi__UnAuthorisedRequest();

contract Yorokobi {
    mapping(address => uint) private s_balances;
    mapping(address => mapping(address => uint)) private s_allowances;
    string private constant c_name = "Yorokobi";
    string private constant c_symbol = "YRKBY";
    uint8 private constant c_decimals = 0;
    uint256 private constant c_totalSupply = 1e15;

    constructor() {
        s_balances[msg.sender] = c_totalSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function name() public pure returns (string memory) {
        return c_name;
    }

    function symbol() public pure returns (string memory) {
        return c_symbol;
    }

    function decimals() public pure returns (uint8) {
        return c_decimals;
    }

    function totalSupply() public pure returns (uint256) {
        return c_totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return s_balances[_owner];
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        address _from = msg.sender;

        if (balanceOf(msg.sender) >= _value) {
            s_balances[msg.sender] -= _value;
            s_balances[_to] += _value;

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
    ) public returns (bool success) {
        if (s_allowances[msg.sender][_from] >= 0) {
            s_balances[_from] -= _value;
            s_balances[_to] += _value;
            s_allowances[msg.sender][_from] -= _value;
            emit Transfer(_from, _to, _value);
            return true;
        } else {
            revert Yorokobi__UnAuthorisedRequest();
        }
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        if (balanceOf(msg.sender) >= _value) {
            s_allowances[_spender][msg.sender] = _value;
            emit Approval(msg.sender, _spender, _value);
            return true;
        } else {
            revert Yorokobi__TransactionFailed();
        }
    }

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256 remaining) {
        return remaining = s_allowances[_spender][_owner];
    }
}
