async function scheduleHtmlProvider() {
  await loadTool('AIScheduleTools');
  // 定义通用的错误信息
  const ERROR_INVALID_YEAR = '请输入正确的学年';
  const ERROR_INVALID_TERM = '请输入正确的学期';
  const ERROR_NETWORK = '网络请求失败，请检查网络连接';
  const DOMAIN = 'jwgl.suse.edu.cn';
  const IP = '219.221.176.145';

  // 提取通用的验证函数
  function validateYear(value) {
    const v = parseInt(value, 10); // 显式指定基数为10
    if (isNaN(v) || v < 2000 || v > 2100) {
      return ERROR_INVALID_YEAR;
    }
    return false; // 表示验证通过
  }

  function validateTerm(value) {
    if (value !== '3' && value !== '12' && value !== '16') {
      return ERROR_INVALID_TERM;
    }
    return false; // 表示验证通过
  }

  // 获取学年
  const year = await AISchedulePrompt({
    titleText: '学年',
    tipText: '输入本学年开始的年份',
    defaultText: '2024',
    validator: validateYear
  });

  // 获取学期
  const term = await AISchedulePrompt({
    titleText: '学期',
    tipText: '输入本学期的学期(3,12,16 分别表示上、下、短学期)',
    defaultText: '3',
    validator: validateTerm
  });

  function extractStartDate(scheduleInfo) {
    // 定义正则表达式，匹配括号内的日期范围
    const dateRangeRegex = /\((\d{4}-\d{2}-\d{2})至\d{4}-\d{2}-\d{2}\)/;
    const match = scheduleInfo.match(dateRangeRegex);
    if (match && match[1]) {
      console.log('开学时间：', match[1]);
      return match[1]; // 返回开学时间
    }
    return null; // 如果未匹配到，返回null
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
        await AIScheduleAlert('获取开学日期失败，请检查网络连接');
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