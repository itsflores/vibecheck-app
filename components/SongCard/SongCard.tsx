import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import test from '../../assets/img/test.jpg';
import songCardStyles from './SongCard.style';
import playButton from '../../assets/img/play_button.png';
import pauseButton from '../../assets/img/pause_button.png';
import { playTrack, pauseTrack } from '../../util/SpotifyAPI.util';

const SongCard = ({ title, artist, album, albumuri = test, setActive, songId, amIActive, listIdentifier }) => {
  const [songIsActive, setSongStatus] = useState(false);

  useEffect(() => {
    if (listIdentifier !== amIActive && songIsActive) {
      setSongStatus(false);
    }
  })

  const updateStatus = () => {
    setSongStatus(!songIsActive);

    if (!songIsActive) {
      playTrack(songId);
      setActive(listIdentifier);
    } else {
      pauseTrack();
    }
  }

  return (
    <View style={songCardStyles.songCardContainer}>
      <View style={songCardStyles.albumContainer}>
        <Image source={albumuri} style={songCardStyles.albumImage} />
        <TouchableOpacity onPress={() => updateStatus()} style={songCardStyles.albumShading}>
          <Image style={songCardStyles.statusButton} source={(songIsActive ? pauseButton : playButton)} />
        </TouchableOpacity>
      </View>
      <View style={songCardStyles.songContainerOutter}>
        <View style={songCardStyles.songContainerInner}>
          <Text style={songCardStyles.songTitle}>
            {title}
          </Text>
          <View style={songCardStyles.division} />
          <Text style={songCardStyles.songArtist}>
            {artist}
          </Text>
          <Text style={songCardStyles.songAlbum}>
            {album}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SongCard;