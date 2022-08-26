import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLOURS, Items } from '../Database'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'

const MyCart = ({ navigation }) => {

  const [product, setProduct] = useState()
  const [total, setTotal] = useState(null)

  useEffect(()=> {
    const unsubscribe = navigation.addListener('focus', ()=> {
      getDataFromDB();
    });

      return unsubscribe
  },[navigation])

  const getDataFromDB = async()=> {
    let items = await AsyncStorage.getItem('cartItems')
    items = JSON.parse(items)
    let productData = [];
    if(items) {
      Items.forEach(data=> {
        if(items.includes(data.id)) {
          productData.push(data)
          return 
        }
      });
      setProduct(productData)
      getTotal(productData)
    } else {
      setProduct(false)
      getTotal(false)
    }

  }

  const getTotal = (productData) => {
    let total = 0
    for(let i = 0; i < productData.length; i++) {
      let productPrice = productData[i].productPrice;
      total = total + productPrice
    }
    setTotal(total)
  }

  const removeItemFromCart = async(id) => {
    let itemArray = await AsyncStorage.getItem('cartItems')
    itemArray = JSON.parse(itemArray)
    if(itemArray) {
      let array = itemArray
      for(let i = 0; i < array.length; i++) {
        if(array[i] == id) {
          array.splice(i,1)

          await AsyncStorage.setItem('cartItems', JSON.stringify(array))
          getDataFromDB();
        }
      }
    }
  }

  const renderProduct = (data,ind)=> {
    return(
      <TouchableOpacity 
      onPress={() => navigation.navigate('ProductInfo', {productID: data.id})}
        style={{width: '100%', height: 100, marginVertical: 6, flexDirection: 'row', alignItems: 'center'}}
        key={ind}
      >
        <View style={styles.cartView}>
          <Image 
            source={data.productImage}
            style={styles.imgStyle}
          />
        </View>
        <View style={styles.prodNameContainer}>
          <View style={styles.prodNameView}>
            <Text style={styles.productName}>
              {data.productName}
            </Text>
            <View style={styles.prodPriceView}>
              <Text style={styles.prodPrice}>
                💲{data.productPrice}
              </Text>
              <Text>
                (💲~{data.productPrice + data.productPrice / 20})
              </Text>
            </View>
          </View>
          <View style={styles.minusContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.minusView}>
                <Entypo 
                  name='minus'
                  style={styles.minusIcon}
                />
              </View>
              <Text>1</Text>
              <View style={styles.plusView}>
                <Entypo 
                  name='plus'
                  style={styles.minusIcon}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={()=> removeItemFromCart(data.id)}
            >
              <Entypo 
                name='trash'
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const checkOut = async () => {
    try {
      await AsyncStorage.removeItem('cartItems')
    } catch (err) {
      return err;
    }

    ToastAndroid.show('Items Will be Delivered SOON!', ToastAndroid.SHORT)
    navigation.navigate('Home')
  }

  return (
    <View style={styles.cartContainer}>
      <ScrollView>
        <View style={styles.chevView}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Entypo 
              name='chevron-left'
              style={styles.chevIcon}
            />
          </TouchableOpacity>
          <Text style={styles.orderDetail}>
            Order Details
          </Text>
          <View></View>
        </View>
        <Text style={styles.myCart}>
          My Cart
        </Text>
        <View style={{paddingHorizontal: 16}}>
          {
            product ? product.map(renderProduct) : null
          }
        </View>
        <View>
          <View style={styles.DeliveryView}>
            <Text style={styles.Delivery}>
              Delivery Location
            </Text>
            <View style={styles.truckContainer}>
              <View style={styles.truckView}>
                <View style={styles.truckWrapper}>
                  <Feather
                    name='truck'
                    style={styles.truckIcon}
                  />
                </View>
                <View>
                  <Text style={styles.locationHead}>25 Madint Nasr ,ElHaY Elsabaa</Text>
                  <Text style={styles.locationEnd}>Cairo, Egypt.</Text>
                </View>
              </View>
              <Entypo
                name='chevron-right'
                style={styles.chevronIcon}
              />
            </View>
          </View>
          <View style={styles.DeliveryView}>
            <Text style={styles.Delivery}>
              Payment Method
            </Text>
            <View style={styles.truckContainer}>
              <View style={styles.truckView}>
                <View style={styles.truckWrapper}>
                  <Text
                    style={{fontSize: 10, fontWeight:'900', color: COLOURS.blue, letterSpacing: 1}}>
                    VISA
                  </Text>
                </View>
                <View>
                  <Text style={styles.locationHead}>Visa Classic</Text>
                  <Text style={styles.locationEnd}>****--9845</Text>
                </View>
              </View>
              <Entypo
                name='chevron-right'
                style={styles.chevronIcon}
              />
            </View>
          </View>
          <View style={{
            paddingHorizontal: 16,
            marginTop: 40,
            marginBottom: 80,
          }}>
            <Text style={styles.Delivery}>
              Order Info
            </Text>
            <View 
              style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
              <Text style={styles.locationEnd}>Subtotal</Text>
              <Text style={styles.locationEnd}>💲 {total}</Text>
            </View>
            <View 
              style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
              <Text style={styles.locationEnd}>Shipping Tax</Text>
              <Text style={styles.locationEnd}>💲 {total / 20}</Text>
            </View>
            <View 
              style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
              <Text style={styles.locationEnd}>Total</Text>
              <Text style={styles.totalEnd}>💲 {total + total / 20}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{
        position: 'absolute',
        bottom: 10,
        height: '8%',
        width:  '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          style={styles.availableContainer}
          onPress={() => (total !=0 ? checkOut() : null)}
        >
          <Text style={styles.availableTxt}>
            CHECKOUT 💲 {total + total / 20}
            {/* CHECKOUT 💲 Total */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MyCart

const styles = StyleSheet.create({
  cartContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOURS.white,
    position: 'relative' 
  },
  chevIcon: {
    fontSize: 18,
    color: COLOURS.backgroundDark,
    padding: 12,
    backgroundColor: COLOURS.backgroundLight,
    borderRadius: 12,
  },
  chevView: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderDetail: {
    fontSize: 15,
    color: COLOURS.black,
    fontWeight: '500'
  },
  myCart: {
    fontSize: 20,
    color: COLOURS.black,
    fontWeight: '500',
    letterSpacing: 1,
    paddingTop: 20,
    paddingLeft: 16,
    marginBottom: 10,
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  cartView: {
    width: '30%',
    height: 100,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.backgroundLight,
    borderRadius: 10,
    marginRight: 22,
  },
  productName: {
    fontSize: 15,
    maxWidth: '100%',
    color: COLOURS.black,
    fontWeight: '400',
    letterSpacing: 1,
  },
  prodNameContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-around'
  },
  prodNameView: {

  },
  prodPriceView: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6
  },
  prodPrice: {
    fontSize: 15,
    fontWeight: '400',
    maxWidth: '85%',
    marginRight: 4,
  },
  minusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },  
  minusView:{
    borderRadius: 100,
    marginRight: 20,
    padding: 4,
    borderWidth: 1,
    backgroundColor: COLOURS.backgroundLight,
    opacity: 0.5,
  },
  plusView:{
    borderRadius: 100,
    marginLeft: 20,
    padding: 4,
    borderWidth: 1,
    backgroundColor: COLOURS.backgroundLight,
    opacity: 0.5,
  },
  minusIcon: {
    fontSize: 16,
    color: COLOURS.backgroundDark
  }, 
  deleteIcon: {
    fontSize: 15,
    fontWeight: '400',
    color: COLOURS.backgroundDark,
    backgroundColor: COLOURS.backgroundLight,
    padding: 8,
    borderRadius: 100,
  },
  DeliveryView: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  Delivery: {
    fontSize: 17,
    color: COLOURS.black,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 20,
  },
  truckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  truckView: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
  },
  truckWrapper: {
    color: COLOURS.blue,
    backgroundColor: COLOURS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginRight: 18
  },
  truckIcon: {
    fontSize: 18,
    color: COLOURS.blue
  },  
  locationHead: {
    fontSize: 16,
    color: COLOURS.black,
    fontWeight: '500'
  },
  locationEnd: {
    fontSize: 16,
    color: COLOURS.black,
    fontWeight: '500',
    lineHeight: 20,
    opacity: 0.5,
  },
  chevronIcon: {
    fontSize: 22,
    color: COLOURS.black,
  },
  totalEnd: {
    fontSize: 18,
    fontWeight: '500',
    color: COLOURS.black,
  },
  availableContainer: {
    width: '85%',
    height: '90%',
    backgroundColor: COLOURS.blue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  availableTxt: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: COLOURS.white,
    textTransform: 'uppercase'
  },
})