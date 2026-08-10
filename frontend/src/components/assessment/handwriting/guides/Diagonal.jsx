import SvgGuide from "../SvgGuide";
import guideStroke from "../guideStroke";

const diagonals = [
    { x1: 180, y1: 120, x2: 820, y2: 40 },
    { x1: 180, y1: 210, x2: 820, y2: 130 },
    { x1: 180, y1: 300, x2: 820, y2: 220 },
    { x1: 180, y1: 390, x2: 820, y2: 310 },
    { x1: 180, y1: 480, x2: 820, y2: 400 },
];

const Diagonal = () => {
    return (
        <SvgGuide>
            {diagonals.map((line, index) => (
                <line
                    key={index}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    {...guideStroke}
                />
            ))}
        </SvgGuide>
    );
};

export default Diagonal;