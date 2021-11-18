function countIntervals(data) {
    const flatData = [];
    // Preprocess data
    data.forEach(function (value) {
        let v = [...Object.values(value)];
        let sched = Object.entries(v.pop());

        let start = JSON.parse(JSON.stringify(v));
        let end = JSON.parse(JSON.stringify(v))
        start.push(sched[0]);
        end.push(sched[1]);

        flatData.push(start, end)
    })
    console.log(flatData);
    // Sort data. If two point has the same times, put the 'end' point at front
    flatData.sort((a, b) => {
        let sub = a[2][1] - b[2][1];
        if (sub !== 0) return sub;
        return a[2][0] !== 'end' ? 1 : -1;
    });

    // Iterate list of point
    const result = {};
    const nameList =[];
    for (let i = 0; i < flatData.length; ++i) {
        // Add value for intervals
        if (i > 0) {
            let interval = flatData[i][2][1] - flatData[i - 1][2][1];
            if (interval > 0)
                result[`${flatData[i - 1][2][1]} - ${flatData[i][2][1]}`] = JSON.parse(JSON.stringify(nameList));
        }

        // Update count variable and name list of busy guests
        (flatData[i][2][0] === 'start') ? nameList.push(flatData[i][1]) :
            nameList.splice(nameList.findIndex(name => name === flatData[i][1]), 1);
    }
    return result;
}

// Input data is Array of {id: , name: ,sched: {start, end}}}
console.log(countIntervals([
    {
        id: 1,
        name: 'Alice',
        sched: { start: 3, end: 6 }
    },
    {
        id: 1,
        name: 'Alice',
        sched: { start: 8, end: 9 }
    },
    {
        id: 2,
        name: 'Job',
        calendars: { start: 1, end: 7 }
    },
    {
        id: 3,
        name: 'Mark',
        calendars: { start: 3, end: 5 }
    },
    {
        id: 3,
        name: 'Mark',
        calendars: { start: 6, end: 8 }
    },
    {
        id: 4,
        name: 'William',
        calendars: { start: 1, end: 7 }
    },
    {
        id: 5,
        name: 'Colby',
        calendars: { start: 5, end: 7 }
    },
]));
