from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict

from seed_data import DEFAULT_SETTINGS, DEFAULT_PROGRAMS, DEFAULT_TUTORS, DEFAULT_PACKAGES, DEFAULT_FAQS

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Sentra Cendekia API")
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def new_id():
    return str(uuid.uuid4())


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Belum login")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token tidak valid")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesi berakhir, silakan login kembali")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Pengguna tidak ditemukan")
    return user


admin_only = Depends(get_current_user)


# ---------- Models ----------
class Base(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    order: int = 0


class Program(Base):
    title: str
    level: str = ""
    description: str = ""
    subjects: List[str] = []
    icon: str = "book"


class Tutor(Base):
    name: str
    subject: str = ""
    education: str = ""
    photo: str = ""
    bio: str = ""


class Package(Base):
    name: str
    sessions: int = 2
    price: int = 0
    duration: str = "90 menit / sesi"
    description: str = ""
    features: List[str] = []
    popular: bool = False


class FAQ(Base):
    question: str
    answer: str = ""


class Point(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str = ""
    desc: str = ""


class Stat(BaseModel):
    model_config = ConfigDict(extra="ignore")
    value: str = ""
    label: str = ""


class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    brand_name: str = "Sentra Cendekia"
    tagline: str = ""
    logo_url: str = ""
    hero_badge: str = ""
    hero_title: str = ""
    hero_subtitle: str = ""
    hero_image: str = ""
    hero_cta: str = "Daftar Sekarang"
    marquee_text: str = ""
    about_eyebrow: str = "Tentang Kami"
    about_title: str = ""
    about_description: str = ""
    about_image: str = ""
    about_points: List[Point] = []
    stats: List[Stat] = []
    whatsapp: str = ""
    whatsapp_message: str = ""
    email: str = ""
    address: str = ""
    instagram: str = ""
    footer_text: str = ""


class RegistrationCreate(BaseModel):
    name: str = Field(min_length=2)
    phone: str = Field(min_length=6)
    level: str = ""
    program: str = ""
    package: str = ""
    message: str = ""


class Registration(RegistrationCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    status: str = "baru"
    created_at: str = Field(default_factory=now_iso)


class StatusUpdate(BaseModel):
    status: str


class LoginInput(BaseModel):
    email: str
    password: str


# ---------- Auth routes ----------
@api_router.post("/auth/login")
async def login(payload: LoginInput, request: Request, response: Response):
    email = payload.email.strip().lower()
    identifier = f"{request.client.host if request.client else 'x'}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = datetime.fromisoformat(attempt["locked_until"])
        if datetime.now(timezone.utc) < locked_until:
            raise HTTPException(status_code=429, detail="Terlalu banyak percobaan. Coba lagi dalam 15 menit.")
        await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1},
             "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
            upsert=True)
        raise HTTPException(status_code=401, detail="Email atau password salah")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], user["email"])
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none",
                        max_age=43200, path="/")
    return {"user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"),
                     "role": user.get("role", "admin")}, "access_token": token}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- Generic CRUD ----------
def register_crud(path: str, model):
    coll = db[path]

    @api_router.get(f"/{path}", response_model=List[model], name=f"list_{path}")
    async def list_items():
        return await coll.find({}, {"_id": 0}).sort("order", 1).to_list(500)

    @api_router.post(f"/{path}", response_model=model, dependencies=[admin_only], name=f"create_{path}")
    async def create_item(payload: model):
        await coll.insert_one(payload.model_dump())
        return payload

    @api_router.put(f"/{path}/{{item_id}}", response_model=model, dependencies=[admin_only], name=f"update_{path}")
    async def update_item(item_id: str, payload: model):
        data = payload.model_dump()
        data["id"] = item_id
        res = await coll.update_one({"id": item_id}, {"$set": data})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return data

    @api_router.delete(f"/{path}/{{item_id}}", dependencies=[admin_only], name=f"delete_{path}")
    async def delete_item(item_id: str):
        res = await coll.delete_one({"id": item_id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return {"ok": True}


register_crud("programs", Program)
register_crud("tutors", Tutor)
register_crud("packages", Package)
register_crud("faqs", FAQ)


# ---------- Settings ----------
async def load_settings() -> dict:
    doc = await db.settings.find_one({"key": "site"}, {"_id": 0, "key": 0})
    return Settings(**(doc or DEFAULT_SETTINGS)).model_dump()


@api_router.get("/settings", response_model=Settings)
async def get_settings():
    return await load_settings()


@api_router.put("/settings", response_model=Settings, dependencies=[admin_only])
async def update_settings(payload: Settings):
    data = payload.model_dump()
    await db.settings.update_one({"key": "site"}, {"$set": {**data, "key": "site"}}, upsert=True)
    return data


@api_router.get("/content")
async def get_content():
    return {
        "settings": await load_settings(),
        "programs": await db.programs.find({}, {"_id": 0}).sort("order", 1).to_list(200),
        "tutors": await db.tutors.find({}, {"_id": 0}).sort("order", 1).to_list(200),
        "packages": await db.packages.find({}, {"_id": 0}).sort("order", 1).to_list(200),
        "faqs": await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(200),
    }


# ---------- Registrations ----------
@api_router.post("/registrations", response_model=Registration)
async def create_registration(payload: RegistrationCreate):
    reg = Registration(**payload.model_dump())
    await db.registrations.insert_one(reg.model_dump())
    return reg


@api_router.get("/registrations", response_model=List[Registration], dependencies=[admin_only])
async def list_registrations():
    return await db.registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api_router.patch("/registrations/{reg_id}", dependencies=[admin_only])
async def update_registration(reg_id: str, payload: StatusUpdate):
    res = await db.registrations.update_one({"id": reg_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"ok": True}


@api_router.delete("/registrations/{reg_id}", dependencies=[admin_only])
async def delete_registration(reg_id: str):
    await db.registrations.delete_one({"id": reg_id})
    return {"ok": True}


@api_router.get("/admin/summary", dependencies=[admin_only])
async def admin_summary():
    counts = {name: await db[name].count_documents({}) for name in
              ["programs", "tutors", "packages", "faqs", "registrations"]}
    counts["registrations_baru"] = await db.registrations.count_documents({"status": "baru"})
    latest = await db.registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    return {"counts": counts, "latest_registrations": latest}


@api_router.get("/")
async def root():
    return {"message": "Sentra Cendekia API"}


# ---------- Startup seeding ----------
@app.on_event("startup")
async def seed():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    for name in ["programs", "tutors", "packages", "faqs", "registrations"]:
        await db[name].create_index("id", unique=True)

    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"id": new_id(), "email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": "Admin Sentra", "role": "admin", "created_at": now_iso()})
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    if await db.settings.count_documents({"key": "site"}) == 0:
        await db.settings.insert_one({**DEFAULT_SETTINGS, "key": "site"})
    for name, model, defaults in [("programs", Program, DEFAULT_PROGRAMS), ("tutors", Tutor, DEFAULT_TUTORS),
                                  ("packages", Package, DEFAULT_PACKAGES), ("faqs", FAQ, DEFAULT_FAQS)]:
        if await db[name].count_documents({}) == 0:
            await db[name].insert_many([model(**d, order=i).model_dump() for i, d in enumerate(defaults)])
    logger.info("Seeding complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
