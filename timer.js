/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer({
  providerRes, parserRes
} = {}) {
  console.log(parserRes.something);
  return {
    totalWeek: 20, // 总周数：[1, 30]之间的整数
    startSemester: parserRes.something, // 开学日期时间戳
    startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
    showWeekend: false, // 是否显示周末
    forenoon: 5, // 上午课程节数：[1, 10]之间的整数
    afternoon: 5, // 下午课程节数：[0, 10]之间的整数
    night: 4, // 晚间课程节数：[0, 10]之间的整数
    sections: [{
      section: 1, // 节次：[1, 30]之间的整数
      startTime: '08:50', // 开始时间：参照这个标准格式5位长度字符串
      endTime: '09:35', // 结束时间：同上
    }, {
      section: 2, startTime: '09:45', endTime: '10:30',
    }, {
      section: 3, startTime: '10:45', endTime: '11:30',
    }, {
      section: 4, startTime: '11:40', endTime: '12:25',
    }, {
      section: 5, startTime: '12:30', endTime: '13:05',
    }, {
      section: 6, startTime: '13:10', endTime: '13:45',
    }, {
      section: 7, startTime: '13:50', endTime: '14:35',
    }, {
      section: 8, startTime: '14:45', endTime: '15:30',
    }, {
      section: 9, startTime: '15:45', endTime: '16:30',
    }, {
      section: 10, startTime: '16:40', endTime: '17:25',
    }, {
      section: 11, startTime: '18:30', endTime: '19:15',
    }, {
      section: 12, startTime: '19:25', endTime: '20:10',
    }, {
      section: 13, startTime: '20:20', endTime: '21:05',
    }, {
      section: 14, startTime: '21:15', endTime: '22:00',
    }]
  }
}
