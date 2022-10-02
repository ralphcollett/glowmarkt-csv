function addDays(previousDate, days) {
    let date = new Date(previousDate.getTime());
    date.setDate(previousDate.getDate() + days);
    return date;
}

function dateRange(start, end, dayIntervals) {
    let dateRange = [];
    let nextDate = new Date(start.getTime());
    do {
        dateRange.push(nextDate);
        nextDate = addDays(nextDate, dayIntervals);
    } while (nextDate.getTime() < end.getTime())
    return dateRange;
}

function format(date) {
    return date.toISOString().slice(0, 19);
}

function minimum(date1, date2) {
    return (date1.getTime() < date2.getTime()) ? date1 : date2;
}

exports.dateRange = dateRange;
exports.format = format;
exports.addDays = addDays;
exports.minimum = minimum;