function scheduleHtmlParser(json_str) {
  const courseJson = JSON.parse(json_str)
  console.log(`scheduleHtmlParser: ${courseJson}`)
  let courseInfos = []

  for (let i = 0; i < courseJson.kbList.length; i++) {
    let course = courseJson.kbList[i];
    let weeks = course.zcd.substring(0, course.zcd.length - 1).split('-');
    console.log(course.zcd);
    console.log(weeks);
    let weekData = [];
    if (weeks.length === 2) {
      for (let j = parseInt(weeks[0]); j <= parseInt(weeks[1]); j++) {
        weekData.push(j);
      }
    }
    //jcs: "11-12"
    let sections = course.jcs.split('-');
    let sectionData = [];
    if (sections.length === 2) {
      for (let j = parseInt(sections[0]); j <= parseInt(sections[1]); j++) {
        sectionData.push(j);
      }
    }
    let courseEl = {
      name: `${course.kcmc}_${course.kcxz}`,
      teacher: course.xm,
      day: course.xqj,
      weeks: weekData,
      sections: sectionData,
      position: `${course.cdmc}_${course.xqmc}`
    }
    courseInfos.push(courseEl)
    console.log(courseEl)
  }
  return {
    courseInfos: courseInfos, something: `${courseJson.startDate}`,
  }
}
