# Portfolio Visitor Counter (Next.js + Prisma + PostgreSQL)

🚀 A full-stack utility app to track **unique visitors** and **total visits** for your portfolio or static website. Built with **Next.js 14 (App Router)**, **TailwindCSS**, **shadcn/ui**, **Prisma ORM**, and **PostgreSQL**. Designed to be deployed on **Vercel** with PostgreSQL hosted on providers like **Supabase**, **Neon**, or **Render**.

---

## ✨ Features

* Tracks **unique visitors** by IP (no duplicate counting).
* Records **total visit count** for each visitor.
* Provides API endpoints to fetch **unique visitor count** and **total visits**.
* Ready-to-use UI with **shadcn/ui** and TailwindCSS.
* Can be integrated with any static portfolio (GitHub Pages, Netlify, etc.).

---

## 🏗️ Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/)
* **Styling**: [TailwindCSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
* **ORM**: [Prisma](https://www.prisma.io/)
* **Database**: PostgreSQL (Supabase / Neon / Render)
* **Deployment**: [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```
portfolio-util/
├── app/
│   ├── api/
│   │   └── visitors/
│   │       └── route.ts       # API logic for visitor tracking
│   └── page.tsx               # Frontend UI
├── components/                # shadcn-ui components
├── prisma/
│   └── schema.prisma          # Prisma schema (Visitor model)
├── public/
├── styles/
├── .env                       # Environment variables (ignored in Git)
├── .gitignore                 # Ignore unnecessary files
├── README.md                  # Documentation
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/azhagu-swe/portfolio-util.git
cd portfolio-util
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of your project and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@host:5432/dbname?sslmode=require"
```

### 4. Initialize Prisma

```bash
npx prisma migrate dev --name init
```

This will create the database schema based on `schema.prisma`.

### 5. Run the development server

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`.

### 6. Deploy to Vercel

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Add `DATABASE_URL` in Vercel’s Environment Variables.
4. Deploy 🎉

---

## 🔗 API Endpoints

### **POST** `/api/visitors`

* Registers a visit.
* Increments `visitCount` if the IP already exists.
* Returns current stats.

**Example response:**

```json
{
  "uniqueVisitors": 42,
  "totalVisits": 87
}
```

### **GET** `/api/visitors`

* Fetches visitor statistics without registering a new visit.

**Example response:**

```json
{
  "uniqueVisitors": 42,
  "totalVisits": 87
}
```

---

## 📊 Database Schema

`prisma/schema.prisma`

```prisma
model Visitor {
  id         Int      @id @default(autoincrement())
  ip         String   @unique
  visitCount Int      @default(1)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

* `ip` → Unique identifier for a visitor.
* `visitCount` → Number of times this IP visited.
* `createdAt` / `updatedAt` → Timestamps.

---

## 📦 Integration with GitHub Pages Portfolio

To display visitor stats on your static portfolio:

```html
<div>
  Visitors: <span id="unique-visitors">0</span><br />
  Total Visits: <span id="total-visits">0</span>
</div>

<script>
  fetch("https://your-vercel-app.vercel.app/api/visitors", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      document.getElementById("unique-visitors").innerText = data.uniqueVisitors;
      document.getElementById("total-visits").innerText = data.totalVisits;
    });
</script>
```

---

## 🛠️ Development Tools

* **Prisma Studio** (GUI for DB)

```bash
npx prisma studio
```

---


## 👨‍💻 Author

Created by azhagu-swe(https://github.com/azhagu-swe). 
