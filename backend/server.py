from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import ipaddress
import logging
import uuid
import httpx
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import Dict
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Open House")
SUBMISSION_NOTIFY_EMAIL = os.environ.get("SUBMISSION_NOTIFY_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as client_http:
        resp = await client_http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def img(pid, w=1200):
    return f"https://images.unsplash.com/photo-{pid}?q=80&w={w}&auto=format&fit=crop"


SHOWS = [
    {
        "slug": "slow-mornings",
        "title": "Slow Mornings",
        "host": "Mara Solace",
        "category": "Music",
        "genre": "Ambient / Downtempo",
        "airtime": "Mon · Wed · Fri — 08:00",
        "image": img("1508700115892-45ecd05ae2ad"),
        "featured": True,
        "excerpt": "An unhurried start to the day — ambient, downtempo and soft-focus selections.",
        "description": [
            "Slow Mornings is the sound of the city waking up gently. Mara Solace opens the studio blinds three mornings a week and plays two hours of ambient, downtempo and quietly hopeful music — no shouting, no adverts, just space to think.",
            "Expect long blends, field recordings, the occasional voicemail from a listener, and a poem at half past. It's radio for people who like their mornings slow and their coffee warm.",
        ],
    },
    {
        "slug": "basement-frequencies",
        "title": "Basement Frequencies",
        "host": "Jay Okafor",
        "category": "Music",
        "genre": "Club / Electronic",
        "airtime": "Fri — 22:00",
        "image": img("1518609878373-06d740f60d8b"),
        "featured": True,
        "excerpt": "Late-night club music, live mixes and guests from the underground.",
        "description": [
            "Every Friday night, Jay Okafor takes the station downstairs. Basement Frequencies is two hours of club music — garage, house, breaks and whatever is rattling the city's small rooms that week.",
            "Guests are young DJs and producers, often playing their first-ever radio set. The last half hour is always lights-down: one continuous mix, no talking.",
        ],
    },
    {
        "slug": "new-soil",
        "title": "New Soil",
        "host": "June Park",
        "category": "Music",
        "genre": "Jazz / Soul / New Sounds",
        "airtime": "Tue — 19:00",
        "image": img("1603048588665-791ca8aea617"),
        "featured": True,
        "excerpt": "Jazz, soul and the new things growing out of both, with June Park.",
        "description": [
            "New Soil is a weekly dig through jazz, soul and everything new sprouting between them. June Park brings records, stories and the occasional musician into the studio for a session.",
            "It's a show about roots and new growth — old 45s next to demos sent in last week, treated with the same care.",
        ],
    },
    {
        "slug": "the-listening-room",
        "title": "The Listening Room",
        "host": "Sam Whitaker",
        "category": "Talk",
        "genre": "Conversation / Interviews",
        "airtime": "Thu — 18:00",
        "image": img("1478737270239-2f02b77fc618"),
        "featured": True,
        "excerpt": "Long, warm conversations with the people making things around us.",
        "description": [
            "The Listening Room is our weekly conversation. Sam Whitaker sits down with artists, organisers, filmmakers, cooks, designers — anyone building something interesting nearby — and talks about how they actually do it.",
            "No PR questions, no rush. Just an hour of honest conversation about work, doubt, process and the city we share.",
        ],
    },
    {
        "slug": "static-bloom",
        "title": "Static Bloom",
        "host": "Rio Tanaka",
        "category": "Music",
        "genre": "Leftfield Pop / DIY",
        "airtime": "Sat — 12:00",
        "image": img("1505740420928-5e560c06d30e"),
        "featured": False,
        "excerpt": "Bedroom pop, DIY tapes and beautiful mistakes, every Saturday.",
        "description": [
            "Static Bloom celebrates music made at kitchen tables and in spare bedrooms. Rio Tanaka plays leftfield pop, cassette-label finds and demos that arrived with handwritten notes.",
            "If you've made something and you're not sure it's finished, this is the show that will play it anyway.",
        ],
    },
    {
        "slug": "open-decks",
        "title": "Open Decks",
        "host": "You + Guests",
        "category": "Guest Mix",
        "genre": "Community / Open Format",
        "airtime": "Sun — 16:00",
        "image": img("1571330735066-03aaa9429d89"),
        "featured": False,
        "excerpt": "The studio door is open — community selectors take over every Sunday.",
        "description": [
            "Open Decks is exactly what it sounds like. Every Sunday afternoon we hand the studio to the community — first-timers, collectors, selectors, anyone with an hour of music they love.",
            "No experience needed. Bring records, a USB, or just a list. We'll help with the rest.",
        ],
    },
    {
        "slug": "night-service",
        "title": "Night Service",
        "host": "Ada Lim",
        "category": "Music",
        "genre": "Late Night / Ambient",
        "airtime": "Daily — 00:00",
        "image": img("1573154622954-b5fae2c1eed8"),
        "featured": False,
        "excerpt": "Overnight radio for the awake — ambient, spoken word and static.",
        "description": [
            "Night Service keeps the transmitter warm between midnight and morning. Ada Lim curates hours of ambient music, short-wave recordings and quiet spoken word.",
            "It's for night workers, new parents, insomniacs and anyone else keeping strange hours.",
        ],
    },
]

PROJECTS = [
    {
        "slug": "second-light",
        "title": "Second Light",
        "category": "Photography",
        "contributor": "Nina Osei",
        "featured": True,
        "image": img("1542038784456-1ea8e935640e"),
        "images": [img("1542038784456-1ea8e935640e", 1600), img("1461784121038-f088ca1e7714", 1600)],
        "excerpt": "A zine of quiet mornings shot across the city's east side.",
        "description": [
            "Second Light is a 40-page photo zine by Nina Osei — three months of early walks through the east side, shot on film, printed in a run of one hundred.",
            "The photos are of ordinary things at unordinary hours: bakers opening shutters, buses still empty, the river before anyone is looking at it.",
        ],
        "link": "",
    },
    {
        "slug": "rooms-we-grew-up-in",
        "title": "Rooms We Grew Up In",
        "category": "Film",
        "contributor": "Dario Mensah",
        "featured": True,
        "image": img("1485846234645-a62644f84728"),
        "images": [img("1485846234645-a62644f84728", 1600), img("1499364615650-ec38552f4f34", 1600)],
        "excerpt": "A twelve-minute short on memory, hallways and home.",
        "description": [
            "Rooms We Grew Up In is a short film by Dario Mensah, made with friends over one winter. It follows three people revisiting the houses they were raised in — some still standing, some not.",
            "It premiered at a community screening in the Open House studio, with a live score from the New Soil band.",
        ],
        "link": "",
    },
    {
        "slug": "mud-season",
        "title": "Mud Season",
        "category": "Music",
        "contributor": "June Park",
        "featured": True,
        "image": img("1508700115892-45ecd05ae2ad"),
        "images": [img("1508700115892-45ecd05ae2ad", 1600), img("1520523839897-bd0b52f945a0", 1600)],
        "excerpt": "A five-track EP recorded in a basement over one winter.",
        "description": [
            "Mud Season is the first EP from the New Soil house band — five tracks of loose, warm jazz recorded live in a borrowed basement between January and March.",
            "It was mixed on air, in public, over three episodes of New Soil. The tape hiss stayed in.",
        ],
        "link": "",
    },
    {
        "slug": "common-table",
        "title": "Common Table",
        "category": "Events",
        "contributor": "Open House Community",
        "featured": False,
        "image": img("1495474472287-4d71bcdd2085"),
        "images": [img("1495474472287-4d71bcdd2085", 1600), img("1529156069898-49953e39b3ac", 1600)],
        "excerpt": "A monthly dinner and listening session. Bring a record, stay for dessert.",
        "description": [
            "Common Table is our monthly dinner. Twenty seats, one long table, a shared meal cooked by a different neighbour each month — and afterwards, a listening session where everyone plays one song that matters to them.",
            "It's free, it's always full, and the waiting list is really just an invitation to help cook.",
        ],
        "link": "",
    },
    {
        "slug": "soft-machines",
        "title": "Soft Machines",
        "category": "Fashion",
        "contributor": "Lena Vogt",
        "featured": False,
        "image": img("1445205170230-053b83016050"),
        "images": [img("1445205170230-053b83016050", 1600), img("1524504388940-b1c1722653e1", 1600)],
        "excerpt": "A capsule of reworked workwear, sewn in small batches.",
        "description": [
            "Soft Machines is a small clothing project by Lena Vogt — workwear rescued from markets and deadstock, taken apart and sewn back together into one-of-one pieces.",
            "Every piece is photographed on friends of the station rather than models, and the pattern notes are published free for anyone who wants to try.",
        ],
        "link": "",
    },
    {
        "slug": "gallery-of-small-hours",
        "title": "Gallery of Small Hours",
        "category": "Art",
        "contributor": "Tomás Reyes",
        "featured": True,
        "image": img("1606819717115-9159c900370b"),
        "images": [img("1606819717115-9159c900370b", 1600), img("1533174072545-7a4b6ad7a6c3", 1600)],
        "excerpt": "Twenty-one paintings of the city between 2 and 5am.",
        "description": [
            "Gallery of Small Hours is a series of twenty-one small paintings by Tomás Reyes, all made from sketches drawn on night buses and in 24-hour cafés.",
            "The series hung in the Open House studio for a month, and each painting was paired with a listener's voicemail about what they do when they can't sleep.",
        ],
        "link": "",
    },
    {
        "slug": "block-party-radio",
        "title": "Block Party Radio",
        "category": "Events",
        "contributor": "Basement Frequencies Crew",
        "featured": False,
        "image": img("1517457373958-b7bdd4587205"),
        "images": [img("1517457373958-b7bdd4587205", 1600), img("1514525253161-7a46d19cd819", 1600)],
        "excerpt": "Taking the station to the street — one block, one day, everyone invited.",
        "description": [
            "Block Party Radio is what happens when the station leaves the building. Once a summer, the Basement Frequencies crew wheels a rig onto a different street and broadcasts from the pavement all day.",
            "Neighbours bring chairs, kids take over the mic between sets, and the whole thing is archived as a time capsule of the block.",
        ],
        "link": "",
    },
]

SCHEDULE = [
    {"day": "Monday", "time": "08:00", "title": "Slow Mornings", "host": "Mara Solace", "slug": "slow-mornings"},
    {"day": "Monday", "time": "20:00", "title": "New Soil (Replay)", "host": "June Park", "slug": "new-soil"},
    {"day": "Tuesday", "time": "19:00", "title": "New Soil", "host": "June Park", "slug": "new-soil"},
    {"day": "Wednesday", "time": "08:00", "title": "Slow Mornings", "host": "Mara Solace", "slug": "slow-mornings"},
    {"day": "Thursday", "time": "18:00", "title": "The Listening Room", "host": "Sam Whitaker", "slug": "the-listening-room"},
    {"day": "Friday", "time": "08:00", "title": "Slow Mornings", "host": "Mara Solace", "slug": "slow-mornings"},
    {"day": "Friday", "time": "22:00", "title": "Basement Frequencies", "host": "Jay Okafor", "slug": "basement-frequencies"},
    {"day": "Saturday", "time": "12:00", "title": "Static Bloom", "host": "Rio Tanaka", "slug": "static-bloom"},
    {"day": "Sunday", "time": "16:00", "title": "Open Decks", "host": "You + Guests", "slug": "open-decks"},
]

LIVE = {
    "on_air": True,
    "title": "Basement Frequencies",
    "host": "Jay Okafor",
    "description": "Live from the studio — club music, guest mixes and the occasional surprise. Keeping it warm until close.",
    "image": img("1518609878373-06d740f60d8b"),
    "slug": "basement-frequencies",
}

RESIDENTS = [
    {"name": "Mara Solace", "role": "Slow Mornings", "image": img("1524504388940-b1c1722653e1", 600)},
    {"name": "Jay Okafor", "role": "Basement Frequencies", "image": img("1500648767791-00dcc994a43e", 600)},
    {"name": "June Park", "role": "New Soil", "image": img("1534528741775-53994a69daeb", 600)},
    {"name": "Sam Whitaker", "role": "The Listening Room", "image": img("1506794778202-cad84cf45f1d", 600)},
    {"name": "Rio Tanaka", "role": "Static Bloom", "image": img("1507003211169-0a1dd7228f2d", 600)},
    {"name": "Ada Lim", "role": "Night Service", "image": img("1531123897727-8f129e1688ce", 600)},
]


@app.on_event("startup")
async def seed_data():
    if await db.shows.count_documents({}) == 0:
        await db.shows.insert_many(SHOWS)
    if await db.projects.count_documents({}) == 0:
        await db.projects.insert_many(PROJECTS)
    if await db.schedule.count_documents({}) == 0:
        await db.schedule.insert_many(SCHEDULE)
    if await db.residents.count_documents({}) == 0:
        await db.residents.insert_many(RESIDENTS)


@api_router.get("/")
async def root():
    return {"message": "Open House API"}


@api_router.get("/live")
async def get_live():
    return LIVE


@api_router.get("/schedule")
async def get_schedule():
    return await db.schedule.find({}, {"_id": 0}).to_list(100)


@api_router.get("/shows")
async def get_shows(category: str | None = None):
    query = {"category": category} if category else {}
    return await db.shows.find(query, {"_id": 0}).to_list(100)


@api_router.get("/shows/{slug}")
async def get_show(slug: str):
    show = await db.shows.find_one({"slug": slug}, {"_id": 0})
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show


@api_router.get("/projects")
async def get_projects(category: str | None = None):
    query = {"category": category} if category else {}
    return await db.projects.find(query, {"_id": 0}).to_list(100)


@api_router.get("/projects/{slug}")
async def get_project(slug: str):
    project = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@api_router.get("/residents")
async def get_residents():
    return await db.residents.find({}, {"_id": 0}).to_list(100)


class SubmissionIn(BaseModel):
    kind: str
    name: str
    email: EmailStr
    fields: Dict[str, str] = {}


@api_router.post("/submissions")
async def create_submission(sub: SubmissionIn):
    if sub.kind not in ("show", "project"):
        raise HTTPException(status_code=400, detail="kind must be 'show' or 'project'")
    doc = {
        "id": str(uuid.uuid4()),
        "kind": sub.kind,
        "name": sub.name,
        "email": sub.email,
        "fields": {k: v for k, v in sub.fields.items()},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.submissions.insert_one(doc)

    email_sent = False
    if SUBMISSION_NOTIFY_EMAIL and EMAIL_KEY:
        kind_label = "show pitch" if sub.kind == "show" else "project submission"
        rows = "".join(
            f'<tr><td style="padding:6px 12px;color:#6B6A66;font-size:12px;letter-spacing:1px;text-transform:uppercase;vertical-align:top">{escape(str(k))}</td>'
            f'<td style="padding:6px 12px;color:#1C1C1A">{escape(str(v))}</td></tr>'
            for k, v in {"Name": sub.name, "Email": sub.email, **sub.fields}.items()
        )
        html = (
            '<table role="presentation" width="100%"><tr><td style="padding:24px;font-family:Arial,sans-serif">'
            f'<p style="color:#1C1C1A">A new {escape(kind_label)} came in through the Open House website.</p>'
            f'<table role="presentation" style="border-collapse:collapse">{rows}</table>'
            f'<p style="font-size:12px;color:#888">Sent by {escape(EMAIL_FROM_NAME)}.</p>'
            '</td></tr></table>'
        )
        try:
            await send_email(
                to=SUBMISSION_NOTIFY_EMAIL,
                subject=f"Open House — new {kind_label} from {sub.name}",
                html=html,
            )
            email_sent = True
        except Exception as e:
            logger.error(f"Submission email failed: {e}")

    return {"status": "ok", "id": doc["id"], "email_sent": email_sent}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
