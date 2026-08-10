import SvgGuide from "../SvgGuide";
import guideStroke from "../guideStroke";

const rows = [100, 200, 300, 400, 500];

const Horizontal = () => {
    return (
        <SvgGuide>
            {rows.map((y) => (
                <line
                    key={y}
                    x1="120"
                    y1={y}
                    x2="880"
                    y2={y}
                    {...guideStroke}
                />
            ))}
        </SvgGuide>
    );
};

export default Horizontal;