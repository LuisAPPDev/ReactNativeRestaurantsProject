import React, {useState, useEffect} from 'react'
import { StyleSheet, ScrollView , View, Alert, Dimensions } from "react-native"
import { Icon, Avatar, Image, Input, Button } from "react-native-elements"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import MapView from "react-native-maps"
import * as Location from "expo-location"
import Modal from "../Modal"
import { firebaseApp } from "../../utils/FireBase"
import firebase from "firebase/app"
import "firebase/firestore"
const db = firebase.firestore(firebaseApp)

const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

const widthScreen = Dimensions.get("window").width


export default function AddRestaurantForm(props) {
    
    const {navigation, setIsLoading, toastRef} = props
    const [imagesSelected, setImagesSelected] = useState([])
    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAddress, setRestaurantAddress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [restaurantLocation, setRestaurantLocation] = useState(null) 

    const addRestaurant = () => {

        
           
        
        
        
        if (!restaurantName || !restaurantAddress || !restaurantDescription) {
            toastRef.current.show("Todos los campos del formulario son obligatorios", 3000)
        } else if (imagesSelected.length === 0) {
            toastRef.current.show("El restaurante tiene que tener al menos una foto", 3000)
        } else if (!restaurantLocation) {
            toastRef.current.show("Tienes que ubicar el restaurante en el mapa", 3000)
        } else {
            setIsLoading(true)   
            UploadImageStorage(imagesSelected).then(arrayImages => {
                db.collection("restaurants").add({
                    name: restaurantName,
                    address: restaurantAddress,
                    description: restaurantDescription,
                    location: restaurantLocation,
                    images: arrayImages,
                    rating: 0,
                    ratingTotal: 0,
                    totalVotes: 0,
                    createAt: new Date(),
                    createBy: firebaseApp.auth().currentUser.uid
                }).then(() => {
                    setIsLoading(false)
                    navigation.navigate("Restaurants")
                }).catch((error) => {
                    setIsLoading(false)
                    toastRef.current.show("Error al subir el restaurante, intentolo mas tarde", 3000)
                    console.log(error)
                })
            })
            
        }
        

    }

    const UploadImageStorage = async imageArray => {
        
        const imagesBlob = []
        await Promise.all(
            imageArray.map(async image => {
                const response = await fetch(image)
                const blob = await response.blob()
                const ref = firebase
                    .storage()
                    .ref("restaurants-images")
                    .child(uuid())
                await ref.put(blob).then(result => {
                     imagesBlob.push(result.metadata.name)
                    
                })
            })
        )

            return imagesBlob
    }

    return (
        <ScrollView>
            <MainImage imageRestaurant={imagesSelected[0]} />
            <FormAdd
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantName={setRestaurantName}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                restaurantLocation={restaurantLocation}
            />
            <UploadImage toastRef={toastRef} imagesSelected={imagesSelected} setImagesSelected={setImagesSelected}/>
            <Button 
            
                title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />

            
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} setRestaurantLocation={setRestaurantLocation} toastRef={toastRef} />

        </ScrollView>
    )
}


function MainImage(props) {
    const { imageRestaurant } = props
    
    return (
        <View style={styles.viewMainImage}>
            {imageRestaurant ? (
                <Image
                    source={{ uri: imageRestaurant }}
                    style={{ width: widthScreen, height:200 }}
                />
            ) : (
                    <Image
                        source={require("../../../assets/img/noimage.png")}
                        style={{width: widthScreen, height:200}}
                    
                    />
            )}
        </View>
    )

}

function UploadImage(props) {
    const {imagesSelected, setImagesSelected, toastRef} = props
    
    const imageSelect = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status
        
        if (resultPermissionCamera === "denied") {
            toastRef.current.show("Debe aceptar los permisos de la galería",3000)

        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            })
            if (result.cancelled) {
                toastRef.current.show("Ha cerrado la galería sin seleccionar ninguna imagen",3000)
            } else {
                setImagesSelected([...imagesSelected,result.uri])
                
            }  
        }
    }

    const removeImage = image => {
        
        const arrayImages = imagesSelected

        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress:()=> setImagesSelected(arrayImages.filter(imageUrl => imageUrl !== image))
                }
            ],
            {cancelable:false}
            
        )
    }
    
    return (
        <View style={styles.viewImages}>
            
            {imagesSelected.length < 5 &&
            <Icon
                type="material-community"
                name="camera"
                color="#7a7a7a"
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />
             }   
            {imagesSelected.map(imageRestaurant => (
            
                <Avatar
            key={imageRestaurant}
            onPress={()=>removeImage(imageRestaurant)}
            style={styles.miniatureStyle}
            source={{uri: imageRestaurant}}

        />

            ))}
            
        </View>
    )

}

function FormAdd(props) {
    const {setRestaurantAddress, setRestaurantDescription, setRestaurantName, setIsVisibleMap, restaurantLocation} = props
    return (
        
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: restaurantLocation ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
                onChange={e => setRestaurantAddress(e.nativeEvent.text) }
            />
            <Input
                placeholder="Descripción del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
            />
            
        </View>

    )
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setRestaurantLocation, toastRef } = props
    const [location, setLocation] = useState(null)
    

    useEffect(() => {
        
        (async () => {
            
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
            const statusPermissions = resultPermissions.permissions.location.status

            if (statusPermissions !== "granted") {
                toastRef.current.show("Debes aceptar los permisos de localización",3000)
            } else {
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()


    }, [])
    
    const confirmLocation = () => {
        setRestaurantLocation(location)
        toastRef.current.show("Localización guardada correctamente")
        setIsVisibleMap(false)


    }

    return (
        
        <Modal isVisible={isVisibleMap} setIsVisibleMap={setIsVisibleMap}>

            <View>
                {location && (
                    
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={region => setLocation(region)}
                    >
                    
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            draggable
                        >        
                        </MapView.Marker>  

                    </MapView>


                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar ubicacion"
                        onPress={confirmLocation}
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                    />
                    <Button
                        title="Cancelar ubicacion"
                        onPress={() => setIsVisibleMap(false)}
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                    />

                </View>
            </View>


        </Modal>
    )
}

const styles = StyleSheet.create({

    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight:10,
        height: 70,
        width: 70,
        backgroundColor:"#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight:10     
    },
    viewMainImage: {
        alignItems: "center",
        height: 200,
        marginBottom:20
    },
    viewForm: {
        marginLeft: 10,
        marginRight:10
    },
    input: {
        marginBottom:10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin:0
    },
    mapStyle: {
        width: "100%",
        height:350
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop:10
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnSave: {
        backgroundColor:"#00a680"
    },
    viewMapBtnContainerCancel: {
        paddingLeft:5
    },
    viewMapBtnCancel: {
        backgroundColor:"#a60d0d"
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin:20
    }
})