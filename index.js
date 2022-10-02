const {format: formatCSV} = require('@fast-csv/format');
const {dateRange, format, addDays} = require("./app/dates");
const axios = require('axios').default;
const fs = require('fs');

const startDate = new Date(2021, 4, 1, 9, 0, 0, 0);
const endDate = new Date();
const arguments = process.argv;

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

if (arguments.length >= 5) {
    const username = arguments[2];
    const password = arguments[3];
    const applicationId = arguments[4];

    run(username, password, applicationId);
} else {
    console.log("--- Usage ---");
    console.log("npm start <username> <password> <applicationId>");
}

function writeToCsv(data, fileName) {
    const csvFile = fs.createWriteStream(fileName);
    const stream = formatCSV();
    stream.pipe(csvFile);
    data.forEach(row => {
        stream.write(row);
    });
    stream.end();
}

function resource(resourceId, resourceName, token, applicationId) {
    Promise.all(
        dateRange(startDate, endDate, 10).map(date => {
                const from = format(date);
                const to = format(addDays(date, 10));
                return instance.get("https://api.glowmarkt.com/api/v0-1/resource/" + resourceId +
                    "/readings", {
                    headers: {
                        'token': token,
                        'applicationId': applicationId
                    },
                    params: {
                        period: "PT30M",
                        function: "sum",
                        from: from,
                        to: to,
                        offset: 0
                    }
                }).then(function (response) {
                    return response.data.data;
                }).catch(function (error) {
                    console.error(error);
                });
            }
        )
    ).then(function (responses) {
        if (responses.length > 0) {
            const concat = responses.reduce(
                (concatenating, response) => concatenating.concat(response),
                [])
            writeToCsv(concat, resourceName + ".csv");
        } else {
            console.log("No resource data returned for date range")
        }
    }).catch(function (error) {
        console.error(error);
    })
}

function resources(token, applicationId) {
    instance.get("https://api.glowmarkt.com/api/v0-1/resource", {
        headers: {
            'token': token,
            'applicationId': applicationId
        }
    }).then(function (response) {
        response.data.forEach(resourceData =>
            resource(resourceData['resourceId'], resourceData['classifier'], token, applicationId)
        )
    }).catch(function (error) {
        console.error(error);
    });
}

function run(username, password, applicationId) {
    instance.post('https://api.glowmarkt.com/api/v0-1/auth', {
        username: username,
        password: password
    }, {
        headers: {
            'applicationId': applicationId
        }
    }).then(function (response) {
        resources(response.data.token, applicationId);
    }).catch(function (error) {
        console.log(error);
    });
}
