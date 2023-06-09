// Playlist button
const playlistBtn = document.getElementById('playlistBtn')
const playlistGroup = document.querySelector('.player__controls-playlist')
const playlistCloseBtn = document.querySelector('.player__controls-playlist-close')

playlistBtn.addEventListener('click', (e) => {
    playlistGroup.classList.add('player__controls-playlist--active')
})

playlistCloseBtn.addEventListener('click', (e) => {
    playlistGroup.classList.remove('player__controls-playlist--active')
})

// Player onload
window.onload = function () {
    const queue = new Queue(playlist)
    queue.callback = queue
    queue.loadSong()

    // Queue event
    queue.song.source.addEventListener('timeupdate', function (e) {
        queue.ui.updateTime(e)
    })

    queue.song.source.addEventListener('ended', function (e) {
        queue.nextSong()
    })

    // Prev button
    prevBtn.addEventListener('click', function () {
        queue.prevSong()
    })

    // Next button
    nextBtn.addEventListener('click', function () {
        queue.nextSong()
    })

    loopBtn.addEventListener('click', function () {
        if (queue.song.source.loop) {
            loopBtn.classList.remove('player__controls-switch-loop--active')
            queue.song.source.loop = false
        } else {
            loopBtn.classList.add('player__controls-switch-loop--active')
            queue.song.source.loop = true
        }
    })

    shuffleBtn.addEventListener('click', function () {
        if (queue.shuffle) {
            shuffleBtn.classList.remove('player__controls-switch-shuffle--active')
            queue.setShuffle(false)
        } else {
            shuffleBtn.classList.add('player__controls-switch-shuffle--active')
            queue.setShuffle(true)
        }
    })

    // Play button
    playBtn.addEventListener('click', function () {
        if (queue.song.source.paused) {
            this.classList.add('player__controls-action-play--active')
            queue.song.play()
        } else {
            this.classList.remove('player__controls-action-play--active')
            queue.song.pause()
        }
    })

    // Progress change
    progress.addEventListener('click', function (e) {
        var percent = (e.offsetX / progress.offsetWidth) * 100
        var seekTime = queue.song.source.duration * (percent / 100)
        queue.loadSong(seekTime)
    })



    // Particles
    Particles.init({
        selector: '.background__particles',
        color: '#eeeeee',
        maxParticles: 40,
        connectParticles: true,
        speed: 1.2
    });
}