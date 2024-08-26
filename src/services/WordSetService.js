import { axiosPrivate } from "../api";
import { LIBRARY_URL, WORDSET_URL } from "../utils/Constant";

class WordSetService {
    createWordSet(wordSet){
        return axiosPrivate.post(LIBRARY_URL + "/word-set", wordSet)
        .then(response => response?.data)
        .catch(error => error?.data)
    }

    updateWordSet(wordSet){
        return axiosPrivate.put(LIBRARY_URL + `/word-set?id=${wordSet?.id}`, {
            id: "",
            quizId: "",
            words: [],
            name: wordSet?.name
        })
        .then(response => response?.data)
        .catch(error => error?.data)
    }

    findWordsByWordSet(wordSetId, page){
        let URL = ""
        if(page !== undefined){
            URL = LIBRARY_URL + `/word-set?id=${wordSetId}&page=${page}&size=6`
        }else{
            URL = LIBRARY_URL + `/word-set?id=${wordSetId}&page=0&size=100`
        }
        return axiosPrivate.get(URL)
        .then(response => response?.data)
        .catch(error => error?.data)
    }

    deleteById(wordSetId){
        return axiosPrivate.delete(LIBRARY_URL + `/word-set?id=${wordSetId}`)
        .then(response => response?.data)
        .catch(error => error?.data)
    }
   
}
export default new WordSetService();