import SvgGuide from "../SvgGuide";
import guideStroke from "../guideStroke";

const rows = [150, 300, 450];

const Wave = () => {

    return (

        <SvgGuide>

            {rows.map((y, row) => (

                <path
                    key={row}
                    d={`
                        M80 ${y}

                        Q140 ${y - 70} 200 ${y}

                        T320 ${y}

                        T440 ${y}

                        T560 ${y}

                        T680 ${y}

                        T800 ${y}

                        T920 ${y}
                    `}
                    {...guideStroke}
                />

            ))}

        </SvgGuide>

    );

};

export default Wave;