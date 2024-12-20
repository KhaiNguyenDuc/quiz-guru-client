export const HOST = 'api/v1'
export const ROOT = 'http://localhost:8072'
export const LOGOUT_REDIRECT_URL = "http://localhost:3000"
export const KEYCLOAK_URL = 'http://localhost:8080'
export const KEYCLOAK_REALM = 'Quizguru'
export const KEYCLOAK_CLIENT_ID = 'quizguru-frontend-ac'
export const GOOGLE_CLIENT_ID  = '990887837910-pml8dp7e0lhotrolcprggedblnfki2no.apps.googleusercontent.com'
export const TXT_TYPE = 'text/plain';
export const PDF_TYPE = 'application/pdf';
export const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const ALLOWED_TYPE = [
    TXT_TYPE,
    PDF_TYPE,
    DOCX_TYPE
  ];
export const NOT_FOUND_EMAIL = "Không tìm thấy email."
export const BASE_URL = ROOT + "/" + HOST
export const CUSTOMER_URL = BASE_URL + "/customers"
export const QUIZ_URL = BASE_URL + "/quizzes"
export const RECORD_URL = BASE_URL + "/records"
export const WORDSET_URL = BASE_URL + "/word-set"
export const LIBRARY_URL = BASE_URL + "/libraries"
export const WORD_URL = BASE_URL + "/words"
export const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en/"
export const MULTIPLE_CHOICE_QUESTION = "MULTIPLE_CHOICE_QUESTION"
export const SINGLE_CHOICE_QUESTION = "SINGLE_CHOICE_QUESTION"
export const PASSWORD_MISSMATCH_MSG = "Mật khẩu không khớp."
export const PASSWORD_INVALID_MSG = "Mật khẩu phải có ít nhất 7 ký tự."
export const EMPTY_PASSWORD_MSG = "Mật khẩu không thể trống."
export const EMPTY_TOKEN_MSG = "Mã xác thực không được trống."
export const EMPTY_EMAIL_MSG = "Email không thể trống."
export const EMPTY_NAME = "Chưa đặt tên"
export const EMPTY_FILE = "Vui lòng chọn file"
export const INVALID_LOGIN_MSG = "Tên đăng nhập hoặc mật khẩu không đúng."
export const TOKEN_INVALID = "Mã xác thực không đúng."
export const EXIST_EMAIL_USERNAME_MSG = "Tên đăng nhập hoặc email đã tồn tại."
export const BLANK_LOGIN_MSG = "Tên đăng nhập hoặc mật khẩu không được trống."
export const UNSUPPORT_MEDIA_TYPE_MSG = "Chỉ hỗ trợ file .txt, .pdf, .docx."
export const TRY_AGAIN_MSG = "Có lỗi xảy ra, có thể nội dung của không hợp lệ, vui lòng thử lại sau."
export const GENERATE_LENGTH_INVALID = "Nội dung không hợp lệ."
export const GENERATE_LENGTH_SHORT = "Nội dung không được để trống hoặc ít hơn 90 ký tự."
export const USERNAME_EXIST = "Tên đăng nhập đã tồn tại";
