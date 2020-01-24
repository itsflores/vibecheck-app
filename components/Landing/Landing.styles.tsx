import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import constants from '../../styles/constats';

const landingStyles = StyleSheet.create({
  landing: {
    backgroundColor: colors.yellow,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  playlistButton: {
    borderColor: colors.white,
    borderWidth: constants.borderWidth,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  queryBox: {
    borderColor: 'transparent',
    borderBottomColor: colors.white,
    borderWidth: constants.borderWidth,
    flexWrap: 'wrap',
    flexDirection: 'row',
    color: colors.black,
  },
  playButtom: {
    height: 140,
    resizeMode: 'contain',
  },
  landingContainer: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  landingLogo: {
    position: 'absolute', 
    bottom: 10, 
    right: 40,
    height: 100, 
    width: 200,
    resizeMode: 'contain',
  },
  elementMargin: {
    marginBottom: 60,
  }
})

export default landingStyles;