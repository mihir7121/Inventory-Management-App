'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, useMediaQuery } from '@mui/material'
import { firestore } from '@/firebase'
import styles from "./page.module.css"
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 400,
  bgcolor: 'white',
  color: 'white',
  border: '2px solid #000',
  borderRadius: '5px',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  // We'll add our component logic here
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    // Filter inventory based on the search query
    setFilteredInventory(
      inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, inventory])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  // Modal Control Functions
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Check if screen size is small
  const isSmallScreen = useMediaQuery('(max-width:600px)')

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      className={styles.center}
      padding={isSmallScreen ? 2 : 0}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box
        border={'2px solid #333'}
        borderRadius={'15px'}
        width={isSmallScreen ? '90%' : '800px'}
      >
        <Box
          width="100%"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Box
          width="100%"
          display={'flex'}
          justifyContent={'space-between'}
          paddingX={5}
          paddingY={2}
          bgcolor={'#f0f0f0'}
        >
          <Typography
            variant={'h6'}
            color={'#333'}
            style={{
              width: isSmallScreen ? '40%' : '37%',
              textAlign: 'left',
            }}
          >
            Item Name
          </Typography>
          <Typography
            variant={'h6'}
            color={'#333'}
            style={{
              width: isSmallScreen ? '40%' : '30%',
              textAlign: 'left',
            }}
          >
            Quantity
          </Typography>
          <Box
            width={isSmallScreen ? '100%' : '40%'}
            display="flex"
            justifyContent="flex-end"
          >
            <TextField
              id="search-bar"
              variant="outlined"
              placeholder="Search items"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth={isSmallScreen}
            />
          </Box>
        </Box>
        <Stack
          width="100%"
          marginTop="25px"
          maxWidth={isSmallScreen ? '90%' : '800px'}
          height="330px"
          spacing={2}
          overflow={'auto'}
          className={styles.customScrollbar}
        >
          {filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              
              // minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              paddingX={5}
            >
              <Typography
                variant="h5"
                color="#ccc"
                textAlign="left"
                style={{
                  width: isSmallScreen ? '40%' : '40%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h5"
                color="#ccc"
                textAlign="left"
                style={{ width: isSmallScreen ? '20%' : '20%' }}
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2} style={{ width: '40%' }}>
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
