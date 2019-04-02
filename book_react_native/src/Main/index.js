import React, { Component } from 'react';
import { FlatGrid } from 'react-native-super-grid';
import { LinearGradient  } from 'expo';
import { SearchBar } from 'react-native-elements';
import { TouchableOpacity,
         SafeAreaView,
         Dimensions,
         ScrollView, 
         StyleSheet, 
         View, 
         Text, 
         ImageBackground } from 'react-native';

const { height, width } = Dimensions.get('window');


export default class IndexComponent extends Component {
  
  constructor() {
    super();
    this.state = {
      hostname: 'http://10.0.0.147:5000/books',
      BookShowcase: [],
      search: '',
    };
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateSearch = search => {
    /* Seach bar Functionality */
    var context_this = this;
    this.setState({ search });
    if (search != "") {
      fetch(this.state.hostname + "?title=" + search +"&result_limit=10&page_num=0") // new URL(...) not yet supported
      .then(function(response) {
        return response.json();
      })
      .then(function(respJson) {
        var data = []
        for(var b = 0; b < respJson["results"].length; b++){
          _url = respJson["results"][b]["image"];
          if (_url == null){  // sometimes urls are null, put a example holder or just skip
            continue
          }
          if( _url.indexOf("http") != 0 ) {
            _url = "https://" + _url;
          }
          data.push({ name: respJson["results"][b]["title"], uri: _url});
        }
        context_this.setState({ BookShowcase: data});
      });
    }
  };

  arrRanChoice(arr) {
    /* Choose a random item in a given array */
    return arr[Math.floor(arr.length * Math.random())];
  }

  initPopulate(arr){
    /* Populate the Flat list when app starts. */
    const data = []
    fetch(this.state.hostname + "?title=" + this.arrRanChoice(arr) +"&result_limit=10&page_num=0") // new URL(...) not yet supported
    .then(function(response) {
      return response.json();
    })
    .then(function(respJson) {
      for(var b = 0; b < respJson["results"].length; b++){
        _url = respJson["results"][b]["image"];
        if( _url.indexOf("http") != 0 ) {
          _url = "https://" + _url;
        }
        data.push({ name: respJson["results"][b]["title"], uri: _url});
      }
    });
    return data
  }

  scrollChecker(e){
    /* Detects when a scrollview reaches it's end. */
    var windowHeight = Dimensions.get('window').height,
            height = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
        if( windowHeight + offset >= height ){
            console.log("End of Screen");
        }
  }
  async componentDidMount() {
    var InitBooks = this.initPopulate(["zombie", "apple", "animals"]);
    this.setState({ BookShowcase: InitBooks });
  }

  render() {
    const { search } = this.state;
    
    return (
      <SafeAreaView style={{ backgroundColor: '#f2f2f2', flex: 1, marginBottom: 0}}>
      <ScrollView 
      scrollEventThrottle={16}
      onScroll={(e)=> this.scrollChecker(e)}>
            <View style={{ flex: 1, backgroundColor: '#f2f2f2', paddingTop: 5, marginBottom: 10 }}>
                <View style={{flexDirection: 'column', justifyContent: 'flex-start', marginTop: 5}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: width - (width * 0), marginTop: 5, paddingRight: 10}}>
                      <SearchBar
                          placeholder="Search Here..."
                          platform='ios'
                          placeholderTextColor={'rgba(149,156,160,0.8)'}
                          borderRadius={40}
                          onChangeText={() => {}}
                          onClear={() => {}}
                          onCancel={() => {}}
                          cancelButtonTitle={''}
                          leftIconContainerStyle={{
                              marginLeft: 15,
                              marginRight: 5,
                          }}
                          inputStyle={{
                              fontSize: 16,
                              marginLeft: 5,
                              backgroundColor: 'transparent',
                              color: 'rgba(29,31,32,1)'
                          }}
                          containerStyle={{
                              marginLeft: 5,
                              paddingRight: 0,
                              backgroundColor: 'transparent',
                              borderTopWidth: 0,
                              borderBottomWidth: 0
                          }}
                          onChangeText={this.updateSearch}
                          value={search}
                        />
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: '#f2f2f2', flex: 1, paddingTop: 5, marginBottom: 1 }}>
                <Text style={{ fontSize: 24, fontFamily: "Rubik-Medium", paddingHorizontal: 20, color: '#151515' }}>Books</Text>
            </View>
          <FlatGrid
            itemDimension={130}
            items={this.state.BookShowcase}
            extraData={this.state.BookShowcase}
            style={styles.gridView}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity activeOpacity = { .5 } onPress={ (item) => console.log(item) }>
                  <ImageBackground
                      borderTopLeftRadius={8}
                      borderTopRightRadius={8}
                      style={[styles.itemContainer, { backgroundColor: 'rgba(0,0,0,0.0)', resizeMode: 'cover' }]}
                      source={{uri: item.uri}}>
                      <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.7)']}
                          style={{
                              justifyContent: 'flex-end',
                              position: 'relative',
                              left: 0,
                              right: 0,
                              top: 0,
                              height: (240 * 0.40),
                          }}>
                          <View style={{alignItems: 'center'}}>
                            <Text style={styles.itemName}>{item.name}</Text>
                          </View>
                          </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
                </View>
            )}
          />
          </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1, width: null,
    height: height - (height * 0.60),
    resizeMode: 'cover',
    justifyContent: 'flex-end'
    
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
    flexWrap: 'wrap',
    textAlign: 'center'
  },
});