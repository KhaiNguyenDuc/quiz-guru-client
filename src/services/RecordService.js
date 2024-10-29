import { axiosPrivate } from "../api"
import { RECORD_URL } from "../utils/Constant"

class RecordService {
    createRecord(recordId,recordItems, quizId, time){
        return axiosPrivate.post(RECORD_URL, {
            recordId: recordId,
            quizId: quizId,
            recordItems: recordItems,
            timeLeft: time,
        })
            .then(response => response)
            .catch(error => error)
    }
}

export default new RecordService()