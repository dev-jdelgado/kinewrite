import SvgGuide from "../SvgGuide";
import guideStroke from "../guideStroke";

const Curves = () => {

    const curves = [0, 1, 2];

    return (

        <SvgGuide>

            {curves.map((index) => {

                const offsetX = index * 300;

                return (

                    <path
                        key={index}
                        d={`
                            M ${280 + offsetX} 120

                            C ${180 + offsetX} 120,
                              ${120 + offsetX} 190,
                              ${120 + offsetX} 300

                            C ${120 + offsetX} 410,
                              ${180 + offsetX} 480,
                              ${280 + offsetX} 480
                        `}
                        {...guideStroke}
                    />

                );

            })}

        </SvgGuide>

    );

};

export default Curves;