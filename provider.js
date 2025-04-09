async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
  await loadTool('AIScheduleTools');
  
  // 定义通用的错误信息
  const ERROR_INVALID_TERM = '获取学年学期数据失败，请检查网络连接,或在其他地点已登录';
  const ERROR_NETWORK = '网络请求失败，请检查网络连接,或在其他地点已登录';
  const ERROR_START_DATE = '获取开学日期失败，请检查网络连接,或者在其他地点已登录';
  const DOMAIN = 'jwgl.suse.edu.cn';
  const IP = '219.221.176.145';

  // 提取学年和学期
  const termData = dom.querySelector('#kbgrid_table_0 > tbody > tr:nth-child(1) > td > div.timetable_title > h6.pull-left');
  if (!termData) {
    await AIScheduleAlert(ERROR_INVALID_TERM);
    return 'do not continue';
  }
  console.log(termData.textContent);
  
  const yearMatch = termData.textContent.match(/\d{4}/);
  const termMatch = termData.textContent.match(/第(\d)学期/);
  
  if (!yearMatch || !termMatch) {
    await AIScheduleAlert(ERROR_INVALID_TERM);
    return 'do not continue';
  }
  
  const year = yearMatch[0];
  let term = termMatch[1];
  
  console.log(`学年: ${year}, 学期: ${term}`);
  
  // 学期1 对应 3 ，学期2 对应 12 ，学期3 对应 16 用map映射
  const termMap = {
    '1': '3',
    '2': '12',
    '3': '16'
  };

  term = termMap[term] || null;
  
  if (!term) {
    await AIScheduleAlert(ERROR_INVALID_TERM);
    return 'do not continue';
  }
  
  console.log(`学期: ${term}`);

  // 提取开学日期
  function extractStartDate(scheduleInfo) {
    const dateRangeRegex = /\((\d{4}-\d{2}-\d{2})至\d{4}-\d{2}-\d{2}\)/;
    const match = scheduleInfo.match(dateRangeRegex);
    if (match && match[1]) {
      console.log('开学时间：', match[1]);
      return match[1];
    }
    return null;
  }

  // 使用Fetch请求教务的接口
  async function fetchSchedule(baseURL) {
    const url = `${baseURL}/kbcx/xskbcx_cxXsgrkb.html?gnmkdm=N2151`;
    try {
      const res = await fetch(url, {
        "body": `xnm=${year}&xqm=${term}&kzlx=ck&xsdm=`,
        "method": "POST",
        "credentials": "include",
        "headers": {
          "Accept": "*/*",
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          "X-Requested-With": "XMLHttpRequest"
        },
      });
      
      const semesterData = await fetch(`${baseURL}/xtgl/index_cxAreaSix.html?localeKey=zh_CN&gnmkdm=index`, {
        "headers": {
          "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
      
      const semesterInfo = await semesterData.text();
      const startDate = extractStartDate(semesterInfo);
      
      if (!startDate) {
        await AIScheduleAlert(ERROR_START_DATE);
        return 'do not continue';
      }
      
      const startDateTimestamp = new Date(startDate).getTime().toString();
      console.log(`startDateTimestamp: ${startDateTimestamp}`);

      if (res.ok) {
        const data = await res.json();
        if (data.kbList) {
          const result = {
            startDate: startDateTimestamp,
            kbList: data.kbList
          };
          return JSON.stringify(result);
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
    return null;
  }

  // 尝试使用域名访问，如果失败则切换到使用IP地址
  let result = await fetchSchedule(`https://${DOMAIN}`);
  if (!result) {
    result = await fetchSchedule(`http://${IP}`);
  }

  if (!result) {
    await AIScheduleAlert(ERROR_NETWORK);
    return 'do not continue';
  }

  return result;
}