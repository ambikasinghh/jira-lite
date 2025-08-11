import React from 'react';
import { Avatar, Badge, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { User } from '../../types';

interface UserAvatarProps {
  user: User;
  size?: 'small' | 'medium' | 'large';
  showUploadButton?: boolean;
  onPhotoUpload?: (file: File) => void;
}

const sizeMap = {
  small: { width: 32, height: 32, fontSize: '0.875rem' },
  medium: { width: 40, height: 40, fontSize: '1rem' },
  large: { width: 56, height: 56, fontSize: '1.25rem' },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'medium',
  showUploadButton = false,
  onPhotoUpload,
}) => {
  const { width, height, fontSize } = sizeMap[size];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onPhotoUpload) {
      onPhotoUpload(file);
    }
  };

  const avatar = (
    <Avatar
      src={user.photo}
      sx={{
        width,
        height,
        backgroundColor: user.avatarColor,
        color: 'white',
        fontSize,
        fontWeight: 'bold',
      }}
    >
      {!user.photo && user.initials}
    </Avatar>
  );

  if (showUploadButton) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <IconButton
            component="label"
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              width: 24,
              height: 24,
            }}
          >
            <PhotoCamera sx={{ fontSize: 14 }} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </IconButton>
        }
      >
        {avatar}
      </Badge>
    );
  }

  return avatar;
};