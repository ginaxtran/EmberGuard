from fastapi import FastAPI, Cookie
from fastapi.responses import RedirectResponse
import requests
import os
from dotenv import load_dotenv
from urllib.parse import urlencode
from models import User
from database import SessionLocal, Base, engine

load_dotenv()

app = FastAPI()

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL")


Base.metadata.create_all(bind=engine)


@app.get("/auth/google/login")
def google_login():
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    return RedirectResponse(url)


@app.get("/auth/google/callback")
def google_callback(code: str = None):
    if not code:
        return {"error": "Missing code parameter"}

    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        },
    )
    token_response.raise_for_status()
    token_json = token_response.json()
    access_token = token_json.get("access_token")

    userinfo_response = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    userinfo_response.raise_for_status()
    userinfo = userinfo_response.json()

    db = SessionLocal()
    user = db.query(User).filter(User.email == userinfo["email"]).first()
    if not user:
        user = User(
            email=userinfo["email"],
            name=userinfo.get("name"),
            picture=userinfo.get("picture")
        )
        db.add(user)
        db.commit()
    db.close()

    response = RedirectResponse(url=f"{FRONTEND_URL}/dashboard?page=map")
    response.set_cookie(key="user_email", value=userinfo["email"], httponly=True)
    return response


@app.get("/auth/user")
def get_logged_in_user(user_email: str = Cookie(None)):
    if not user_email:
        return {"logged_in": False}
    return {"logged_in": True, "email": user_email}
