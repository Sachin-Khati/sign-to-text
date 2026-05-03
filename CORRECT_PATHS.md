# Correct Paths to Run Services

## ❌ Wrong Path
```bash
cd backend
python app.py  # This won't work!
```

## ✅ Correct Paths

### Python Service:
```bash
cd backend\python_service
python app.py
```

OR from the root directory:
```bash
cd backend/python_service
python app.py
```

### Node.js Backend:
```bash
cd backend
npm start
```

### Frontend:
```bash
cd frontend
npm run dev
```

---

## Quick Reference

| Service | Directory | Command |
|---------|-----------|---------|
| Python Service | `backend\python_service` | `python app.py` |
| Node.js Backend | `backend` | `npm start` |
| Frontend | `frontend` | `npm run dev` |

---

## The File Structure

```
AI-based-sign-language-detector-main/
├── backend/
│   ├── python_service/      ← Python app.py is HERE
│   │   └── app.py
│   ├── src/
│   │   └── server.js        ← Node.js server is HERE
│   └── package.json
├── frontend/
│   └── src/
│       └── ...
```

So remember:
- Python service: Go to `backend/python_service` first!
- Node.js backend: Just `backend` directory

