import { FC } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import RemoveCircleOutlineOutlined from '@mui/icons-material/RemoveCircleOutlineOutlined'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'

interface Props {
  counter: number;
  setCounter: (value: number) => void
  maxValue: number
}

export const ItemCounter: FC<Props> = ({ counter, setCounter, maxValue }) => {

  const changeCountItem = (isIncrement: boolean) => {
    let countValue = counter
    if (counter <= 0 && !isIncrement) return;
    if (counter >= maxValue && isIncrement) return;
    isIncrement ? setCounter( countValue+1 ) : setCounter( countValue-1 )
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={ () => changeCountItem(false) }>
        <RemoveCircleOutlineOutlined />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center'}}>{counter}</Typography>
      <IconButton onClick={ () => changeCountItem(true) }>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
