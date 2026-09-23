"""Optional numerical checker. The Next.js app uses its own tested checker if this is not running."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Physics Tutor Checker")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class Measurement(BaseModel):
    value: float
    unit: str


class SolveRequest(BaseModel):
    formulaId: str
    known: dict[str, Measurement]
    find: str


def fail(message: str) -> dict:
    return {"status": "cannot_verify", "message": message, "steps": [], "assumptions": []}


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/verify")
def verify(body: SolveRequest) -> dict:
    if body.formulaId == "speed" and body.find == "v":
        distance = body.known.get("s")
        time = body.known.get("t")
        if not distance or not time or time.value == 0:
            return fail("I need distance and time.")
        if distance.unit == "m" and time.unit == "s":
            value = distance.value / time.value
            return {
                "status": "verified",
                "value": value,
                "unit": "m/s",
                "display": f"{value:g} m/s",
                "formulaId": "speed",
                "assumptions": [],
                "message": f"Checked by direct calculation: {value:g} m/s.",
                "steps": [{"text": f"v = {distance.value:g} / {time.value:g} = {value:g} m/s."}],
            }
    if body.formulaId == "newton-second" and body.find == "F":
        mass = body.known.get("m")
        acceleration = body.known.get("a")
        if mass and acceleration and mass.unit == "kg" and acceleration.unit == "m/s²":
            value = mass.value * acceleration.value
            return {
                "status": "verified",
                "value": value,
                "unit": "N",
                "display": f"{value:g} N",
                "formulaId": "newton-second",
                "assumptions": [],
                "message": f"Checked by direct calculation: {value:g} N.",
                "steps": [{"text": f"F = {mass.value:g} × {acceleration.value:g} = {value:g} N."}],
            }
    return fail("This Python checker only verifies a few formulas. The app will use its built-in checker instead.")
