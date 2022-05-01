import { EditRounded } from '@mui/icons-material';
import { Avatar, AvatarProps, Badge, Dialog, DialogTitle, IconButton, styled } from '@mui/material';
import React from 'react';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  '& .MuiAvatar-img': {
    borderRadius: 100,
    border: 'solid 5px',
    borderColor: theme.palette.secondary.main,
  },
}));

const StyledBadge = styled(Badge, {
  shouldForwardProp: prop => prop !== 'inactive',
})<{ inactive: boolean }>(({ theme, inactive }) => ({
  '& .MuiButtonBase-root': {
    borderRadius: 100,
    backgroundColor: theme.palette.grey[300],
    transition: '0.2s',
    ...(!inactive && {
      '&:hover': {
        backgroundColor: theme.palette.grey[400],
      },
    }),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.8rem',
  },
}));

export interface IImageUpload {
  file: Blob | null;
  // previewURL: string | ArrayBuffer;
  previewURL: string | null;
}

export interface AvatarInputProps extends AvatarProps {
  handleUpload: (imageUpload: IImageUpload) => any;
}

const DEFAULT_AVATAR = 'src/app/../assets/images/user-default.png';

const AvatarInput = ({ alt, src, handleUpload, ...other }: AvatarInputProps) => {
  if (!src) {
    src = DEFAULT_AVATAR;
  }

  const [imageUpload, setImageUpload] = React.useState<IImageUpload>({ file: null, previewURL: src });

  React.useEffect(() => {
    setImageUpload({ file: null, previewURL: src });
  }, [src, setImageUpload]);

  React.useEffect(() => {
    if (imageUpload.file) {
      handleUpload(imageUpload);
    }
  }, [imageUpload, handleUpload]);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setImageUpload({
        file,
        previewURL: reader.result.toString(),
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <StyledBadge
        inactive={false}
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <label htmlFor="contained-button-file">
            <input accept="image/*" id="contained-button-file" type="file" onChange={handleUploadImage} style={{ display: 'none' }} />
            <IconButton color="primary" component="span" size="small">
              <EditRounded fontSize="small" />
            </IconButton>
          </label>
        }
      >
        <StyledAvatar alt={alt} src={imageUpload.previewURL} {...other} />
      </StyledBadge>
    </>
  );
};

export default AvatarInput;
