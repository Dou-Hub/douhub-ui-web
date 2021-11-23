import _ from '../../../shared/util/base';
import React from 'react';
import ContentLoader from 'react-content-loader';

const SectionLoader = (props) => {
    const {id} = props;
    const barHeight = 15;
    const barCount = 5;
    const barSpace = 15;
    const height = barHeight * barCount * barSpace;
    const width = 450;
    return <div className="section section-loader">
        <ContentLoader
            uniqueKey={id}
            speed={2}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            {_.map(new Array(barCount), (r, i) => {
                return <rect key={i} x={0} y={i * (barHeight + barSpace)} rx={5} ry={5} width={width * (barCount - i) / barCount - 10} height={barHeight} />
            })}

        </ContentLoader>
    </div>
};

export default SectionLoader;