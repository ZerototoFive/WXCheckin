import axios from 'axios'
import dayjs from 'dayjs';
import qs from 'qs';

const SendKey = 'SCT148970TyzpzKKd24RNo7y5OEv3oj0Th'
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySW5mbyI6IntcInBlcm1pc3Npb25cIjpbXCJzdHVkZW50XCJdLFwic3lzVXNlclwiOntcImNvbGxlZ2VcIjpcIjNcIixcImNvbGxlZ2VPcmdJZFwiOlwiYzYyYWY5YWM4YzA1NGI0Mzg4ZTY3MjhmODQ3NjkwODNcIixcImNyZWF0ZVRpbWVcIjoxNjQxODg5MDc2MDAwLFwiY3JlYXRvclwiOlwiNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2XCIsXCJlbmNvZGVVc2VyTmFtZVwiOlwiZGE1ZTM0MjdiNzM4MDc4YjZiYTBlZWVjMDYxNjA3NWVcIixcImdyYWRlT3JnSWRcIjpcIjJmNzQ3OGVkMWEwMDRkMzBiYTJlN2M2NzA2N2ZhNjg0XCIsXCJpZFwiOlwiMWM1ODVkNTM5NjI1NDA3MGI2MzQ3ODZmNjA3MjRlZWFcIixcImlzTWFpblwiOlwiMVwiLFwibWFqb3JPcmdJZFwiOlwiNjJmOThmMmE3ZjliNDQ1NDgxYjI1YjE3NDdkY2JlY2VcIixcIm5hbWVcIjpcIuWQtOadqOWGsFwiLFwicGFzc3dvcmRcIjpcIjg2NjQxZDJkNWE0YWI5YmU5OWM2Y2M4YTQyN2I0ZGM2XCIsXCJwb3NpdGlvblwiOlwiM1wiLFwicmVtb3ZlVGFnXCI6XCIwXCIsXCJ1cGRhdGVUaW1lXCI6MTY0Njg3NDYwMzAwMCxcInVwZGF0ZXJcIjpcIjhmM2RlZWE0ODNmOTQxNzY5MjVhODA4NDg4ZWUzOThjXCIsXCJ1c2VyTmFtZVwiOlwiMjAxODAxMTQ3MFwiLFwidXNlclVuaXF1ZVwiOlwiZGE1ZTM0MjdiNzM4MDc4YjZiYTBlZWVjMDYxNjA3NWVcIixcInZhbGlkU3RhdGVcIjpcIjFcIn0sXCJ1c2VySWRcIjpcIjFjNTg1ZDUzOTYyNTQwNzBiNjM0Nzg2ZjYwNzI0ZWVhXCJ9IiwiaXNzIjoiYXV0aDAiLCJleHAiOjE2NTM3MjQzNDQsImlhdCI6MTY1MzExOTU0NH0.1WFM4HQRddr26-S8-kg4b0zTkV-xoShCzvTeKIVV-Ec'

async function app() {
    const list = await findTempList()
    const {id:taskId,templateId:templateId} = list[0]
    const formList = await findFormList(taskId)
    const {id:detailsId} = formList[0]
    const res = await submitForm(taskId,templateId,detailsId)

    const {code,msg:message} = res
    const title = '日报自动签到'
    const msg = `执行成功!message:${code}${message}`
    const msgUrl = encodeURI(`https://sctapi.ftqq.com/${SendKey}.send?title=${title}&desp=${msg}`)
    axios.post(msgUrl)
    console.log(msg);
}

/**
 * find temp list
 * @returns 
 */
async function findTempList() {
    const url = 'https://xgpt.wxc.edu.cn/work/asd/epidemicDailyTask/findVoPageByToken.do'
    const parmas = {
        pageNum: 1,
        pageSize: 999
    }
    const { data: { data: list } } = await axios({
        url,
        method: "POST",
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            token
        },
        data: qs.stringify(parmas)
    })
    return list
}

/**
 * find 表单列表
 * @param {*} taskId 
 */
async function findFormList(taskId) {
    const url = `https://xgpt.wxc.edu.cn/work/asd/epidemicDailyTaskDetails/findVoPageAndSubmitStatus.do?taskId=${taskId}`
    const parmas = {
        pageNum: 1,
        pageSize: 20
    }
    const { data: { data: list } } = await axios({
        url,
        method: "POST",
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            token
        },
        data: qs.stringify(parmas)
    })
    return list;
}

async function submitForm(taskId,templateId,detailsId) {
    const url = 'https://xgpt.wxc.edu.cn/work/asd/templateSubmit/saveOrUpdate.do'
    const province = '江苏省'
    const city = '南京市'
    const district = '建邺区'
    const lat = 32.0583
    const lng = 118.7964
    const adCode = 320102
    const address = `${province}${city}${district}友谊路清荷南园二栋`
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log(time);
    const answer = [{ "questionSort": 0, "answer": "否" }, { "questionSort": 1, "answer": [{ "checked": true, "title": "绿色", "content": "" }, { "checked": false, "title": "红色", "content": "" }, { "checked": false, "title": "黄色", "content": "" }, { "checked": false, "title": "有星标", "content": "" }, { "checked": true, "title": "无星标", "content": "" }] }, { "questionSort": 2, "answer": "36" }, { "questionSort": 3, "answer": "否" }, { "questionSort": 4, "answer": "是" }, { "questionSort": 5, "answer": time }, { "questionSort": 6, "answer": "否" }, { "questionSort": 7, "answer": address }, { "questionSort": 8, "answer": "" }]
    const params = {
        0: '否',
        2: '36',
        3: '否',
        4: '是',
        5: time,
        6: '否',
        mx1: '无星标',
        other3: '',
        file: '',
        province,
        city,
        district,
        lat,
        lng,
        adCode,
        address,
        objectId8: '',
        id:"", taskId, templateId, detailsId,
        isSave: 1,
        answer: JSON.stringify(answer)
    }
    const {data} = await axios({
        url,
        method: "POST",
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            token
        },
        data: qs.stringify(params)
    })
    return data
}
app()