import { createStackNavigator } from "react-navigation-stack";
import RestaurantsScreen from "../screens/Restaurants";
import AddRestaurantsScreen from "../screens/Restaurants/AddRestaurants"

const RestaurantsScreenStacks = createStackNavigator({
  Restaurants: {
    screen: RestaurantsScreen,
    navigationOptions: () => ({
      title: "Restaurantes"
    })
  },
  AddRestaurant: {
    screen: AddRestaurantsScreen,
    navigationOptions: () => ({
      title: "Nuevo restaurante"
    })
  }
});

export default RestaurantsScreenStacks;
