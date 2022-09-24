import {FC} from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import RemoveCircleOutlineOutlined from '@mui/icons-material/RemoveCircleOutlineOutlined'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'

interface Props {

}

export const ItemCounter: FC<Props> = () => {
  return (
    <Box display='flex' alignItems='center'>
      <IconButton>
        <RemoveCircleOutlineOutlined />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center'}}>1</Typography>
      <IconButton>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
