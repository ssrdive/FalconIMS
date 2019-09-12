export const getDateTime = () => {
    const currentTime = new Date()
    const date = ("0" + currentTime.getDate()).slice(-2)
    const month = ("0" + (currentTime.getMonth() + 1)).slice(-2)
    const year = currentTime.getFullYear()

    const hour = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()

    const now_date = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds

    return now_date
}
