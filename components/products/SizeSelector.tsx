import { FC } from 'react'
import { ISize } from '../../interfaces';
import { Box, Button } from '@mui/material';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  setSizeProduct: (size: ISize) => void
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, setSizeProduct }) => {
  return (
    <Box>
      {
        sizes.map( (size: ISize) => (
          <Button
            onClick={ () => setSizeProduct(size) }
            key={size}
            size='small'
            color={ selectedSize === size ? 'primary': 'info' }
          > 
            { size }
          </Button>
        ))
      }
    </Box>
  )
}
