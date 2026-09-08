# 🧹 X Post Cleaner — Bulk Delete Tweets, Reposts & Likes

A free, open-source Chrome extension to **mass delete tweets**, reposts, replies, and likes on X (formerly Twitter). No third-party services, no API keys — everything runs locally in your browser.

> ⚡ Works with the latest X.com interface (2024+). Supports both English and Spanish UI.

---

## ✨ Features

- **Bulk delete tweets** — Remove all your posts in one click
- **Delete reposts** (retweets) — Clean up shared content
- **Delete replies** — Remove all your reply history
- **Unlike posts** — Mass remove likes from your Likes tab
- **Filter by keywords** — Only delete posts containing specific words
- **Filter by date range** — Delete posts from a specific time period
- **Set a limit** — Control how many posts to delete per session
- **Dry Run mode** — Preview what will be deleted before actually removing anything (highlighted in green)
- **Delete All mode** — Skip filters and remove everything
- **No API keys needed** — Works directly through the browser
- **100% local** — Your data never leaves your computer

---

## 📦 Installation

Since this extension is not on the Chrome Web Store, you need to install it manually using **Developer Mode**.

### Step 1: Download the Extension

**Option A — Clone with Git:**
```bash
git clone https://github.com/canaldepancho-debug/bulk-delete-tweets.git
```

**Option B — Download ZIP:**
1. Click the green **"Code"** button at the top of this page
2. Select **"Download ZIP"**
3. Extract the ZIP to a folder on your computer

### Step 2: Open Chrome Extensions Page

1. Open Google Chrome
2. Type `chrome://extensions` in the address bar and press Enter
3. Enable **Developer Mode** using the toggle in the top-right corner

### Step 3: Load the Extension

1. Click the **"Load unpacked"** button (top-left)
2. Navigate to the folder where you downloaded/cloned the extension
3. Select the folder and click **"Select Folder"**

### Step 4: Pin the Extension (Optional)

1. Click the **puzzle piece icon** 🧩 in the Chrome toolbar
2. Find **"X (Twitter) Post Cleaner"** in the list
3. Click the **pin icon** 📌 to keep it visible

---

## 🚀 How to Use

1. **Navigate to your profile** on [x.com](https://x.com) (or twitter.com)
   - For tweets: go to your profile page
   - For likes: go to your profile → **Likes** tab
2. **Click the extension icon** in your Chrome toolbar
3. **Configure your options:**
   - Choose what to delete: Posts, Reposts, Replies, or Likes
   - Optionally set keyword filters, date ranges, or a deletion limit
4. **Enable or disable Dry Run:**
   - ✅ **Dry Run ON** (default): Posts will be highlighted in green but **not deleted** — use this to preview
   - ❌ **Dry Run OFF**: Posts will actually be deleted. **This is irreversible!**
5. Click **"Start Cleaning"**
6. The extension will scroll through your timeline and process posts automatically
7. You can click **"Stop"** at any time to pause

---

## ⚠️ Important Notes

- **Deletions are permanent.** Once a post is deleted, it cannot be recovered. Always use Dry Run first.
- **Stay on the X.com tab** while the extension is running. Switching tabs may interrupt the process.
- **Rate limits:** X may temporarily limit your actions if you delete too many posts too quickly. The extension includes random delays to minimize this.
- **Likes:** To unlike posts, you must be on your profile's **Likes** tab (`x.com/username/likes`).

---

## 🌐 Language Support

The extension supports **English and Spanish** out of the box. It automatically detects your browser language, and you can switch between languages anytime using the **EN/ES toggle** in the top-right corner of the popup.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/canaldepancho"><b>canaldepancho</b></a>
  <br><br>
  <b>If this tool helped you, consider giving it a ⭐ on GitHub!</b>
</p>
