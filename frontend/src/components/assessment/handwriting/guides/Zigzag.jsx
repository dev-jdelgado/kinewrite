import SvgGuide from "../SvgGuide";
import guideStroke from "../guideStroke";

const rows = [150, 300, 450];

const Zigzag = () => {

    return (

        <SvgGuide>

            {rows.map((y, row) => (

                <polyline
                    key={row}
                    points={`
                        100,${y + 60}
                        170,${y - 60}
                        240,${y + 60}
                        310,${y - 60}
                        380,${y + 60}
                        450,${y - 60}
                        520,${y + 60}
                        590,${y - 60}
                        660,${y + 60}
                        730,${y - 60}
                        800,${y + 60}
                        870,${y - 60}
                        940,${y + 60}
                    `}
                    {...guideStroke}
                />

            ))}

        </SvgGuide>

    );

};

export default Zigzag;