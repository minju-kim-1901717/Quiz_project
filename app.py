from flask import Flask, render_template, request, redirect, url_for, jsonify
from pathlib import Path
import json
import os

app = Flask(__name__)

DATA_FILE = Path(os.environ.get("DATA_FILE", "data.json"))

def load_data():
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []

def save_data(items):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")

@app.route("/")
def index():
    items = load_data()
    return render_template("index.html", items=items)

@app.route("/api/items", methods=["GET"])
def api_items():
    return jsonify(load_data())

@app.route("/manage")
def manage():
    items = load_data()
    return render_template("manage.html", items=items, count=len(items))

@app.route("/add", methods=["POST"])
def add():
    question = (request.form.get("question") or "").strip()
    answer = (request.form.get("answer") or "").strip()
    if not question or not answer:
        return redirect(url_for("manage"))
    items = load_data()
    items.append({"id": (items[-1]["id"]+1) if items else 1, "question": question, "answer": answer})
    save_data(items)
    return redirect(url_for("manage"))

@app.route("/delete/<int:item_id>", methods=["POST"])
def delete(item_id):
    items = load_data()
    items = [it for it in items if it.get("id") != item_id]
    for i, it in enumerate(items, start=1):
        it["id"] = i
    save_data(items)
    return redirect(url_for("manage"))

@app.route("/reset", methods=["POST"])
def reset():
    save_data([])
    return redirect(url_for("manage"))

if __name__ == "__main__":
    if not DATA_FILE.exists():
        save_data([])
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=True)
