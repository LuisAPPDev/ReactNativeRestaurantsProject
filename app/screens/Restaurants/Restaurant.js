import React,{useState, useEffect} from 'react'
import { StyleSheet, View, ScrollView, Text, Dimensions } from "react-native"
import {Rating, ListItem} from "react-native-elements"
import * as firebase from "firebase"
import Carousel from "../../components/Carousel"
import Map from "../../components/Map"
import ListReviews from "../../components/Restaurants/ListReviews"

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
    const {navigation} = props
    const { restaurant } = navigation.state.params.restaurant.item
    const [imagesRestaurant, setImagesRestaurant] = useState([])
    const [rating, setRating] = useState(restaurant.rating)
    

    useEffect(() => {
        const arrayUrls = [];
            
            (async () => {
                await Promise.all(
                    restaurant.images.map(async idImage => {
                        await firebase
                            .storage()
                            .ref(`restaurants-images/${idImage}`)
                            .getDownloadURL()
                            .then(imageUrl => { 
                                arrayUrls.push(imageUrl)
                             });
                    })
                );
                setImagesRestaurant(arrayUrls)
            })();
    }, []);

    return (
        <ScrollView style={styles.viewBody}>
            
            <Carousel
                arrayImages={imagesRestaurant}
                width={screenWidth}
                height={200}
            />
      
             <TitleRestaurant
            name={restaurant.name}
            description={restaurant.description}
            rating={rating}>
            </TitleRestaurant>
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReviews
                navigation={navigation}
                idRestaurant={restaurant.id}
                setRating={setRating}
            />

            
        </ScrollView>
)

}

function TitleRestaurant(props) {
    const { name, description, rating } = props
    
    return(
             
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.restaurantName}>{name}</Text>
                <Rating style={styles.rating} imageSize={20} readonly startingValue={parseFloat(rating)}/>
            </View>
            <Text style={styles.restaurantDescription}>{description}</Text>
        </View>
        
        )
}

function RestaurantInfo(props) {
    const { location, name, address,phone, email } = props
    //TO DO METER CAMPOS EN ADDRESTAURANTFORM, TELEFONO E EMAIL
    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action:null
        },
        {
            text: "91-769-48-32",
            iconName: "phone",
            iconType: "material-community",
            action: null
        },
        {
            text: "reservas@restaurante.es",
            iconName: "at",
            iconType: "material-community",
            action: null
        }

    ]

    return (
        <View style={styles.viewRestaurantInfo}>

            <Text style={styles.restaurantInfoTitle}>
                Información del restaurante
        </Text>
            <Map location={location} name={name} height={100} />
            {listInfo.map((item, index) => (
            
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#00a680"
                    }}
                    containerStyle={styles.containerListItem}

                />
            )
            )}
        </View>
    )

}


const styles = StyleSheet.create({
    viewBody: {
        flex:1
    },
    viewRestaurantTitle: {
        margin:15
    },
    restaurantName: {
        fontWeight: "bold",
        fontSize: 20
    },
    rating: {
        position: "absolute",
        right:0
    },
    restaurantDescription: {
        marginTop: 5,
        color: "grey"
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop:25
    },
    restaurantInfoTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom:10
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth:1
    }
})
