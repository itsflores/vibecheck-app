import React from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView, Text, Alert, Share } from 'react-native';
import { VibecheckInterfaceProps, VibecheckInterfaceState } from '../../interfaces/Vibecheck.interface';
import generalStyles from '../../styles/generalStyles';
import vibeCheckStyles from './Vibecheck.styles';
import SongCard from '../SongCard/SongCard';
import searchIcon from '../../assets/img/search_icon.png';
import Menu from '../Menu/Menu';
import { getData, saveData } from '../../util/Storage.util';
import mockResult from '../../mock/mockplaylist.json';
import saveSpotifyIcon from '../../assets/img/spotify_save.png';
import shareIcon from '../../assets/img/share_icon.png';
import { savePlaylist, sharePlaylist } from '../../util/SpotifyAPI.util';

export default class Vibecheck extends React.Component<VibecheckInterfaceProps, VibecheckInterfaceState> {
  constructor(props) {
    super(props);
    this.state = {
      query: null,
      results: null,
      latestQuery: null,
      activeSong: null,
      signal: (origin: number) => {
        this.setState({ activeSong: origin })
      }
    }
  }

  async componentDidMount() {
    const latestQuery = await getData('LATEST_QUERY');
    let latestResults = null;

    if (latestQuery !== undefined) {
      this.setState({
        query: latestQuery,
        latestQuery,
      });

      latestResults = await getData('LATEST_RESULT');

      if (latestResults !== undefined) {
        this.setState({
          results: JSON.parse(latestResults).songs,
        });
      } else {
        //? If latest data doesn't exist call api and save those results
        await saveData('LATEST_RESULT', JSON.stringify(mockResult))
        this.setState({
          results: mockResult.songs
        })
      }
    }
  }

  vibecheck = async () => {
    const { query, latestQuery } = this.state;

    if (query !== latestQuery) {
      //? API calls go here 
      // await saveData("LATEST_RESUT", someapiresult);

      await saveData('LATEST_QUERY', query);

      this.setState({
        latestQuery: query,
        results: mockResult.songs
      });
    }
  }

  savePlaylist = async () => {
    const { query, results } = this.state;

    await savePlaylist(query, results);

    Alert.alert(
      'Vibecheck',
      'Your playlist has been saved to your Spotify account!',
      [{
        text: 'Done',
        style: 'default'
      }], { 
        cancelable: true
      }
    );
  }

  sharePlaylist = async () => {
    const { query, results } = this.state;

    const shareLink = await sharePlaylist(query, results);

    Share.share({
      message: `Check out this playlist I made with vibecheck! ${shareLink}`,
      url: `${shareLink}`,
      title: 'Share this playlist',
    }, {
      dialogTitle: 'Share this playlist',
      subject: 'Share this playlist I made with vibecheck!'
    })
  }

  render() {
    const { results, query, signal, activeSong } = this.state;
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Menu navigation={navigation} />
        <ScrollView style={vibeCheckStyles.vibecheckScroll}>
          <View style={vibeCheckStyles.vibecheckContainer}>
            <View style={vibeCheckStyles.vibecheckHeader}>
              <TextInput multiline={true} style={[vibeCheckStyles.queryBox, generalStyles.queryText]} value={query} onChangeText={input => {this.setState({ query: input })}} />
              <TouchableOpacity onPress={() => this.vibecheck()}>
                <View style={vibeCheckStyles.searchContainer}>
                  <View style={vibeCheckStyles.searchIconContainer}>
                    <Image source={searchIcon} style={vibeCheckStyles.searchIcon} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ width: '50%', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 36, backgroundColor: 'black', marginTop: 30, elevation: 8 }}>
              <Text style={{ color: 'white', fontFamily: 'worksans-light', fontStyle: 'normal', fontSize: 18 }}>
                shuffle playlist
              </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 30, flex: 1, flexDirection: 'column' }}>
              {(results) ? (
                results.map((song, index: number) => (
                  (<SongCard
                    key={index}
                    title={song.track_name} 
                    artist={song.artist_name} 
                    album={song.genre}
                    setActive={signal}
                    songId={song.track_id}
                    amIActive={activeSong}
                    listIdentifier={index}
                  />)
                ))
              ) : null}
            </View>
          </View>
        </ScrollView>
        <View style={{ height: 60, backgroundColor: 'black', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.savePlaylist()} style={{ width: '50%', height: '100%', justifyContent: 'center', flexDirection: 'column', alignContent: 'center', alignItems: 'center', padding: 16 }}>
            <Image source={saveSpotifyIcon} style={{ height: '90%', resizeMode: 'contain' }} />
            <Text style={[{ color: 'white', fontSize: 12, marginTop: 2, fontFamily: 'worksans-regular' }]}>
              Save to Spotify
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.sharePlaylist()} style={{ width: '50%', height: '100%', justifyContent: 'center', flexDirection: 'column', alignContent: 'center', alignItems: 'center', padding: 16 }}>
            <Image source={shareIcon} style={{ height: '90%', resizeMode: 'contain' }} />
            <Text style={[{color: 'white', fontSize: 12, marginTop: 2, fontFamily: 'worksans-regular' }]}>
              Share playlist
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}