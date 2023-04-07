const audio = document.querySelector('#audio')
const playBtn = document.querySelector('.player__controls-action-play')
const nextBtn = document.querySelector('.player__controls-action-next')
const prevBtn = document.querySelector('.player__controls-action-prev')
const loopBtn = document.querySelector('.player__controls-switch-loop')
const shuffleBtn = document.querySelector('.player__controls-switch-shuffle')
const progress = document.querySelector('.player__controls-progress')
const progressThumb = document.querySelector('.player__controls-progress-thumb')

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
        this.source.play()
    }

    pause() {
        this.source.pause()
    }

    time() {
        return new Promise((resolve, reject) => {
            this.source.addEventListener('loadedmetadata', function (e) {
                const { currentTime, duration } = e.srcElement

                resolve({
                    currentTime,
                    duration
                })
            })
        })
    }
}

class UI {
    setTitle(title) {
        document.querySelector('.player__controls-title').textContent = title
        document.querySelector('title').textContent = title
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

    setTime({ current, duration }) {
        document.querySelector('.player__controls-time-current').textContent = formatTime(current)
        document.querySelector('.player__controls-time-length').textContent = formatTime(duration)
    }

    updateTime(e) {
        const { currentTime, duration } = e.srcElement
        document.querySelector('.player__controls-time-current').textContent = formatTime(currentTime)
        document.querySelector('.player__controls-time-length').textContent = formatTime(duration)

        progressThumb.style.width = `${timeToPercent(currentTime, duration)}%`
    }

    setPlaylist(playlist, queue) {
        const boxPlaylist = document.querySelector('.player__controls-playlist-list')
        boxPlaylist.innerHTML = ``

        for (var song of playlist) {
            var item = document.createElement('li')
            item.classList.add('player__controls-playlist-item')
            item.innerHTML = `
                <h2 class="player__controls-playlist-item-name">${song.title}</h2>
                <span class="player__controls-playlist-item-author">${song.author}</span>
            `
            boxPlaylist.appendChild(item)

            const playlistItem = document.querySelectorAll('.player__controls-playlist-item')
            for (var i = 0; i < playlistItem.length; i++) (function (i) {
                playlistItem[i].addEventListener('click', function (e) {
                    queue.setIndex(i)
                    queue.loadSong()
                })
            })(i)
        }
    }
}

class Queue {
    constructor(playlist) {
        this.songIndex = 0
        this.ui = false
        this.playlist = playlist
        this.shuffle = false
        this.callback = false
    }

    setIndex(index) {
        this.songIndex = index
    }

    getIndex() {
        return this.songIndex
    }

    loadSong(time = 0) {
        const song = new Song(this.shuffle ? playlist[Math.floor(Math.random() * playlist.length)] : playlist[this.songIndex])
        const ui = new UI()
        this.song = song
        this.ui = ui
        ui.setTitle(this.song.title)
        ui.setAuthor(this.song.author)
        ui.setAvatar(this.song.avatar)
        ui.setBackground(this.song.background)
        ui.setPlaylist(this.playlist, this.callback)
        ui.setTime(this.song.time())
        this.song.source.currentTime = time
    }

    nextSong() {
        if (!this.shuffle)
            this.songIndex += 1

        if (this.songIndex > this.playlist.length - 1) {
            this.songIndex = 0
        }
        this.loadSong()
    }

    prevSong() {
        this.songIndex -= 1

        if (this.songIndex < 0) {
            this.songIndex = 0
        }
        this.loadSong()
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