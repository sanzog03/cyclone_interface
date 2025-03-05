import ReactDOM from "react-dom/client";
import IconButton from "@mui/material/IconButton";
import ColorizeIcon from '@mui/icons-material/Colorize';
import Tooltip from '@mui/material/Tooltip';

const Intensity = ({onClickHandler, iconClicked}) => {
    return (
        <Tooltip title="Layer Intensity">
            <IconButton 
              className="menu-open-icon"
              style={{
                backgroundColor: !iconClicked ? "": "var(--main-blue)",
                color: !iconClicked ? "var(--main-blue)" : "white"
              }}
              onClick={onClickHandler}
            >
                <ColorizeIcon 
                  className="map-control-icon"
                  style={{
                    color: !iconClicked ? "var(--main-blue)" : "white"
                  }}  
                />
            </IconButton>
        </Tooltip>
    );
}

export class IntensityControl {
    constructor(handleClick, isClicked) {
        this.root = null;
        this._map = null;
        this._onClick = handleClick;
        this.isClicked = isClicked
    }

    onAdd = (map) => {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        const root = ReactDOM.createRoot(this._container);
        root.render(<Intensity onClickHandler={this._onClick} iconClicked={this.isClicked}/>);
        this.root = root;
        return this._container;
    }

    onRemove = () => {
        setTimeout(() => {
            try {
                this.root.unmount();
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            } catch (err) {
                console.warn("Error during cleanup:", err);
            }
        }, 0);
    }
}
