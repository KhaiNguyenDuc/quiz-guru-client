import { axiosPrivate } from "../api"
import { LIBRARY_URL, WORD_URL } from "../utils/Constant"

class WordService {
    getDefinition(words, wordSetId){
        return axiosPrivate.post(LIBRARY_URL + `/word/definition?id=${wordSetId}`, words)
            .then(response => response?.data?.data)
            .catch(error => error?.data)
    }

    updateDefinition(id, htmlContent){
        return axiosPrivate.put(LIBRARY_URL + `/word/definition?id=${id}`, {
            content: htmlContent
        })
            .then(response => response?.data?.data)
            .catch(error => error?.data)
    }
}

export default new WordService()