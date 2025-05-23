# 小爱课程表解析

## 简介
本项目是一个依托小爱同学的课表功能，支持从教务系统获取课程信息并生成时间配置数据。

## 功能
1. **获取课程数据**：通过 `provider.js` 从教务系统接口获取课程信息。
2. **解析课程数据**：通过 `parser.js` 解析课程数据，生成结构化的课程信息。
3. **生成时间配置**：通过 `timer.js` 配置课程时间，生成总周数、每日课程节数等时间相关信息。

## 使用步骤
搭配官方使用教程: [https://open-schedule-prod.ai.xiaomi.com/docs/#/help/](https://open-schedule-prod.ai.xiaomi.com/docs/#/help/)
1. **安装依赖**：
    - 确保已安装 Node.js 环境。
    - 安装项目所需的依赖包。

2. **运行工具**：
    - 执行 `provider.js` 获取课程数据。
    - 使用 `parser.js` 解析课程数据。
    - 调用 `timer.js` 生成时间配置。

3. **查看结果**：
    - 运行后可在控制台查看生成的时间配置信息。

## 注意事项
- 确保网络连接正常，以便成功获取教务系统的课程数据。
- 输入学年和学期时，请按照提示输入正确的格式。
- 如果遇到问题，请检查控制台日志以获取详细错误信息。

## 文件说明
- `provider.js`：负责从教务系统获取课程数据。
- `parser.js`：解析课程数据并生成结构化信息。
- `timer.js`：根据解析后的数据生成时间配置。

## 更新日志
- (2025-04-09)
  - 添加了详细的错误信息提示。
  - 优化了课程数据的提取逻辑。
  - 修复了开学日期提取的正则表达式问题。

## 联系方式
如有任何问题，请提交 Issue。