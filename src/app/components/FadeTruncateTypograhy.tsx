import { styled, Typography, TypographyProps } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

export interface FadeTruncateTypograhyProps extends TypographyProps {
  variant: Variant;
  line: number;
}

const FadeTruncateTypograhy = styled(Typography, {
  shouldForwardProp: prop => prop !== 'line',
  name: 'FadeTruncateTextStyled',
  slot: 'Root',
})<FadeTruncateTypograhyProps>(({ theme, variant, line }) => ({
  position: 'relative',
  overflow: 'hidden',
  lineHeight: `${theme.typography[variant].lineHeight}rem`,
  // height: `${theme.typography[variant].lineHeight * (line - 1) + parseFloat(theme.typography[variant].fontSize.slice(0, -3))}rem`,
  height: `${(theme.typography[variant].lineHeight as number)* line}rem`,
  '&::after': {
    content: '""',
    textAlign: 'right',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '30%',
    height: `${theme.typography[variant].lineHeight}rem`,
    background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)',
  },
}));

export default FadeTruncateTypograhy;
