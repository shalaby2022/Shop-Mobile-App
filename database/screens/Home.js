import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Image } from 'react-native'
import { COLOURS, Items } from '../Database'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Home = ({ navigation })=> {

  const [products, setProducts] = useState([])
  const [accessories, setAccessories] = useState([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', ()=> {
      getDataFromDB()
    });

      return unsubscribe
  }, [navigation])

  const getDataFromDB = ()=> {
    let productList = [];
    let accessoryList = [];

    for(let i = 0; i < Items.length; i++) {
      if(Items[i].category === 'product') {
        productList.push(Items[i])
      } else if (Items[i].category === 'accessory') {
        accessoryList.push(Items[i])
      }

      setProducts(productList)
      setAccessories(accessoryList)
    }
  }

  const ProductCard = ({data})=> {
    return(
      <TouchableOpacity 
        style={{width:'45%', marginVertical: 14, }}
        onPress={()=> navigation.navigate('ProductInfo', {productID: data.id})}
        >
        <View style={styles.cardView}>
          {
            data.isOff ? (
              <View style={styles.offStyle}>
                <Text style={styles.offText}>{data.offPercentage}%</Text>
              </View>
            ) : null
          }
          <Image
            source={data.productImage}
            style={styles.imgStyle}
          />
        </View>
        <Text style={styles.prodCardText}>
          {data.productName}
        </Text>
        {
          data.category == 'accessory' ? data.isAvailable ?(
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome 
                name='circle'
                style={styles.fontAwesomeIcon}
                />
                <Text style={styles.fontAwesomeText}>
                  Available
                </Text>
            </View>
          )
          : 
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome 
                name='circle'
                style={[styles.fontAwesomeIcon2]}
                />
                <Text style={styles.fontAwesomeText2}>
                  Unavailable
                </Text>
            </View> 
          :
          null
        }
        <Text>
          &#8377; {data.productPrice}
        </Text>
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.body}>
      <StatusBar backgroundColor={COLOURS.white} barStyle="dark-content"/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.iconView}>
          <TouchableOpacity>
            <Feather
              name='shopping-bag'
              style={styles.iconStyle}
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate('MyCart')}>
            <Feather
              name="shopping-cart"
              style={styles.iconStyle}
              />
          </TouchableOpacity>
        </View>
        <View style={styles.headerView}>
          <Text style={styles.header}>
            Dream shop &amp; services
          </Text>
          <Text style={styles.detail}>
            Audio shop on 13 ElHussein, This shop offers both products and services. 
          </Text>
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between'}}>
              <View style={styles.prodContainer}>
                <Text style={styles.prodText}>
                  Products
                </Text>
                <Text style={styles.totalProducts}>
                  {products.length}
                </Text>
              </View>
              <Text style={styles.seeAll}>
                SeeAll
              </Text>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {
              products.map(data => {
                return <ProductCard data={data} key={data.id}/>
              })
            }
          </View>
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between'}}>
              <View style={styles.prodContainer}>
                <Text style={styles.prodText}>
                  Accessories
                </Text>
                <Text style={styles.totalProducts}>
                  {accessories.length}
                </Text>
              </View>
              <Text style={styles.seeAll}>
                SeeAll
              </Text>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {
              accessories.map(data => {
                return <ProductCard data={data} key={data.id}/>
              })
            }
          </View>
        </View>
      </ScrollView>
    </View>

  )
}

export default Home;

const styles = StyleSheet.create({
  body:{
    backgroundColor: COLOURS.white,
    width: '100%',
    height: '100%',
    padding: 16,
  },
  iconView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerView: {
    marginBottom: 10,
  },
  header: {
    fontSize: 26,
    color: COLOURS.black,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    color: COLOURS.black,
    fontWeight: '400',
    letterSpacing: 1,
    lineHeight: 24,
  },
  iconStyle: {
    fontSize: 23,
    color: COLOURS.backgroundDark,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLOURS.backgroundLight,
  },
  prodContainer: {
    flexDirection: 'row',
    alignItems:  'baseline',
    marginTop: 20,
  },
  prodText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOURS.black,
    letterSpacing: 1,
  },
  totalProducts: {
    fontSize: 16,
    color: COLOURS.blue,
    fontWeight: 'bold',
    opacity: 0.5,
    marginLeft: 10
  },
  seeAll: {
    fontSize: 16,
    color: COLOURS.blue,
    fontWeight: '400'
  },
  cardView: {
    width: '100%',
    height: 100, 
    borderRadius: 15, 
    backgroundColor: COLOURS.backgroundLight, 
    position: 'relative', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8
  },
  imgStyle: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain'
  },
  offStyle: {
    position: 'absolute',
    width: '20%',
    height: '25%',
    backgroundColor: COLOURS.green,
    top: 0,
    left: 0,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'

  },
  offText: {
    fontSize: 12,
    color: COLOURS.white,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  prodCardText: {
    fontSize: 14,
    color: COLOURS.black,
    fontWeight: '600',
    marginBottom: 2,

  },
  fontAwesomeIcon: {
    fontSize: 12,
    marginRight: 6,
    color: COLOURS.green
  },
  fontAwesomeText: {
    fontSize: 12,
    color: COLOURS.green
  },
  fontAwesomeIcon2: {
    fontSize: 12,
    marginRight: 6,
    color: COLOURS.red
  },
  fontAwesomeText2: {
    fontSize: 12,
    color: COLOURS.red
  },
})