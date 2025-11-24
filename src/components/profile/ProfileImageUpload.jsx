import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfileImageUpload({ currentImageUrl, userProfile }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const uploadImage = useMutation({
    mutationFn: async () => {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
      if (userProfile?.id) {
        await base44.entities.UserProfile.update(userProfile.id, {
          profile_image_url: file_url
        });
      } else {
        await base44.entities.UserProfile.create({
          profile_image_url: file_url
        });
      }
      return file_url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploading(false);
    },
    onError: () => {
      setUploading(false);
    }
  });

  const removeImage = useMutation({
    mutationFn: async () => {
      if (userProfile?.id) {
        await base44.entities.UserProfile.update(userProfile.id, {
          profile_image_url: null
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="relative w-32 h-32 mx-auto">
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
            {userProfile?.display_name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !uploading && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-organic p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold ensure-readable-strong">Profile Picture</h3>
                <button
                  onClick={() => !uploading && setShowModal(false)}
                  disabled={uploading}
                  className="text-label hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover border-4 border-purple-500 shadow-xl"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => uploadImage.mutate()}
                      disabled={uploading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>

                  {currentImageUrl && (
                    <Button
                      onClick={() => {
                        removeImage.mutate();
                        setShowModal(false);
                      }}
                      variant="outline"
                      className="w-full text-red-400 border-red-400/30 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Current Picture
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}