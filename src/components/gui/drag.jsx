import React, { Component } from 'react'
import style from './drag.css'
class PopContainer extends Component {
    constructor(props) {
        super(props);
        this.windowH = document.body.clientHeight;
        this.windowW = document.body.clientWidth;
        this.state = {
            visible: true,
            player: '',
            videoUrl: '',
            styleTop: 20,
            styleLeft: 10,
            styleHeight: props.height || this.windowH * 0.85,
            styleWidth: props.width || this.windowW * 0.45,
        }
    }
    componentDidMount() {
        window.mythis = this;
        window.onShow = this.onShow;
        document.addEventListener('contextmenu', this.handleContextMenu);
        if (sessionStorage.videoUrl) {
            document.querySelector(".video-drag").volume = 0.7;
            this.setState({ videoUrl: sessionStorage.videoUrl });
            //监听播放时间
            var video = document.querySelector('.video-drag');
            //使用事件监听方式捕捉事件
            let lastCurrentTime = 0;
            video.addEventListener("timeupdate", function () {
                let CurrentTime = parseInt(video.currentTime)
                if (CurrentTime !== lastCurrentTime) {
                    var timeDisplay;
                    //用秒数来显示当前播放进度
                    timeDisplay = Math.floor(video.currentTime);
                    //当视频播放到 4s的时候做处理
                    if (sessionStorage.videoBreakpoints) {
                        sessionStorage.videoBreakpoints.split(',').forEach(item => {
                            if ((timeDisplay == Number(item))) {
                                //处理代码
                                video.pause()
                            } else if (video.currentTime == video.duration) {
                                // 暂不处理
                            }
                        })
                    }
                }
                lastCurrentTime = CurrentTime
            }, false);
            video.addEventListener("pause", function () {
                document.getElementsByClassName(style.videoInfo)[0].style.display = 'block'
            })
            video.addEventListener("play", function () {
                document.getElementsByClassName(style.videoInfo)[0].style.display = 'none'
            })
        } else {
            this.setState({ visible: false });
        }
    }
    //计算是否超出屏幕
    InWindow = (left, top, startPosX, startPosY) => {
        let H = document.body.clientHeight;
        let W = document.body.clientWidth;
        if ((left < 20 && startPosX > left) || (left > W - 20 && startPosX < left) ||
            (top < 20 && startPosY > top) || ((top > H - 20 && startPosY < top))) {
            return false
        }
        return true
    }
    onShow = () => {
        if (sessionStorage.videoUrl) {
            this.setState({ visible: true })
        }

    }
    playVideo = () => {
        let _video = document.querySelector('.video-drag');
        _video.play()
    }
    onClose = () => {
        let _video = document.querySelector('.video-drag');
        _video.pause()
        this.setState({ visible: false });
    }
    handleEnded = () => {

    }
    handleContextMenu = (event) => {
        event.preventDefault()
    }
    onMouseDown = e => {
        e.preventDefault();
        let startPosX = e.clientX;
        let startPosY = e.clientY;
        const { styleLeft, styleTop } = this.state;
        document.body.onmousemove = e => {
            let left = e.clientX - startPosX + styleLeft;
            let top = e.clientY - startPosY + styleTop;
            if (this.InWindow(e.clientX, e.clientY, startPosX, startPosY)) {
                this.setState({
                    styleLeft: left,
                    styleTop: top,
                })
            } else {
                document.body.onmousemove = null;
                document.body.onmouseup = null;
            }
        };
        document.body.onmouseup = function () {
            document.body.onmousemove = null;
            document.body.onmouseup = null;
        };
    };
    render() {
        const { styleLeft, styleTop, styleHeight, styleWidth } = this.state
        const { children, bodyStyle, title } = this.props
        return <div className={style.popContainer} style={{
            display: this.state.visible ? "block" : "none",
            left: styleLeft + 'px', top: styleTop + 'px',
        }}>
            <div className={style.header}>
                <div className={style.title} onMouseDown={this.onMouseDown} >{title}</div>
                <span className={style.close} onClick={this.onClose}>X</span>
            </div>
            <div className={style.content} style={{ ...bodyStyle }}>
                <video controls="controls" className='video-drag' controlsList="nodownload" style={{ width: '100%', height: '100%' }} src={this.state.videoUrl}

                ></video>
                <div className={style.videoInfo}>
                    <svg onClick={this.playVideo} t="1705369485376"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="5898" width="128" height="128">
                        <path
                            d="M0 512C0 229.23 229.23 0 512 0s512 229.23 512 512-229.23 512-512 512S0 794.77 0 512z m669.442 11.317c7.033-6.218 7.033-16.416 0-22.634L428.767 295.477c-3.475-3.15-7.695-4.477-11.832-4.477-8.935 0-17.374 6.301-17.374 15.753v410.494c0 9.452 8.44 15.753 17.374 15.753 4.137 0 8.357-1.41 11.832-4.477l240.675-205.206z"
                            fill="#f4ea2a" p-id="5899"></path>
                    </svg>
                </div>
            </div>

        </div>

    }
}

export default PopContainer;