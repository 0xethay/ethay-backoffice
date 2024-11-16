'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { ETHAY_ABI } from '@/app/constants/abi';
import { CONTRACT_ADDRESSES } from '@/app/constants/contract';
export default function CreateProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
  });

  const [ipfsHash, setIpfsHash] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(true);

      try {
        const hash = await uploadToIPFS(file);
        setIpfsHash(hash);
      } catch (error) {
        console.error('Failed to upload file:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log(process.env.NEXT_PUBLIC_PINATA_API_KEY);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload to IPFS');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!ipfsHash) {
        alert('Please upload an image before proceeding.');
        return;
      }

      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it to continue.');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.BaseSepolia.ETHAY,
        ETHAY_ABI,
        signer
      );

      const mintResult = await contract.createProduct(
        formData.name,
        ethers.parseUnits(formData.price, 18), // Convert price to wei
        formData.quantity,
        ipfsHash,
        formData.description,
        { gasLimit: 500000 }
      );

      console.log(
        '        ethers.parseUnits(formData.price, 11)',
        ethers.parseUnits(formData.price, 18)
      );

      const receipt = await mintResult.wait();
      console.log('receipt', receipt);
    } catch (error) {
      console.error('Error during minting:', error);
      alert('Error during minting. Check console for details.');
    }
  };

  const handleRegisterAsSeller = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it to continue.');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.BaseSepolia.ETHAY,
        ETHAY_ABI,
        signer
      );

      const registerResult = await contract.registerAsSeller({
        gasLimit: 500000,
      });
      const receipt = await registerResult.wait();
      console.log('Seller registered:', receipt);
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Check console for details.');
    }
  };

  return (
    <div
      style={{ backgroundColor: '#3e307b' }}
      className='min-h-screen flex flex-col'
    >
      <div className='flex-grow max-w-4xl mx-auto px-8 py-12'>
        <h2 className='font-display text-xl uppercase tracking-wider text-text-primary mb-6 text-center'>
          Create Product
        </h2>
        <form className='space-y-8' onSubmit={handleSubmit}>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-text-secondary mb-0'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-prime-gray border border-prime-gold/20 
                       rounded text-black placeholder-text-secondary/50
                       focus:outline-none focus:border-prime-gold/40
                       transition-all duration-300 mt-0'
              placeholder='e.g., My Property'
              required
            />
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-text-secondary mb-0'>
              Price
            </label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-prime-gray border border-prime-gold/20 
                       rounded text-black placeholder-text-secondary/50
                       focus:outline-none focus:border-prime-gold/40
                       transition-all duration-300 mt-0'
              placeholder='e.g., 250,000'
              required
            />
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-text-secondary mb-0'>
              Quantity
            </label>
            <input
              type='number'
              name='quantity'
              value={formData.quantity}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-prime-gray border border-prime-gold/20 
                       rounded text-black placeholder-text-secondary/50
                       focus:outline-none focus:border-prime-gold/40
                       transition-all duration-300 mt-0'
              placeholder='e.g., 100'
              required
            />
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-text-secondary mb-0'>
              IPFS File
            </label>
            <input
              type='file'
              onChange={handleFileChange}
              className='w-full px-4 py-2 bg-prime-gray border border-prime-gold/20 
                       rounded text-black placeholder-text-secondary/50
                       focus:outline-none focus:border-prime-gold/40
                       transition-all duration-300 mt-0'
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt='Selected file preview'
                className='mt-4 max-w-full h-auto'
              />
            )}
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-text-secondary mb-0'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-prime-gray border border-prime-gold/20 
                       rounded text-black placeholder-text-secondary/50
                       focus:outline-none focus:border-prime-gold/40
                       transition-all duration-300 mt-0'
              placeholder='e.g., Description of the property'
              required
            />
          </div>
          <button
            type='submit'
            disabled={isUploading || !ipfsHash}
            className={`w-full px-8 py-4 bg-prime-gray border border-prime-gold/20
              ${isUploading || !ipfsHash 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:border-prime-gold/40'
              } text-text-primary rounded
              transition-all duration-300 uppercase tracking-wider mt-6`}
          >
            {isUploading ? 'Uploading...' : 'Submit'}
          </button>
          <button
            type='button'
            onClick={handleRegisterAsSeller}
            className='w-full px-8 py-4 bg-prime-gray border border-prime-gold/20
              hover:border-prime-gold/40 text-text-primary rounded
              transition-all duration-300 uppercase tracking-wider mt-6'
          >
            Register as Seller
          </button>
        </form>
      </div>
    </div>
  );
}
