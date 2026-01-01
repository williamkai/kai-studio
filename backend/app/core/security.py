import bcrypt

def get_password_hash(password: str) -> str:
    """
    將明文密碼轉成加密亂碼
    """
    # 1. 轉換數據類型：bcrypt 只收 bytes (位元組)，不收 string
    # 因為加密是在二進制層面運作的
    pwd_bytes = password.encode('utf-8')

    # 2. 產生鹽 (Salt)：bcrypt 會自動產生一個隨機鹽並進行雜湊
    # gensalt() 預設的 rounds 是 12，這就是剛才提到的算力消耗
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(pwd_bytes, salt)

    # 3. 轉回字串：為了存進資料庫的 String 欄位，我們要 decode 回 utf-8
    return hashed_password_bytes.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    驗證用戶輸入的密碼，是否跟資料庫存的那串亂碼匹配
    """
    # 轉換為 bytes 才能進行比對
    user_input_bytes = plain_password.encode('utf-8')
    db_hash_bytes = hashed_password.encode('utf-8')

    # checkpw 會自動從 db_hash_bytes 中提取當初的「鹽」，並重新計算比對
    return bcrypt.checkpw(user_input_bytes, db_hash_bytes)