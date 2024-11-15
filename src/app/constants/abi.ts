export const ETHAY_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdtTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_verifyWorldID',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_entropyAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'ipfsLink',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'ProductCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_quantity',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_ipfsLink',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_description',
        type: 'string',
      },
    ],
    name: 'createProduct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registerAsSeller',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
export const WLD_ID_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'signal',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'root',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nullifierHash',
        type: 'uint256',
      },
      {
        internalType: 'uint256[8]',
        name: 'proof',
        type: 'uint256[8]',
      },
    ],
    name: 'verifyHuman',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
