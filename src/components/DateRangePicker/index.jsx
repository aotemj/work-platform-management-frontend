/**
 * 日期选择组件 日期有间隔最大默认31， 自动补齐开始及结束时分秒
 */
import React, {useState} from 'react';
import {DatePicker} from '@osui/ui';
import moment from 'moment';

const {RangePicker} = DatePicker;

const DateRangePicker = ({handleChangeDate, dateRange = 31}) => {
    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState();
    const disabledDate = current => {
        if (!dates || dates.length === 0) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > dateRange;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > dateRange;
        return tooEarly || tooLate;
    };

    const onOpenChange = open => {
        if (open) {
            setHackValue([]);
            setDates([]);
        } else {
            setHackValue(undefined);
        }
    };

    const onDateChange = val => {
        setValue(val);
        let beginTime = '';
        let endTime = '';
        if (val) {
            beginTime = Date.parse(`${moment(val[0]).format('YYYY-MM-DD')} 00:00:00`);
            endTime = Date.parse(`${moment(val[1]).format('YYYY-MM-DD')} 23:59:59`);
        }
        handleChangeDate({
            beginTime,
            endTime,
        });
    };

    return (
        <>
            {/* 时间段选择做多31天 */}
            <RangePicker
                value={hackValue || value}
                disabledDate={disabledDate}
                onCalendarChange={val => setDates(val)}
                onChange={val => onDateChange(val)}
                onOpenChange={onOpenChange}
            />
        </>
    );
};

export default DateRangePicker;
