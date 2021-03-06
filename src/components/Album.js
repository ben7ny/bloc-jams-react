
import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
     super(props);
     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });

     this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      currentVolume:0.5,
      allVolume:1,
      duration: album.songs[0].duration,
      isPlaying: false
     };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
   }

   componentDidMount() {
     document.body.style.backgroundImage = "none";
     this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
       },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
       }
     };
     this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   }

   componentWillUnmount() {
     document.body.style.backgroundImage = "url('/assets/images/blurred_backgrounds/blur_bg_3.jpg')";
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }

   play() {
     this.audioElement.play();
     this.setState({ isPlaying: true });
   }

   pause() {
     this.audioElement.pause();
     this.setState({ isPlaying: false });
   }

   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }
       this.play();

     }
   }



   playPauseButton(song, index) {
     const isSameSong = this.state.currentSong === song;
     const play = <button><span className="ion-play"></span></button>;
     const pause =  <button><span className="ion-pause"></span></button>;
     const songNumber = <span className="song-number">{index+1}</span>;

     if (this.state.isPlaying && isSameSong) {
       return pause;
     } else if(song.isHovered) {
       return play;
     } else {
       return songNumber;
     }
   }


     isHovered(song, index){
       song.isHovered = true;
       this.setState({ album: this.state.album });
     }



     unHovered(song, index){
       song.isHovered = false;
       this.setState({ album: this.state.album });
     }



    handlePrevClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play(newSong);
    }


    handleNextClick() {
       const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = currentIndex + 1;
        const newSong = this.state.album.songs[newIndex];
        if(newSong) {
          this.setSong(newSong);
          this.play(newSong);
        } else {
          this.pause();
        }

     }



     handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }

    handleVolumeChange(e) {
     const newVolume = e.target.value; //this.state.allVolume - this.state.currentVolume;
     this.audioElement.volume = newVolume;
     this.setState({ currentVolume: newVolume });
   }




  formatTime(seconds){
    const secondAndMiliSecond = parseFloat(seconds);

    if(secondAndMiliSecond.isNaN){return "-:--"
   }else {
     const getRoundScond = Math.floor(secondAndMiliSecond);
     const getMins = getRoundScond/ 60;
     const getRoundMins = Math.floor(getMins);
     const getSec = getRoundScond % 60;


   if(getSec < 10) {
       return `${getRoundMins}:0${getSec}`
     } else {
        return `${getRoundMins}:${getSec}`
     }

  }

}


   render() {
     return (
       <section className="album">

          <div className="album-cover"><img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} /> </div>
          <div className="album-info">
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </div>
        <div className="song-info">
            <table id="song-list">
               <tbody className="song-number">
                {this.state.album.songs.map((song, index) =>
                     <tr className="song" key={index} onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.isHovered(song)} onMouseOut={() => this.unHovered(song, index)}>
                     <td className="song-actions">
                      {this.playPauseButton(song, index)}
                     </td>
                     <td className="song-item-title">{song.title}</td>
                     <td className="song-item-duration">{(this.formatTime(song.duration))}</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
           </div>
           <div className="player-set">
             <PlayerBar
               isPlaying={this.state.isPlaying}
               currentSong={this.state.currentSong}
               currentTime={this.audioElement.currentTime}
               duration={this.state.duration}
               currentVolume={this.state.currentVolume}
               handleSongClick={() => this.handleSongClick(this.state.currentSong)}
               handlePrevClick={() => this.handlePrevClick()}
               handleNextClick={() => this.handleNextClick()}
               handleTimeChange={(e) => this.handleTimeChange(e)}
               handleVolumeChange={(e) => this.handleVolumeChange(e)}
               formatTime={(seconds)=>this.formatTime(seconds)}
           />
         </div>
       </section>
     );
   }
 }






export default Album;
