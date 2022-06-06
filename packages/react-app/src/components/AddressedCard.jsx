import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'

export default function AddressedCard({ badges }) {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          background:
            'linear-gradient(to right, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
          padding: '2px',
          borderRadius: 5,
        }}
        maxWidth={300}
      >
        {badges.map(badge => {
          const src = 'https://remix-project.mypinata.cloud/ipfs/' + badge.decodedIpfsHash
          console.log({ currentBadge: badge })
          return (
            <Card key={badge.decodedIpfsHash} raised sx={{ zIndex: 10, borderRadius: 5 }} variant={'outlined'}>
              <CardMedia component={'img'} width={200} image={src} alt={'nftimage'} />
              <CardContent
                sx={{
                  background:
                    'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
                }}
              >
                <Typography variant={'h5'} fontWeight={700} color={'#333333'}>
                  {badge.tokenType} {badge.payload}
                </Typography>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </>
  )
}
