/* eslint-disable @typescript-eslint/no-var-requires */
const { ethers, formatEther, randomBytes } = require('ethers');
const { config } = require('dotenv');
const { namehash } = require('viem');
const axios = require('axios'); // Don't forget to import axios for the API call
config();

// Configuration
const provider = new ethers.JsonRpcProvider(
  'https://base-sepolia.g.alchemy.com/v2/EnZ53opyeEzx8FEyZQXYWZjDISblGviH',
);
const privateKey = process.env.TESTKEY; // Your Ethereum private key
const wallet = new ethers.Wallet(privateKey, provider);

// ABI for ETHRegistrarController
const ETHRegistrarController_ABI = [
  'function rentPrice(string name, uint duration) view returns (uint)',
  'function available(string name) view returns (bool)',
  'function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] calldata data, bool reverseRecord, uint16 ownerControlledFuses) pure returns (bytes32)',
  'function commit(bytes32 commitment)',
  'function register(string calldata name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] calldata data, bool reverseRecord, uint16 ownerControlledFuses) payable',
];

// Contract address of the ETHRegistrarController
const ETHRegistrarController_ADDRESS =
  '0x75A5FbE3Fd2d45Ef9e8B97C15c3BF80468257258';
const resolverAddress = '0x45B7eE3935d0EcE3B6C1b8D6526e6a527EC79220'; // PublicResolver Contract

const controllerContract = new ethers.Contract(
  ETHRegistrarController_ADDRESS,
  ETHRegistrarController_ABI,
  wallet,
);

// ABI for PublicResolver
const PublicResolver_ABI = [
  'function multicall(bytes[] data) public returns (bytes[] memory results)',
  'function setAddr(bytes32 node, address addr) public',
  'function setText(bytes32 node, string key, string value) public',
];

const resolverContract = new ethers.Contract(
  resolverAddress,
  PublicResolver_ABI,
  wallet,
);

async function registerENS(
  name,
  ownerAddress,
  durationInYears,
  resolverAddress,
  reverseRecord = true,
  ownerControlledFuses = 0,
) {
  try {
    // Step 1: Check if the name is available
    const isAvailable = await controllerContract.available(name);
    if (!isAvailable) {
      console.log(`${name}.story is already taken.`);
      return;
    }

    // Step 2: Calculate rent price
    const duration = durationInYears * 365 * 24 * 60 * 60; // Convert years to seconds
    const price = await controllerContract.rentPrice(name, duration);

    console.log(
      `The cost of registering ${name}.story for ${durationInYears} years is ${formatEther(price)} ETH`,
    );
    console.log(namehash(`${name}.story`));

    // Step 5: Prepare multicall to set multiple records
    const storyNameHash = namehash(`${name}.story`);
    const setAddrCallData = resolverContract.interface.encodeFunctionData(
      'setAddr',
      [storyNameHash, ownerAddress],
    );
    const setTextCallData = resolverContract.interface.encodeFunctionData(
      'setText',
      [storyNameHash, 'email', 'example@example.com'],
    );

    const multicallData = [setAddrCallData, setTextCallData];
    console.log('multicallData:', multicallData);

    // Step 3: Make a commitment
    const secret = randomBytes(32); // Generate a random secret
    const commitment = await controllerContract.makeCommitment(
      name,
      ownerAddress,
      duration,
      secret,
      resolverAddress,
      multicallData,
      reverseRecord,
      ownerControlledFuses,
    );
    const commitTx = await controllerContract.commit(commitment);
    await commitTx.wait();

    console.log(`Commitment sent for ${name}.story`);

    // Step 4: Wait for at least 1 minute before registering
    console.log('Waiting for 1 minute before proceeding to registration...');
    await new Promise((r) => setTimeout(r, 60000)); // Wait for 1 minute

    // Step 6: Register the ENS name
    const registerTx = await controllerContract.register(
      name,
      ownerAddress,
      duration,
      secret,
      resolverAddress,
      multicallData,
      reverseRecord,
      ownerControlledFuses,
      {
        value: price,
      },
    );
    const receipt = await registerTx.wait();
    console.log(
      `Successfully registered ${name}.story for ${durationInYears} years`,
    );

    // Step 7: Retrieve the tokenId from the transaction receipt
    console.log('=== receipt: ', receipt);
    const tokenId = await getTokenIdFromTransaction(receipt.hash);
    if (tokenId) {
      await sendMetadataToAPI(tokenId, `${name}.story`);
    }
  } catch (error) {
    console.error('Error registering ENS name:', error);
  }
}

async function getTokenIdFromTransaction(txHash) {
  const txReceipt = await provider.getTransactionReceipt(txHash);

  // The event signature we're looking for
  const eventSignature =
    '0x8ce7013e8abebc55c3890a68f5a27c67c3f7efa64e584de5fb22363c606fd340';

  for (const log of txReceipt.logs) {
    if (log.topics[0] === eventSignature) {
      // tokenId (node) is in topics[1]
      const tokenId = log.topics[1].toLowerCase();
      console.log(`Token ID: ${tokenId}`);
      return tokenId;
    }
  }

  console.log('Event not found in transaction.');
  return null;
}

async function sendMetadataToAPI(tokenId, name) {
  try {
    const response = await axios.post(
      'https://storyname-server.onrender.com/metadata',
      {
        tokenId: tokenId,
        name: name,
        description: name,
        image:
          'https://rose-occupational-bee-58.mypinata.cloud/ipfs/QmX8HMKPqvLNFSdUEkBKtK1pYtvQfLWwQxe7PCkxiDsePp',
        url: 'test.xyz',
      },
    );

    console.log(`Metadata POST request successful:`, response.data);
  } catch (error) {
    console.error('Error sending metadata to API:', error);
  }
}

// Usage example
const name = 'hayden888'; // The ENS name you want to register (without .story)
const ownerAddress = '0xF223263DaF73f36dF880586d107C0e1A2A6d87e6'; // Your Ethereum address
const durationInYears = 1; // Number of years to register the name for

registerENS(name, ownerAddress, durationInYears, resolverAddress);
