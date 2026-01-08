# backend/app/api/v1/descriptions/user_description.py

register_user_description = """建立新帳號，驗證 Email，並寄送驗證信。
密碼至少 8 個字元，需包含大小寫字母與數字。
"""

verify_email_description = """使用 token 驗證 Email，有效則啟用帳號。
"""

resend_verification_description = """提供 Email 可重新發送驗證郵件。
"""
