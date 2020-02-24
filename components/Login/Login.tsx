import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { LoginInterfaceProps, LoginInterfaceState } from '../../interfaces/Login.interface';
import generalStyles from '../../styles/generalStyles';
import loginStyles from './Login.styles';
import loginLogo from '../../assets/img/login_logo.png'
import bottomLogo from '../../assets/img/app_dark_logo.png';
import { getAuthTokens } from '../../util/Spotify.util';
import { getData } from '../../util/Storage.util';
import { initializeAPI } from '../../util/SpotifyAPI.util';

const wait = async (time: number) => (
  new Promise((resolve) => {
    setTimeout(() => {
      return resolve('');
    }, time);
  })
)

export default class Login extends React.Component <LoginInterfaceProps, LoginInterfaceState> {
  constructor(props) {
    super(props);
    this.state = {
      accessTokenStatus: false,
    };
  }

  handleLogin = async () => {
    const { navigate } = this.props.navigation

    await getAuthTokens();
    const expiryTime = await getData('EXPIRY_TIME');

    Alert.alert(
      'Vibecheck',
      `Current expiry time = ${expiryTime}`,
      [{
        text: 'Done',
        style: 'default'
      }], { 
        cancelable: true
      }
    );

    navigate('Loading');

    await wait(1000);

    if (expiryTime !== null) {
      const newToken = await getData('ACCESS_TOKEN');
        
      initializeAPI(newToken);
      navigate('Landing');
    } else {
      Alert.alert(
        'Vibecheck',
        `There was an error logging in, the time retreieved = ${expiryTime}`,
        [{
          text: 'Done',
          style: 'default'
        }], { 
          cancelable: true
        }
      );
    }
  }

  render() {
    const { accessTokenStatus } = this.state;

    return (
      <View style={loginStyles.loginContainerOuter}>
        <View style={loginStyles.loginContainerInner}>
          <Image style={loginStyles.loginLogo} source={loginLogo}/>
          <TouchableOpacity onPress={this.handleLogin} style={loginStyles.loginButton}>
            <Text style={[generalStyles.queryText, loginStyles.loginText]}>
              Log in with Spotify
            </Text>
          </TouchableOpacity>
          {/* <Text style={{ color: 'white' }}>
            {accessTokenStatus === true ? 'Token active' : 'Token not active'}
          </Text> */}
        </View>
        <Image style={generalStyles.bottomDarkLogo} source={bottomLogo} />
      </View>
    );
  }
}
