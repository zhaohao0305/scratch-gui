import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { setHoveredSprite } from '../reducers/hovered-target';
import { updateAssetDrag } from '../reducers/asset-drag';
import storage from '../lib/storage';
import VM from 'scratch-vm';
import getCostumeUrl from '../lib/get-costume-url';
import DragRecognizer from '../lib/drag-recognizer';
import { getEventXY } from '../lib/touch-utils';
import { getSpriteLibrary } from '../lib/assets-api';
import randomizeSpritePosition from '../lib/randomize-sprite-position';
import SpriteSelectorItemComponent from '../components/sprite-selector-item/sprite-selector-item.jsx';
import styles from '../components/gui/gui.css'
class SpriteSelectorItem extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, [
            'getCostumeData',
            'setRef',
            'handleClick',
            'handleDelete',
            'handleDuplicate',
            'handleExport',
            'handleMouseEnter',
            'handleMouseLeave',
            'handleMouseDown',
            'handleDragEnd',
            'handleDrag',
            'handleTouchEnd'
        ]);
        this.state = {
            data: [],
        };
        this.dragRecognizer = new DragRecognizer({
            onDrag: this.handleDrag,
            onDragEnd: this.handleDragEnd
        });
    }
    componentDidMount() {
        
        document.addEventListener('touchend', this.handleTouchEnd);
        window.myprops = this.props;
        window.mythis = this;
        window.changeRole = this.swiRole;
        window.delRole = this.delRole;
        window.createRole = this.createRole;
        // let element =  document.getElementsByClassName(styles.leftTip)[0];
        // let flag = false;
        // let interval =  setInterval(()=>{
        //     if(flag){
        //         element.style.display = 'none'; 
        //     }else{
        //         element.style.display = 'block'; 
        //     }
        //     flag = !flag;
        // },500);
        // setTimeout(() => {
        //     clearInterval(interval);
        //     interval = null;
        //     element.style.display = 'none'; 
        // }, 3000);
        setTimeout(() => {
            getSpriteLibrary().then(data => {
                data = data.concat(this.state.data)
                this.setState({
                    data: data,
                })
                if (window.mcArr?.length) {
                    window.mcArr.forEach((item, index) => {
                      if (item.sprite.name == "角色1") {
                        this.delRole(item.id);
                        window.mcArr.splice(index, 1);
                      }
                    })
                }
            })
            
        }, 100);
    }
    componentWillUnmount() {
        document.removeEventListener('touchend', this.handleTouchEnd);
        this.dragRecognizer.reset();

    }
    getCostumeData() {
        if (this.props.costumeURL) return this.props.costumeURL;
        if (!this.props.asset) return null;

        return getCostumeUrl(this.props.asset);
    }
    handleDragEnd() {
        if (this.props.dragging) {
            this.props.onDrag({
                img: null,
                currentOffset: null,
                dragging: false,
                dragType: null,
                index: null
            });
        }
        setTimeout(() => {
            this.noClick = false;
        });
    }
    handleDrag(currentOffset) {
        this.props.onDrag({
            img: this.getCostumeData(),
            currentOffset: currentOffset,
            dragging: true,
            dragType: this.props.dragType,
            index: this.props.index,
            payload: this.props.dragPayload
        });
        this.noClick = true;
    }
    handleTouchEnd(e) {
        const { x, y } = getEventXY(e);
        const { top, left, bottom, right } = this.ref.getBoundingClientRect();
        if (x >= left && x <= right && y >= top && y <= bottom) {
            this.handleMouseEnter();
        }
    }
    handleMouseDown(e) {
        this.dragRecognizer.start(e);
    }
    getFilteredData() {
        if (!this.state.filterQuery) return this.state.data;
        return this.state.data.filter(dataItem => (
            (dataItem.tags || [])
                // Second argument to map sets `this`
                .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                .concat(dataItem.name ?
                    (typeof dataItem.name === 'string' ?
                        // Use the name if it is a string, else use formatMessage to get the translated name
                        dataItem.name : this.props.intl.formatMessage(dataItem.name.props)
                    ).toLowerCase() :
                    null)
                .join('\n') // unlikely to partially match newlines
                .indexOf(this.state.filterQuery.toLowerCase()) !== -1
        ));
    }
    //切换角色
    swiRole(id) {
        window.myprops.onClick(id);
    }
    // 删除角色
    delRole(id) {
        window.myprops.onDeleteButtonClick(id);
    }
    createRole(id) {
        let item = window.mythis.getFilteredData()[id];
        window.myprops.vm.addSprite(JSON.stringify(item)).then(() => {
            // 暂时注销掉 因为他父级上没有onActivateBlocksTab 这个方法      
            // window.myprops.onActivateBlocksTab();
        });
    }
    // 切换角色
    handleClick(e) {
        e.preventDefault();
        if (!this.noClick) {
            this.props.onClick(this.props.id);
        }
        window.mcArr.forEach(item => {
            if (item.id == this.props.id) {
                mywebGame.window.talk(item.mcID, "I'm here", 0.7);
                // mywebGame.window.findModel(item.mcID);
            }
        });

    }
    // 删除角色
    handleDelete(e) {
        let result = confirm("你确定要删除这个角色吗？");
        if (result) {
            window.mcArr.forEach((item,index) => {
                if (item.id == this.props.id) {
                    window.mcArr.splice(index,1);
                    mywebGame.window.removeModel(item.mcID);
                }
            })
            e.stopPropagation(); // To prevent from bubbling back to handleClick
            this.props.onDeleteButtonClick(this.props.id);
        } else {
            console.log("操作已取消");
        }
       
    }
    handleDuplicate(e) {
        e.stopPropagation(); // To prevent from bubbling back to handleClick
        this.props.onDuplicateButtonClick(this.props.id);


    }
    handleExport(e) {
        e.stopPropagation();
        this.props.onExportButtonClick(this.props.id);
    }
    handleMouseLeave() {
        this.props.dispatchSetHoveredSprite(null);
    }
    handleMouseEnter() {
        this.props.dispatchSetHoveredSprite(this.props.id);
    }
    setRef(component) {
        // Access the DOM node using .elem because it is going through ContextMenuTrigger
        this.ref = component && component.elem;
    }
    render() {
        const {
            /* eslint-disable no-unused-vars */
            asset,
            id,
            index,
            onClick,
            onDeleteButtonClick,
            onDuplicateButtonClick,
            onExportButtonClick,
            dragPayload,
            receivedBlocks,
            costumeURL,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            <SpriteSelectorItemComponent
                componentRef={this.setRef}
                costumeURL={this.getCostumeData()}
                preventContextMenu={this.dragRecognizer.gestureInProgress()}
                onClick={this.handleClick}
                onDeleteButtonClick={onDeleteButtonClick ? this.handleDelete : null}
                onDuplicateButtonClick={onDuplicateButtonClick ? this.handleDuplicate : null}
                onExportButtonClick={onExportButtonClick ? this.handleExport : null}
                onMouseDown={this.handleMouseDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                {...props}
            />
        );
    }
}

SpriteSelectorItem.propTypes = {
    asset: PropTypes.instanceOf(storage.Asset),
    costumeURL: PropTypes.string,
    dispatchSetHoveredSprite: PropTypes.func.isRequired,
    dragPayload: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dragType: PropTypes.string,
    dragging: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.number,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDrag: PropTypes.func.isRequired,
    onDuplicateButtonClick: PropTypes.func,
    onExportButtonClick: PropTypes.func,
    receivedBlocks: PropTypes.bool.isRequired,
    selected: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = (state, { id }) => ({
    dragging: state.scratchGui.assetDrag.dragging,
    receivedBlocks: state.scratchGui.hoveredTarget.receivedBlocks &&
        state.scratchGui.hoveredTarget.sprite === id,
    vm: state.scratchGui.vm
});
const mapDispatchToProps = dispatch => ({
    dispatchSetHoveredSprite: spriteId => {
        dispatch(setHoveredSprite(spriteId));
    },
    onDrag: data => dispatch(updateAssetDrag(data))
});

const ConnectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(SpriteSelectorItem);

export default ConnectedComponent;
