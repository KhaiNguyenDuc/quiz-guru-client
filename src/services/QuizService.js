
import { axiosPrivate } from "../api/index.js"
import { QUIZ_URL } from "../utils/Constant.js";


class QuizService {


  generateQuizByText(textbase) {
    return axiosPrivate
      .post(QUIZ_URL + "/text", textbase)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  generateQuizByTxt(filebase, file) {
    return axiosPrivate
      .post(QUIZ_URL + "/txt", 
      {
        ...filebase,
        file: file
      },   
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  generateQuizByPdf(filebase, file) {
    return axiosPrivate
      .post(QUIZ_URL + "/pdf", 
      {
        ...filebase,
        file: file
      },   
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  generateQuizByDoc(filebase, file) {
    return axiosPrivate
      .post(QUIZ_URL + "/doc", 
      {
        ...filebase,
        file: file
      },   
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  deleteQuizById(quizId){
    return axiosPrivate
      .delete(QUIZ_URL + `?id=${quizId}`)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }


  generateQuizByVocabulary(vocabularyBase) {
    return axiosPrivate
      .post(QUIZ_URL + "/vocabulary/list", vocabularyBase)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  generateQuizByTextToVocab(textToVocabBase){
    return axiosPrivate
      .post(QUIZ_URL + "/vocabulary/text", textToVocabBase)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  generateQuizVocabByTxt(fileVocabBase, file) {
    return axiosPrivate
      .post(QUIZ_URL + "/vocabulary/txt", 
      {
        ...fileVocabBase,
        file: file
      },   
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  generateQuizVocabByPdf(fileVocabBase, file) {
    return axiosPrivate
      .post(QUIZ_URL + "/vocabulary/pdf", 
      {
        ...fileVocabBase,
        file: file
      },   
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  generateQuizVocabByDoc(fileVocabBase, file) {
    return axiosPrivate
      .post(QUIZ_URL + "/vocabulary/doc", 
      {
        ...fileVocabBase,
        file: file
      },   
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  
  findQuizInfoById(quizId){
    return axiosPrivate
    .get(QUIZ_URL + `?id=${quizId}`)
    .then((response) => response?.data?.data)
    .catch((error) => error?.response);
  }


}

export default new QuizService();
