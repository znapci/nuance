import {
  Box,
  Divider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import Contact from './Contact'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import ContactDiscovery from './ContactDiscovery'
import { useEffect, useState } from 'react'
import FriendRequest from './FriendRequest'

const ContactList = ({ contacts, socket, friendRequests }) => {
  const [contactDisc, setContactDisc] = useState(false)
  const [localContacts, setLocalContacts] = useState(contacts)

  const borderColor = useColorModeValue('white', 'gray.700')
  const searchTextColor = useColorModeValue('gray.700', 'gray.200')

  const selfId = useSelector(state => state.auth.session.id)
  const activeChatId = useSelector(state => state.lounge.activeChatMeta.id)

  useEffect(() => {
    setLocalContacts(contacts)
  }, [contacts])

  const handleChange = e => {
    const searchQuery = e.target.value.toLowerCase()
    if (searchQuery.length > 0) {
      setLocalContacts(
        contacts.filter(
          c => c.name.toLowerCase().includes(searchQuery) || c.id.toLowerCase().includes(searchQuery)
        )
      )
    } else {
      setLocalContacts(contacts)
    }
  }

  const CL = localContacts?.map((contact, id) => {
    const isActiveChat = contact.id === activeChatId
    return (
      contact.id !== selfId && (
        <Contact
          isActiveChat={isActiveChat}
          key={id}
          id={contact.id}
          name={contact.name}
          peerId={contact.peerId}
        />
      )
    )
  })

  const FR = friendRequests?.map((friendRequest, idx) => {
    return (
      <FriendRequest
        socket={socket}
        key={idx}
        sender={friendRequest.sender}
        id={friendRequest._id}
        reciever={friendRequest.reciever}
      />
    )
  })

  return contactDisc
    ? (
      <ContactDiscovery
        socket={socket}
        contacts={contacts}
        setContactDisc={setContactDisc}
      />
      )
    : (
      <Flex minW='35vw' grow={['1', null, '0']}>
        <Flex
          grow='1'
          overflow='hidden'
          rounded={['sm', null, 'xl']}
          mr={[0, null, 3]}
          boxShadow='xl'
          position='relative'
        >
          <Box
            position='absolute'
            bottom='12px'
            right='12px'
            zIndex={1}
            borderRadius='50%'
            overflow='hidden'
          >
            <IconButton
              aria-label='Find contacts'
              size='lg'
              colorScheme='green'
              icon={<AddIcon />}
              isRound
              variant='solid'
              onClick={() => setContactDisc(true)}
            />
          </Box>
          <Flex
            grow='1'
            rounded='xl'
            backgroundColor={borderColor}
            flexDir='column'
          >
            <Flex p={[2, null, 3]} w='100%'>
              <InputGroup rounded='lg' overflow='hidden' bg='transparent'>
                <InputLeftElement pointerEvents='none'>
                  <SearchIcon color='gray.500' />
                </InputLeftElement>
                <Input
                  onChange={handleChange}
                  _focus={{ boxShadow: 'none' }}
                  border='none'
                  color={searchTextColor}
                  type='tel'
                  placeholder='Search away!'
                  rounded='lg'
                  overflow='hidden'
                />
              </InputGroup>
            </Flex>
            <Divider />
            <Flex flexDir='column' overflow='auto'>
              {FR}
              {CL}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      )
}

export default ContactList
