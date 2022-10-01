const dates = require('./dates');

test('Find date range', () => {
    expect(dates.dateRange(new Date(2018, 11, 24, 10, 33, 30, 0),
        new Date(2019, 4, 11, 8, 10, 32, 0),
        50))
        .toStrictEqual([
            new Date(2018, 11, 24, 10, 33, 30, 0),
            new Date(2019, 1, 12, 10, 33, 30, 0),
            new Date(2019, 3, 3, 10, 33, 30, 0)
        ]);
});

test('Format date', () => {
    expect(dates.format(new Date(2018, 11, 24, 10, 33, 30, 0)))
        .toEqual("2018-12-24T10:33:30");
});

