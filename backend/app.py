# app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import SessionLocal, engine
from models import Base, Profile
from sqlalchemy import select, text

# create tables if not present (safe)
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app)  # in prod restrict origins

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status":"ok"}), 200

@app.route("/profiles", methods=["POST"])
def create_profile():
    data = request.get_json() or {}
    if not data.get("name") or not data.get("email"):
        return jsonify({"error":"name and email required"}), 400
    sess = SessionLocal()
    try:
        profile = Profile(
            name=data.get("name"),
            email=data.get("email"),
            headline=data.get("headline"),
            education=data.get("education"),
            skills=data.get("skills") or [],
            projects=data.get("projects") or [],
            links=data.get("links"),
            bio=data.get("bio")
        )
        sess.add(profile)
        sess.commit()
        sess.refresh(profile)
        return jsonify({"id": str(profile.id)}), 201
    except Exception as e:
        sess.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        sess.close()

@app.route("/profiles/<uuid:profile_id>", methods=["GET"])
def get_profile(profile_id):
    sess = SessionLocal()
    try:
        stmt = select(Profile).where(Profile.id == profile_id)
        p = sess.execute(stmt).scalar_one_or_none()
        if not p:
            return jsonify({"error":"not found"}), 404
        return jsonify({
            "id": str(p.id),
            "name": p.name,
            "email": p.email,
            "headline": p.headline,
            "education": p.education,
            "skills": p.skills,
            "projects": p.projects,
            "links": p.links,
            "bio": p.bio,
            "created_at": p.created_at.isoformat() if p.created_at else None
        })
    finally:
        sess.close()

@app.route("/profiles/<uuid:profile_id>", methods=["PATCH", "PUT"])
def update_profile(profile_id):
    data = request.get_json() or {}
    sess = SessionLocal()
    try:
        stmt = select(Profile).where(Profile.id == profile_id)
        p = sess.execute(stmt).scalar_one_or_none()
        if not p:
            return jsonify({"error":"not found"}), 404
        for key in ("name","email","headline","education","skills","projects","links","bio"):
            if key in data:
                setattr(p, key, data[key])
        sess.add(p)
        sess.commit()
        sess.refresh(p)
        return jsonify({"id": str(p.id)})
    finally:
        sess.close()

@app.route("/search", methods=["GET"])
def search():
    q = request.args.get("q", "").strip()
    if q == "":
        return jsonify([])
    sess = SessionLocal()
    try:
        stmt = select(Profile).where(
            (Profile.name.ilike(f"%{q}%")) |
            (Profile.headline.ilike(f"%{q}%")) |
            (Profile.bio.ilike(f"%{q}%"))
        ).limit(50)
        items = sess.execute(stmt).scalars().all()
        result = [{
            "id": str(x.id),
            "name": x.name,
            "headline": x.headline,
            "skills": x.skills
        } for x in items]
        return jsonify(result)
    finally:
        sess.close()

@app.route("/profiles/by-skill", methods=["GET"])
def by_skill():
    skill = request.args.get("skill")
    if not skill:
        return jsonify({"error":"skill param required"}), 400
    sess = SessionLocal()
    try:
        stmt = text("SELECT * FROM profiles WHERE skills @> :arr LIMIT 100")
        rows = sess.execute(stmt, {"arr": f'["{skill}"]'}).fetchall()
        profiles = []
        for r in rows:
            profiles.append({
                "id": str(r.id),
                "name": r.name,
                "email": r.email,
                "skills": r.skills,
                "projects": r.projects
            })
        return jsonify(profiles)
    finally:
        sess.close()

@app.route("/projects", methods=["GET"])
def projects_by_skill():
    skill = request.args.get("skill")
    sess = SessionLocal()
    try:
        if skill:
            stmt = text("SELECT * FROM profiles WHERE skills @> :arr LIMIT 200")
            rows = sess.execute(stmt, {"arr": f'["{skill}"]'}).fetchall()
        else:
            stmt = select(Profile).limit(200)
            rows = sess.execute(stmt).scalars().all()

        projects = []
        for r in rows:
            # r may be Row or Profile; handle generically
            p = r if hasattr(r, "skills") else r._mapping
            proj_list = p.projects if hasattr(p, "projects") else r.projects
            owner = p.name if hasattr(p, "name") else r.name
            for pr in proj_list:
                projects.append({
                    "owner": owner,
                    "title": pr.get("title"),
                    "description": pr.get("description"),
                    "links": pr.get("links")
                })
        return jsonify(projects)
    finally:
        sess.close()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=(os.getenv("FLASK_ENV") == "development"))
