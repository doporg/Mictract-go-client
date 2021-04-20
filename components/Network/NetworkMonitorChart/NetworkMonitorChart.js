import * as echarts from 'echarts';
import {useEffect, useState} from "react";
import moment from "moment";
import {handleErrorWithMessage} from "components/MenuLayout/MenuLayout";
import api from "api";
import {Row, Col, Slider, InputNumber, Form} from "antd";
import {Subject} from "rxjs";
import {debounceTime, throttleTime} from "rxjs/operators";

const renderGraph = (id, result, useByteFormatter) => {
    const getPodName = name => name.split('-').slice(0, -2).join('-');
    const header = [ 'PodName', 'Timestamp', 'Value' ];
    const rows = result
        .map(item => [ getPodName(item.metric.pod), item.values ])
        .flatMap(([ name, values ]) => values.map(v => [name, ...v]))

    const source = [ header, ...rows ];
    const sourceWithFilter = result
        .map(item => getPodName(item.metric.pod))
        .map(name => ({
            id: name,
            fromDatasetId: 'result',
            transform: [
                {
                    type: 'filter',
                    config: {
                        dimension: 'PodName', '=': name
                    }
                },
                {
                    type: 'sort',
                    config: {
                        dimension: 'Timestamp', order: 'asc'
                    }
                },
            ]
        }));

    const series = result
        .map(item => getPodName(item.metric.pod))
        .map(name => ({
            type: 'line',
            datasetId: name,
            showSymbol: false,
            name,
            endLabel: {
                show: true,
                formatter: params => params.value[0],
            },
            labelLayout: { moveOverlap: 'shiftY' },
            emphasis: { focus: 'series' },
            encode: {
                x: 'Timestamp',
                y: 'Value',
                label: [ 'PodName', 'Value' ],
                itemName: 'Timestamp',
                tooltip: [ 'Value' ],
            }
        }));

    const byteFormatter = byte => {
        const metrics = [ 'B', 'KB', 'MB' ];
        let idx = 0;
        while (idx !== metrics.length - 1 && byte >= 1024) {
            byte /= 1024;
            idx++;
        }
        return Math.floor(byte) + metrics[idx];
    }

    const timestampFormatter = timestamp => moment.unix(timestamp).format('YYYY-MM-DD h:mm:ss');
    const option = {
        dataset: [{
            id: 'result',
            source
        }].concat(sourceWithFilter),
        series,
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            nameLocation: 'middle',
            axisLabel: { formatter: timestampFormatter }
        },
        yAxis: { },
        grid: { right: 200, left: 50 },
        animationDuration: 1000,
    };

    if (useByteFormatter)
        option.yAxis.axisLabel= { formatter: byteFormatter }

    echarts
        .init(document.getElementById(id))
        .setOption(option);
};

const
    THROTTLE_TIME = 1000,
    DEBOUNCE_TIME = 1000;

const Controller = ({ initalMinuteRange, minuteRangeChange$ }) => {
    const [ minuteRange, setMinuteRange ] = useState(initalMinuteRange);

    const handleMinuteRange = value => {
        setMinuteRange(value);
        minuteRangeChange$.next(value);
    };

    return (
        <Form>
            <Form.Item label={'显示时长'}>
                <Row>
                    <Col span={3}>
                        <Slider
                            min={5}
                            max={6*60}
                            onChange={handleMinuteRange}
                            value={typeof minuteRange === 'number' ? minuteRange : 0}
                        />
                    </Col>
                    <Col span={3}>
                        <InputNumber
                            min={5}
                            max={6*60}
                            style={{ margin: '0 16px' }}
                            value={minuteRange}
                            onChange={handleMinuteRange}
                            step={5}
                            formatter={value => `${value} 分钟`}
                        />
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    );
};

const NetworkMonitorChart = ({ id, query, useByteFormatter }) => {
    const [ minuteRange, setMinuteRange ] = useState(60);

    // NOTE: This subject must be outside Controller.
    // When the Slider and InputNumber state changed, the Controller component also changes.
    // Then your throttle and debounce will be useless.
    const minuteRangeChange$ = new Subject();
    minuteRangeChange$
        .pipe(
            throttleTime(THROTTLE_TIME),
            debounceTime(DEBOUNCE_TIME),
        ).subscribe(setMinuteRange);

    useEffect(() => {
        (async () => {
            try {
                const [ start, end ] = [moment().subtract(minuteRange, 'minutes').unix(), moment().unix()];
                const step = minuteRange / 50;

                const { data } = await api.monitorByQueryRange({ query, start, end, step: `${Math.floor(step)*60+1}s` });
                renderGraph(id, data.data.result, useByteFormatter);
            } catch (e) {
                handleErrorWithMessage(e, {
                    message: 'get monitor data failed'
                });
            }
        })()
    }, [ minuteRange ]);

    return (
        <div>
            <Controller
                minuteRangeChange$={minuteRangeChange$}
                initalMinuteRange={60}
            />
            <div id={id} style={{ height: '400px', width: '100%' }}/>
        </div>
    );
};

export default NetworkMonitorChart;
