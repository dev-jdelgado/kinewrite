import SvgGuide from "../SvgGuide";
import guideStroke from "../guideStroke";

const circles = [
    {
        cx: 250,
        cy: 300,
        r: 105,
    },
    {
        cx: 500,
        cy: 300,
        r: 105,
    },
    {
        cx: 750,
        cy: 300,
        r: 105,
    },
];

const Circle = () => {

    return (

        <SvgGuide>

            {circles.map((circle, index) => (

                <circle
                    key={index}
                    cx={circle.cx}
                    cy={circle.cy}
                    r={circle.r}
                    {...guideStroke}
                />

            ))}

        </SvgGuide>

    );

};

export default Circle;