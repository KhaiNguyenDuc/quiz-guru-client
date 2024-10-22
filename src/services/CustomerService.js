import { axiosPrivate } from "../api";
import { AUTH_URL, LIBRARY_URL, QUIZ_URL, RECORD_URL, CUSTOMER_URL } from "../utils/Constant";

class CustomerService {
  getCurrentUser() {
    return axiosPrivate
      .get(CUSTOMER_URL + "/profile/current")
      .then((response) => response?.data?.data)
      .catch((error) => error?.data);
  }

  getCurrentUserWordSets(page, size) {
    let URL = "";
    if (size !== undefined && page !== undefined) {
      URL = LIBRARY_URL + `/word-set/current?page=${page}&size=${size}`;
    } else {
      URL = LIBRARY_URL + `/word-set/current?page=0&size=10`;
    }
    return axiosPrivate
      .get(URL)
      .then((response) => response?.data)
      .catch((error) => error?.data);
  }

  getCurrentUserQuiz(page) {
    return axiosPrivate
      .get(QUIZ_URL + `/users/current?page=${page}&&size=4`)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }

  getCurrentUserQuizById(id) {
    return axiosPrivate
      .get(QUIZ_URL + `/detail?id=${id}`)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  getCurrentUserRecordById(id) {
    return axiosPrivate
      .get(RECORD_URL + `?id=${id}`)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  getCurrentUserRecords(page) {
    return axiosPrivate
      .get(RECORD_URL + `/users/current?page=${page}&&size=5`)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }

  updateProfile(userProfile) {
    return axiosPrivate
      .put(CUSTOMER_URL + `/current/update`, userProfile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }
}
export default new CustomerService();
