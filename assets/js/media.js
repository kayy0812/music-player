const audio = document.querySelector('#audio')
const playBtn = document.querySelector('.player__controls-action-play')
const nextBtn = document.querySelector('.player__controls-action-next')
const prevBtn = document.querySelector('.player__controls-action-prev')
const loopBtn = document.querySelector('.player__controls-switch-loop')
const shuffleBtn = document.querySelector('.player__controls-switch-shuffle')

class Song {
    constructor({ title, author, source, avatar, background }) {
        audio.src = `./assets/audio/${source}`
        this.title = title
        this.author = author
        this.source = audio
        this.avatar = avatar
        this.background = background
    }

    play() {
        playBtn.classList.add('player__controls-action-play--active')
        if (!this.source.paused) {
            this.source.pause()
        }
        this.source.play()
    }

    pause() {
        this.source.pause()
    }

    currentTime() {
        return this.source.currentTime
    }
}

class UI {
    setTitle(title) {
        document.querySelector('.player__controls-title').textContent = title
    }

    setAuthor(author) {
        document.querySelector('.player__controls-author').textContent = author
    }

    setAvatar(avatar) {
        document.querySelector('.player__avatar-img').setAttribute('src', `./assets/images/avatars/${avatar}`)
    }

    setBackground(background) {
        document.querySelector('.background__img').setAttribute('src', `./assets/images/backgrounds/${background}`)
    }

    updateTime(e) {
        const { currentTime, duration } = e.srcElement
        const progress = document.querySelector('.player__controls-progress-thumb')
        document.querySelector('.player__controls-time-current').textContent = formatTime(currentTime)
        document.querySelector('.player__controls-time-length').textContent = formatTime(duration)

        progress.style.width = `${timeToPercent(currentTime, duration)}%`
    }

    setPlaylist(playlist) {
        const boxPlaylist = document.querySelector('.player__controls-playlist-list')
        boxPlaylist.innerHTML = ``
        const queue = new Queue(playlist)

        for (var song of playlist) {
            var item = document.createElement('li')
            item.classList.add('player__controls-playlist-item')
            item.innerHTML = `
            <h2 class="player__controls-playlist-item-name">${song.title}</h2>
            <span class="player__controls-playlist-item-author">${song.author}</span>
            `
            boxPlaylist.appendChild(item)
        }

        const playlistItem = document.querySelectorAll('.player__controls-playlist-item')
        for (var i = 0; i < playlistItem.length; i++) (function(i) {
            playlistItem[i].addEventListener('click', function (e) {
                var id = i
                queue.loadSong(id)
            })
        })(i)
    }
}

class Queue {
    constructor(playlist) {
        this.songIndex = 0
        this.song = {}
        this.ui = new UI()
        this.playlist = playlist
        this.shuffle = false
    }

    loadSong(index) {
        const song = new Song(this.shuffle ? playlist[Math.floor(Math.random() * playlist.length)] : playlist[index ? index : this.songIndex])
        const ui = new UI()
        ui.setTitle(song.title)
        ui.setAuthor(song.author)
        ui.setAvatar(song.avatar)
        ui.setBackground(song.background)
        ui.setPlaylist(this.playlist)
        song.play()

        this.song = song
    }

    nextSong() {
        if (!this.shuffle)
            this.songIndex += 1

        if (this.songIndex > this.playlist.length - 1) {
            this.songIndex = 0
        }
        this.loadSong(this.songIndex)
    }

    prevSong() {
        this.songIndex -= 1

        if (this.songIndex < 0) {
            this.songIndex = 0
        }
        this.loadSong(this.songIndex)
    }

    setShuffle(shuffle = true) {
        this.shuffle = shuffle
    }
}

function formatTime(second) {
    let hours = !second ? '0' : Math.floor(second / 3600);
    let minutes = !second ? '0' : Math.floor((second - hours * 3600) / 60);
    let seconds = !second ? '0' : Math.floor(second - hours * 3600 - minutes * 60);

    hours = hours < 10 ? (hours > 0 ? '0' + hours : 0) : hours;

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds;
}

function timeToPercent(currentTime, duration) {
    return (currentTime / duration) * 100
}