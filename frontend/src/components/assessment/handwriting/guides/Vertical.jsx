import SvgGuide from "../SvgGuide";
import guideStroke from "../guideStroke";

const columns = [140, 280, 420, 560, 700, 840];

const Vertical = () => {
    return (
        <SvgGuide>
            {columns.map((x) => (
                <line
                    key={x}
                    x1={x}
                    y1="80"
                    x2={x}
                    y2="520"
                    {...guideStroke}
                />
            ))}
        </SvgGuide>
    );
};

export default Vertical;