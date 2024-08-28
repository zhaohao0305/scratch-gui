import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import Box from '../box/box.jsx';
import SpriteInfo from '../../containers/sprite-info.jsx';
import SpriteList from './sprite-list.jsx';
import ActionMenu from '../action-menu/action-menu.jsx';
import { STAGE_DISPLAY_SIZES } from '../../lib/layout-constants';
import { isRtl } from 'scratch-l10n';

import styles from './sprite-selector.css';

import fileUploadIcon from '../action-menu/icon--file-upload.svg';
import paintIcon from '../action-menu/icon--paint.svg';
import spriteIcon from '../action-menu/icon--sprite.svg';
import surpriseIcon from '../action-menu/icon--surprise.svg';
import searchIcon from '../action-menu/icon--search.svg';

const messages = defineMessages({
    addSpriteFromLibrary: {
        id: 'gui.spriteSelector.addSpriteFromLibrary',
        description: 'Button to add a sprite in the target pane from library',
        defaultMessage: 'Choose a Sprite'
    },
    addSpriteFromPaint: {
        id: 'gui.spriteSelector.addSpriteFromPaint',
        description: 'Button to add a sprite in the target pane from paint',
        defaultMessage: 'Paint'
    },
    addSpriteFromSurprise: {
        id: 'gui.spriteSelector.addSpriteFromSurprise',
        description: 'Button to add a random sprite in the target pane',
        defaultMessage: 'Surprise'
    },
    addSpriteFromFile: {
        id: 'gui.spriteSelector.addSpriteFromFile',
        description: 'Button to add a sprite in the target pane from file',
        defaultMessage: 'Upload Sprite'
    }
});

const SpriteSelectorComponent = function (props) {
    const {
        editingTarget,
        hoveredTarget,
        intl,
        onChangeSpriteDirection,
        onChangeSpriteName,
        onChangeSpriteRotationStyle,
        onChangeSpriteSize,
        onChangeSpriteVisibility,
        onChangeSpriteX,
        onChangeSpriteY,
        onDrop,
        onDeleteSprite,
        onDuplicateSprite,
        onExportSprite,
        onFileUploadClick,
        onNewSpriteClick,
        onPaintSpriteClick,
        onSelectSprite,
        onSpriteUpload,
        onSurpriseSpriteClick,
        raised,
        selectedId,
        spriteFileInput,
        sprites,
        stageSize,
        ...componentProps
    } = props;
    let selectedSprite = sprites[selectedId];
    let spriteInfoDisabled = false;
    if (typeof selectedSprite === 'undefined') {
        selectedSprite = {};
        spriteInfoDisabled = true;
    }
    const showDrag = () => {
        window.onShow();
    }
    const goWrok = () => {
        window.open('https://wendao.magaoedu.com/personalWorks')
    }
    const closeGuideTodo = ()=>{
        document.getElementsByClassName(styles.guide)[0].style.display = 'none'
    }
    const onShowguide = ()=>{
        document.getElementsByClassName(styles.guide)[0].style.display = 'block'
    }
    if(!sessionStorage.videoUrl && document.getElementsByClassName(styles.addButton)[0]){
        document.getElementsByClassName(styles.addButton)[0].style.display = 'none'
    }
    return (
        <Box
            className={styles.spriteSelector}
            {...componentProps}
        >
            {/* 角色属性大小、X、Y、方向 隐藏 */}
            {/* <SpriteInfo
                direction={selectedSprite.direction}
                disabled={spriteInfoDisabled}
                name={selectedSprite.name}
                rotationStyle={selectedSprite.rotationStyle}
                size={selectedSprite.size}
                stageSize={stageSize}
                visible={selectedSprite.visible}
                x={selectedSprite.x}
                y={selectedSprite.y}
                onChangeDirection={onChangeSpriteDirection}
                onChangeName={onChangeSpriteName}
                onChangeRotationStyle={onChangeSpriteRotationStyle}
                onChangeSize={onChangeSpriteSize}
                onChangeVisibility={onChangeSpriteVisibility}
                onChangeX={onChangeSpriteX}
                onChangeY={onChangeSpriteY}
            /> */}
            <div className={styles.guide}>
                <div className={styles.guideHeader}>
                     <span></span>
                    {/* <span style={{color:'#67C23A',fontWeight:'bold'}} >操作指南</span> */}
                    {/* <span className={styles.closeguid} onClick={closeGuideTodo}>关闭</span> */}
                    <img className={styles.closeguid}  onClick={closeGuideTodo} src={fileUploadIcon}  />
                </div>
                <div  style={{padding:'20px'}} >
                    <b> 鼠标左键: </b> 销毁方块 <br />
                    <b> 鼠标右键: </b> 放置方块或模型 <br />
                    <b> 数字按键: </b> 切换方块类型 <br />
                    <b> 鼠标滚轮: </b> 切换模型 <br />
                    <b> 空格: </b> 跳跃 / 飞翔<br />
                    <b> Shift:</b> 往下飞 <br />
                    <b> Q: </b> 切换上帝模式 <br />
                    <b> F: </b> 全屏 <br />
                    <b> E: </b> 菜单 <br />
                    <b> 8: </b> 选择模型 <br />
                    <b> B: </b> 打开 / 关闭 模型背包 <br />
                    <b> P: </b> 截图 <br />
                    <b> Ctrl+Enter: </b> 执行Scratch代码 <br />
                </div>
            </div>
            <SpriteList
                editingTarget={editingTarget}
                hoveredTarget={hoveredTarget}
                items={Object.keys(sprites).map(id => sprites[id])}
                raised={raised}
                selectedId={selectedId}
                onDeleteSprite={onDeleteSprite}
                onDrop={onDrop}
                onDuplicateSprite={onDuplicateSprite}
                onExportSprite={onExportSprite}
                onSelectSprite={onSelectSprite}
            />
            {/* 上传角色的按钮 */}
            <ActionMenu
                className={styles.addButton}
                img={spriteIcon}
                title={''}
                onClick={()=>{
                    
                }}
                moreButtons={[
                    // {
                    //     title: intl.formatMessage(messages.addSpriteFromFile),
                    //     img: fileUploadIcon,
                    //     onClick: onFileUploadClick,
                    //     fileAccept: '.svg, .png, .bmp, .jpg, .jpeg, .sprite2, .sprite3, .gif',
                    //     fileChange: onSpriteUpload,
                    //     fileInput: spriteFileInput,
                    //     fileMultiple: true
                    // }, 
                    {
                        title: '打开视频',
                        img: surpriseIcon,
                        onClick: showDrag // TODO need real function for this
                    }, {
                        title: '查看我的作品',
                        img: paintIcon,
                        onClick: goWrok // TODO need real function for this
                    }, {
                        title: '查看游戏引导',
                        img: searchIcon,
                        onClick: onShowguide
                    }
                ]}
                
                tooltipPlace={isRtl(intl.locale) ? 'right' : 'left'}
                // onClick={showDrag}
            // onClick={onNewSpriteClick}
            />
        </Box>
    );
};

SpriteSelectorComponent.propTypes = {
    editingTarget: PropTypes.string,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool
    }),
    intl: intlShape.isRequired,
    onChangeSpriteDirection: PropTypes.func,
    onChangeSpriteName: PropTypes.func,
    onChangeSpriteRotationStyle: PropTypes.func,
    onChangeSpriteSize: PropTypes.func,
    onChangeSpriteVisibility: PropTypes.func,
    onChangeSpriteX: PropTypes.func,
    onChangeSpriteY: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onDrop: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onExportSprite: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    onPaintSpriteClick: PropTypes.func,
    onSelectSprite: PropTypes.func,
    onSpriteUpload: PropTypes.func,
    onSurpriseSpriteClick: PropTypes.func,
    raised: PropTypes.bool,
    selectedId: PropTypes.string,
    spriteFileInput: PropTypes.func,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            costume: PropTypes.shape({
                url: PropTypes.string,
                name: PropTypes.string.isRequired,
                bitmapResolution: PropTypes.number.isRequired,
                rotationCenterX: PropTypes.number.isRequired,
                rotationCenterY: PropTypes.number.isRequired
            }),
            name: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired
        })
    }),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired
};

export default injectIntl(SpriteSelectorComponent);
