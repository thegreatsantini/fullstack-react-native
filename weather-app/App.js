import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { fetchLocationId, fetchWeather } from './utils/api';
import SearchInput from './Components/SearchInput';
import getImageForWeather from './utils/getImageForWeather';

export default class App extends React.Component {
  state = {
    loading: false,
    error: false,
    location: '',
    temperature: 0,
    weather: '',
  };

  handleUpdateLocation = city => {
    if (!city) return;
    this.setState({ loading: true }, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(
          locationId,
        );
        this.setState({
          loading: false, error: false, location, weather, temperature,
        });
      } catch (e) {
        this.setState({
          loading: false, error: true,
        });
      }
    });
  };

  renderContent() {

    const { error, location, weather, temperature } = this.state;

    return (<View>
      {error && (
        <Text style={[styles.smallText, styles.textStyle]}>
          Could not load weather, please try a different city. </Text>
      )}
      {!error && (
        <View>
          <Text style={[styles.largeText, styles.textStyle]}>
            {location}
          </Text>
          <Text style={[styles.smallText, styles.textStyle]}>
            {weather}
          </Text>
          <Text style={[styles.largeText, styles.textStyle]}>
            {`${Math.round(temperature)}°`} </Text>
        </View>)}
      <SearchInput
        placeholder="Search any city" onSubmit={this.handleUpdateLocation}
      />
    </View>
    );
  }

  renderInfo() {
    const { info } = this.state;
    return <Text>{info}</Text>;
  }


  render() {

    const { loading, weather } = this.state;

    return (

      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <View>
              <ActivityIndicator animating={loading} color="white" size="large" />
              {!loading && this.renderContent()}
            </View>
          </View>

        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',

  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white'
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
});
