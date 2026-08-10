import Horizontal from "./guides/Horizontal";
import Vertical from "./guides/Vertical";
import Diagonal from "./guides/Diagonal";
import Zigzag from "./guides/Zigzag";
import Wave from "./guides/Wave";
import Circle from "./guides/Circle";
import Curves from "./guides/Curves";

const guides = {
    horizontal: Horizontal,
    vertical: Vertical,
    diagonal: Diagonal,
    zigzag: Zigzag,
    wave: Wave,
    circle: Circle,
    curves: Curves,
};

const StrokeGuide = ({ type }) => {

    if (!type) {

        return null;

    }

    const Guide = guides[type.toLowerCase()];

    if (!Guide) {

        return null;

    }

    return <Guide />;

};

export default StrokeGuide;