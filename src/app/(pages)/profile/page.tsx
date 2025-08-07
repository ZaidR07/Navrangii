"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Heart, User, MapPin, Phone, Mail, Edit3 } from "lucide-react";
import { useGetProfile, useUpdateProfile } from '@/hooks/user/useProfile';
import { useAuth } from '@/context/UserContext';
import Cookies from 'js-cookie';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { useWishlist } from '@/hooks/wishlist/useWishlist';

import AddressManager from '@/components/profile/AddressManager';

interface Address {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  addresses?: Address[];
  email: string;
}

const WishlistContent = () => {
  const { user } = useAuth();
  const email = Cookies.get('userEmail');
  
  const { data: wishlistData, isLoading, isError, error, refetch } = useWishlist(email || '');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading wishlist</h3>
        <p className="mt-1 text-sm text-gray-500">{error?.message || 'Failed to load wishlist items'}</p>
        <div className="mt-6">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const wishlistItems = wishlistData?.wishlist || [];
  
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Save items that you like by clicking the heart icon on product pages</p>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlistItems.map((item: any) => (
        <WishlistItem 
          key={item.productId} 
          item={item} 
          onRemove={() => refetch()} 
        />
      ))}
    </div>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const { user } = useAuth();
  
  // Fetch user profile data using React Query
  // Email will be retrieved from cookie by the hook
  const { data: userProfile, isLoading, isError, error } = useGetProfile();
  
  // Mutation for updating profile
  const { mutate: updateProfile } = useUpdateProfile();

  const handleUpdateProfile = (data: Partial<UserProfile>) => {
    console.log('Updating profile with data:', data);
    const emailFromCookie = Cookies.get('userEmail');
    if (emailFromCookie) {
      // Ensure we're sending the correct data structure
      const updateData = {
        ...data,
        email: emailFromCookie
      };
      console.log('Sending update data:', updateData);
      updateProfile(updateData as UpdateProfileData);
      setIsEditing(false);
    }
  };

  const handleUpdateAddresses = (addresses: Address[]) => {
    const emailFromCookie = Cookies.get('userEmail');
    if (emailFromCookie) {
      updateProfile({ addresses, email: emailFromCookie } as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Header with tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'orders' 
                  ? 'border-purple-500 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Package className="h-5 w-5 mr-2" />
                Your Orders
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'wishlist' 
                  ? 'border-purple-500 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('wishlist')}
              >
                Wishlist
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' 
                  ? 'border-purple-500 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">📦</div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                <WishlistContent />
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                {userProfile ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        {isEditing ? 'Cancel' : (
                          <>
                            <span className="hidden md:inline">Edit Profile</span>
                            <span className="md:hidden inline-flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    {isEditing ? (
                      <EditProfileForm 
                        profile={userProfile} 
                        onUpdate={handleUpdateProfile} 
                        onCancel={() => setIsEditing(false)} 
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Full Name</label>
                              <p className="mt-1 text-sm text-gray-900">{userProfile.name}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email Address</label>
                              <p className="mt-1 text-sm text-gray-900">{userProfile.email}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                              <p className="mt-1 text-sm text-gray-900">{userProfile.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                          {userProfile.addresses && userProfile.addresses.length > 0 ? (
                            <div className="space-y-4">
                              {userProfile.addresses.map((address, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                  {address.isDefault && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                                      Default Address
                                    </span>
                                  )}
                                  <h4 className="font-medium text-gray-900">{address.title}</h4>
                                  <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                                  <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                                  <p className="text-gray-600 text-sm">{address.country}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No addresses saved yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">👤</div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No profile data</h3>
                    <p className="mt-1 text-sm text-gray-500">No profile information available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface EditProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
}

interface EditProfileFormData {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

const EditProfileForm = ({ profile, onUpdate, onCancel }: EditProfileFormProps) => {
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    addresses: profile.addresses || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
      <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <AddressManager 
            addresses={formData.addresses || []} 
            onUpdateAddresses={(addresses) => setFormData(prev => ({ ...prev, addresses }))} 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
