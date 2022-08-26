import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, Animated, ToastAndroid } from 'react-native'
import React, { useEffect, useState} from 'react'
import { COLOURS, Items } from '../Database'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ProductInfo = ({ route,navigation }) => {
  const { productID } = route.params
  const [product, setProduct] = useState({})
  const width = Dimensions.get('window').width
  const scrollX = new Animated.Value(0)

  let position = Animated.divide(scrollX,width)

  useEffect(()=> {
    const unsubscribe = navigation.addListener('focus', ()=> {
      getDataFromDB();
    });

      return unsubscribe
  },[navigation])

  const getDataFromDB = async ()=> {
    for(let i = 0; i < Items.length; i++) {
      if(Items[i].id == productID) {
        await setProduct(Items[i])
        return;
      }
    }
  }

  const renderProduct = ({item, index})=> {
    return(
      <View style={{
        width: width,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Image 
          source={item}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain'
          }}
        />
      </View>
    )
  }

  const addToCart = async(id)=> {
    let itemArray = await AsyncStorage.getItem('cartItems')
    itemArray = JSON.parse(itemArray)
    if(itemArray) {
      let array = itemArray
      array.push(id)

      try {
        await AsyncStorage.setItem('cartItems', JSON.stringify(array));
        ToastAndroid.show(
          'Item Added Successfully to cart',
          ToastAndroid.SHORT
        );
        navigation.navigate('Home')
      } catch(err) {
        return err;
      }
    } else {
        let array = []
        array.push(id)

        try {
          await AsyncStorage.setItem('cartItems', JSON.stringify(array));
          ToastAndroid.show(
            'Item Added Successfully to cart',
            ToastAndroid.SHORT
          );
          navigation.navigate('Home')
        } catch(err) {
          return err
        }
    }
  }

  return (
    <View style={styles.prodView}>
      <StatusBar backgroundColor={COLOURS.backgroundLight} barStyle="dark-content"/>
      <ScrollView>
        <View style={styles.mainView}>
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, paddingLeft: 16}}>
            <TouchableOpacity
              onPress={() => navigation.goBack('Home')}
            >
              <Feather 
                name='chevron-left'
                style={styles.chevronLeft}
                />
            </TouchableOpacity>
          </View>
          <FlatList
            data={product.productImageList ? product.productImageList : null}
            horizontal
            renderItem={renderProduct}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.8}
            snapToInterval={width}
            bounces={false}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x:scrollX}}}],
              {useNativeDriver: false},
            )}
          />
          <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            marginTop: 32,
          }}>
            {
              product.productImageList ? 
              product.productImageList.map((item,ind)=> {
                let opacity = position.interpolate({
                  inputRange: [ind - 1, ind, ind + 1],
                  outputRange: [0.2, 1, 0.2],
                  extrapolate: 'clamp'
                })
                return(
                  <Animated.View
                    key={ind}
                    style={{
                      width: '16%',
                      height: 2.4,
                      backgroundColor: COLOURS.black,
                      opacity,
                      marginHorizontal: 4,
                      borderRadius: 100,
                    }}
                  >
                  </Animated.View>
                )
              }) : null
            }
          </View>
        </View>
        <View style={{
          paddingHorizontal: 16,
          marginTop: 6
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 14
          }}>
            <Feather
              name='shopping-cart'
              style={styles.feather}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight:'400',
                color: COLOURS.black
              }}
            >
              Shopping
            </Text>
          </View>
          <View style={styles.prdoNameView}>
            <Text style={styles.productNameTxt}>
              {product.productName}
            </Text>
            <Ionicons 
              name='link-outline'
              style={styles.ionicIcon}
              />
          </View>
          <Text style={styles.desc}>
            {product.description}
          </Text>
          <View style={styles.locationContainer}>
            <View style={{flexDirection: 'row', width: '80%', alignItems: 'center'}}>
              <View style={styles.featherLocView}>
                <Entypo 
                  name='location-pin'
                  style={styles.featherLoc}
                  />
              </View>
              <Text> 13 ElHussein st, {'\n'} 17-001, Cairo, Egypt </Text>
            </View>
            <Entypo 
              name='chevron-right'
              style={styles.ChevRight}
            />
          </View>
          <View>
            <Text>💲 {product.productPrice}.00</Text>
            <Text>
              Tax Rate 2% ~ 💲{product.productPrice / 20} {'\n'} Total: (💲{product.productPrice + product.productPrice / 20})
            </Text>
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
          onPress={() => product.isAvailable ? addToCart(product.id) : null}
        >
          <Text style={styles.availableTxt}>
            {product.isAvailable ? "Add to Cart" : " not Available"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProductInfo

const styles = StyleSheet.create({
  prodView: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOURS.white,
    position: 'relative',
  },
  chevronLeft: {
    fontSize: 18,
    color: COLOURS.backgroundDark,
    padding: 12,
    backgroundColor: COLOURS.white,
    borderRadius: 18
  },
  mainView: {
    width: '100%',
    backgroundColor: COLOURS.backgroundLight,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  }, 
  feather: {
    fontSize: 20,
    color: COLOURS.blue,
    marginRight: 6
  },
  prdoNameView: {  
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productNameTxt: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginVertical: 4,
    color: COLOURS.black,
    maxWidth: '84%'
  }, 
  ionicIcon: {
    fontSize: 24,
    color: COLOURS.blue,
    marginRight: 6,
    backgroundColor: COLOURS.blue + 10,
    padding: 8,
    borderRadius: 100
  },
  desc: {
    fontSize: 15,
    color: COLOURS.black,
    fontWeight: '400',
    letterSpacing: 1,
    opacity: 0.5,
    lineHeight: 20,
    maxWidth: '85%',
    maxHeight: 44,
    marginBottom: 18,
  },
  featherLoc: {
    fontSize: 16,
    color: COLOURS.blue
  },  
  featherLocView: {
     color: COLOURS.blue,
    backgroundColor: COLOURS.backgroundLight,
    alignItems:'center',
    justifyContent: 'center', 
    padding: 17, 
    borderRadius: 100,
    marginRight: 10
  },
  locationContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginVertical: 14, 
    borderBottomColor: COLOURS.backgroundLight,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  ChevRight: {
    fontSize: 22,
    color: COLOURS.backgroundDark
  },
  prodPrice: {
    fontSize: 18,
    fontWeight: '500',
    maxWidth: '85%',
    color: COLOURS.black,
    marginBottom: 4
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