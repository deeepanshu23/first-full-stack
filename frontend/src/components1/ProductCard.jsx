import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Heading, HStack, IconButton, Image, Modal, Text, useColorModeValue, useToast, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, Input, ModalFooter, Button } from '@chakra-ui/react'
import { useProductStore } from '@/store/product'
import { transform } from 'framer-motion'
import React, { useState } from 'react'

const ProductCard = ({product}) => {
    
    const toast = useToast();
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bg = useColorModeValue('white', 'gray.800');

    const [updatedProduct, setUpdatedProduct] = useState(product);
    const { deleteProduct, updateProduct } = useProductStore()
    const { isOpen, onOpen, onClose } = useDisclosure();

const handleDeleteProduct = async(pid) => {
    const { success, message } = await deleteProduct(pid)
    if(!success){
        toast({
          title: "Error",
          description: message,
          status: "Error",
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Success",
          description: message,
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      }
} 

const handleUpdateProduct = async(pid, updatedProduct) => {
    const { success, message } = await updateProduct(pid, updatedProduct)
    onClose();
    if(!success){
        toast({
          title: "Error",
          description: message,
          status: "Error",
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Success",
          description: "Product Updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      }
}
  return (
    <Box
    shadow={'lg'}
    rounded={'lg'}
    overflow={'hidden'}
    transition={'all 0.3s'}
    _hover={{transform: "translateY(-5px)", shadow: "xl"}}
    bg={bg}
    >
        <Image src={product.image} alt={product.name} h={40} w='full' objectFit='cover'/>
        <Box p={4}>
            <Heading as={'h3'} size={'md'} mb={2}>
                {product.name}
            </Heading>

            <Text fontWeight={'bold'} fontSize={'xl'} color={textColor} mb={4}>
                ${product.price}
            </Text>

            <HStack spacing={2}>
                <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme='blue'></IconButton>
                <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme='red'></IconButton>
            </HStack>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder='Product Name'
                                name='name'
                                 value={updatedProduct.name}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value})}
                            ></Input>
                            <Input
                                placeholder='Price'
                                name='price'
                                type='number'
                                value={updatedProduct.price}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value})}
                            ></Input>
                            <Input
                                placeholder='Image URL'
                                name='image'
                                value={updatedProduct.image}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value})}
                            ></Input>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>
                        Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    </Box>
  )
}

export default ProductCard