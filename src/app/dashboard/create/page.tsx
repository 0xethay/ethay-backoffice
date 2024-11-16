'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { ETHAY_ABI } from '@/app/constants/abi';
import { CONTRACT_ADDRESSES } from '@/contract/address';
import Ethay from '@/components/Ethay';

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
  const [isCreating, setIsCreating] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

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
    setIsCreating(true);
    setCreatedProductId(null);
    
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
        ethers.parseUnits(formData.price, 18),
        formData.quantity,
        ipfsHash,
        formData.description,
        { gasLimit: 500000 }
      );

      const receipt = await mintResult.wait();
      const id = receipt.logs[0].args[0];
      console.log('Product created with ID:', id);
      setCreatedProductId(id.toString());
      
      setFormData({
        name: '',
        price: '',
        quantity: '',
        description: '',
      });
      setIpfsHash('');
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error during minting:', error);
      alert('Error during minting. Check console for details.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-[#2C1F4A] to-[#3e307b]'>
      <div className='flex-grow max-w-4xl mx-auto px-8 py-12'>
        <h2 className='font-display text-2xl text-white/90 uppercase tracking-wider mb-8 text-center'>
          Create Product
        </h2>
        
        {createdProductId && (
          <div className='mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg'>
            <p className='text-green-400 text-center'>
              🎉 Product created successfully!
              <span className='block mt-2'>
                <Ethay type="web2" val={createdProductId} />
              </span>
            </p>
          </div>
        )}

        {isCreating && (
          <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm'>
            <div className='bg-white/10 p-6 rounded-lg border border-white/20 shadow-xl'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
                <p className='text-white text-sm'>Creating your product...</p>
              </div>
            </div>
          </div>
        )}

        <form className='space-y-8 bg-white/5 p-8 rounded-lg backdrop-blur-sm border border-white/10' onSubmit={handleSubmit}>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-white/80 mb-0'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 
                       rounded-lg text-white placeholder-white/30
                       focus:outline-none focus:border-white/40 focus:bg-white/20
                       transition-all duration-300 mt-0'
              placeholder='e.g., My Property'
              required
            />
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-white/80 mb-0'>
              Price
            </label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 
                       rounded-lg text-white placeholder-white/30
                       focus:outline-none focus:border-white/40 focus:bg-white/20
                       transition-all duration-300 mt-0'
              placeholder='e.g., 1'
              required
            />
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-white/80 mb-0'>
              Quantity
            </label>
            <input
              type='number'
              name='quantity'
              value={formData.quantity}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 
                       rounded-lg text-white placeholder-white/30
                       focus:outline-none focus:border-white/40 focus:bg-white/20
                       transition-all duration-300 mt-0'
              placeholder='e.g., 100'
              required
            />
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-white/80 mb-0'>
              IPFS File
            </label>
            <input
              type='file'
              onChange={handleFileChange}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 
                       rounded-lg text-white file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100
                       focus:outline-none focus:border-white/40
                       transition-all duration-300 mt-0'
              required
            />
            {imagePreview && (
              <div className='mt-4 rounded-lg overflow-hidden border border-white/20'>
                <img
                  src={imagePreview}
                  alt='Selected file preview'
                  className='w-full h-auto'
                />
              </div>
            )}
          </div>
          <div className='space-y-3'>
            <label className='block text-sm uppercase tracking-wider text-white/80 mb-0'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 
                       rounded-lg text-white placeholder-white/30
                       focus:outline-none focus:border-white/40 focus:bg-white/20
                       transition-all duration-300 mt-0 min-h-[100px]'
              placeholder='e.g., Description of the property'
              required
            />
          </div>
          <button
            type='submit'
            disabled={isUploading || !ipfsHash || isCreating}
            className={`w-full px-8 py-4 bg-violet-600 border border-violet-500
              ${
                isUploading || !ipfsHash || isCreating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-violet-700 hover:border-violet-600'
              } text-white rounded-lg
              transition-all duration-300 uppercase tracking-wider mt-6 font-semibold`}
          >
            {isUploading ? 'Uploading...' : isCreating ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
