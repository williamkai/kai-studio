import resend
from app.core.config import settings

# 設定 Resend API Key
resend.api_key = settings.RESEND_API_KEY

async def send_verification_email(email: str, token: str):
    """
    發送註冊驗證信
    """
    verify_link = f"{settings.FRONTEND_URL}/verify?token={token}"
    
    params: resend.Emails.SendParams = {
        "from": settings.EMAIL_FROM,
        "to": [email],  # 確保為 list
        "subject": "🔑 完成您的註冊 - Kai Studio",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h1 style="color: #333;">歡迎加入 Kai Studio！</h1>
                <p>請點擊下方按鈕驗證您的帳號：</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verify_link}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        驗證我的帳號
                    </a>
                </div>
                <p style="color: #666; font-size: 0.9em;">如果您沒有註冊此帳號，請忽略此郵件。</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 0.8em;">系統自動發送，請勿回覆。</p>
            </div>
        """,
    }

    try:
        return resend.Emails.send(params)
    except Exception as e:
        print(f"Resend 發送郵件失敗: {e}")
        return None
