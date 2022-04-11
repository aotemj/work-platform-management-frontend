// 磁盘占用 图表
import {useEffect, useRef} from 'react';
import * as echarts from 'echarts/core';
import {PieChart} from 'echarts/charts';
import {
    DatasetComponent,
    TransformComponent,
    LegendComponent,
} from 'echarts/components';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

import cx from './index.less';
import {byteToGage, diskWarning, TYPE_MESSAGES} from '../../../utils';

echarts.use([
    PieChart,
    DatasetComponent,
    LabelLayout,
    TransformComponent,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
]);

const PieCharts = ({diskSpaceInfo}) => {
    const ref = useRef();
    const chart = useRef();
    const updateChartOption = ({diskUsedSize, diskFreeSize}) => {
        const option =  {
            legend: {
                top: '5%',
                left: 'center',
            },
            label: {
                alignTo: 'edge',
                formatter: '{name|{b}}\n{size|{c} GB}',
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 15,
                rich: {
                    size: {
                        fontSize: 10,
                    },
                },
            },
            series: [
                {
                    type: 'pie',
                    data: [
                        {
                            value: byteToGage(diskUsedSize),
                            name: '已用磁盘空间',
                        },
                        {
                            value: byteToGage(diskFreeSize),
                            name: '剩余磁盘空间',
                        },
                    ],
                    radius: ['30%', '50%'],
                },
            ],
        };
        chart.current.setOption(option);
    };

    useEffect(() => {
        if (!diskSpaceInfo) {
            return;
        }
        let {diskUsedSize, diskFreeSize} = diskSpaceInfo;
        diskWarning(diskSpaceInfo, TYPE_MESSAGES.DISK_SPACE);
        updateChartOption({diskFreeSize, diskUsedSize});
    }, [diskSpaceInfo]);
    useEffect(() => {
        chart.current = echarts.init(ref.current, null, {renderer: 'canvas'});
        window.onresize = function () {
            chart.current.resize();
        };
    }, []);

    return (
        <div ref={ref} className={cx('pie-charts')}>test</div>
    );
};

export default PieCharts;




