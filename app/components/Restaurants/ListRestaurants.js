import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native"
import { Image } from "react-native-elements"
import * as firebase from "firebase"

export default function ListRestaurants(props) {

    const {restaurants, isLoading, handleLoadMore, navigation} = props
    
    

    return (
        <View>
            {restaurants ? (
                <FlatList
                    data={restaurants}
                    renderItem={restaurant => (<Restaurant restaurant={restaurant} navigation={navigation} />)}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={<FooterList isLoading={isLoading}/>}
                />
            ) : (
                    <View style={styles.loaderRestaurants}>
                        <ActivityIndicator size="large" />
                        <Text>Cargando restaurantes</Text>
                    </View>
                )}     
        </View>
    )

}

function Restaurant(props) {
    const {restaurant, navigation} = props
    const {name,address,description, images} = restaurant.item.restaurant
    const [imageRestaurant, setimageRestaurant] = useState(null)
    
    useEffect(() => {
        const image = images[0];
        firebase
            .storage()
            .ref(`restaurants-images/${image}`)
            .getDownloadURL()
            .then(result => {
                setimageRestaurant(result)
        })
    })

    return (

        <TouchableOpacity onPress={() => navigation.navigate("Restaurant",{restaurant : restaurant.item.restaurant})}>
        <View style={styles.viewRestaurants}>
                <View style={styles.viewRestaurantImage}>
                    <Image
                        resizeMode="cover"
                        source={{ uri: imageRestaurant }}
                        style={styles.imageRestaurant}
                        PlaceholderContent={<ActivityIndicator color="fff" />}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
                </View>
        </View>
        </TouchableOpacity>
          
            

    )
}

function FooterList(props) {
    const {isLoading} = props

    if (isLoading) {
        return (
            
            <View style={styles.loadingRestaurants}>
                <ActivityIndicator size="large"/>
            </View>
        )
    } else {
        return (
        <View style={styles.notFoundRestaurants}>
            <Text>No quedan restaurantes por cargar</Text>
        </View> 
        )
    }
}

const styles = StyleSheet.create({

    loadingRestaurants: {
        marginTop: 20,
        alignItems:"center"
    },
    viewRestaurants: {
        flexDirection: "row",
        margin:10
    },
    viewRestaurantImage: {
        marginRight:15
    },
    imageRestaurant: {
        width: 80,
        height:80
    },
    restaurantName: {
        fontWeight: "bold"
    },
    restaurantAddress: {
        paddingTop: 2,
        color:"grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width:300
    },
    loaderRestaurants: {
        marginTop: 10,
        marginBottom:10  
    },
    notFoundRestaurants: {
        marginTop: 10,
        marginBottom: 20,
        alignItems:"center"
    }

})