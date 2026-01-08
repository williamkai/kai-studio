# backend/app/api/v1/examples/user_examples.py

register_user_example = {
    "email": "user@example.com",
    "password": "Password123"
}

verify_email_example = {"message": "VERIFICATION_SUCCESS"}

resend_verification_example = {"message": "VERIFICATION_EMAIL_SENT_IF_APPLICABLE"}

error_email_exists_example = {"detail": "EMAIL_ALREADY_EXISTS"}
error_rate_limit_example = {"detail": "Rate limit exceeded"}
error_invalid_token_example = {"detail": "INVALID_OR_EXPIRED_TOKEN"}

user_permission_out_example = {
    "is_superuser": False,
    "can_post_note": True,
    "can_use_fitness": True
}

user_out_example = {
    "id": 1,
    "email": "user@example.com",
    "is_active": False,
    "permissions": user_permission_out_example
}
