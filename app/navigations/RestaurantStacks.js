import { createStackNavigator } from "react-navigation-stack";
import RestaurantsScreen from "../screens/Restaurants";

const RestaurantsScreenStacks = createStackNavigator({
  Restaurants: {
    screen: RestaurantsScreen,
    navigationsOptions: () => ({
      title: "Restaurantes"
    })
  }
});

export default RestaurantsScreenStacks;
