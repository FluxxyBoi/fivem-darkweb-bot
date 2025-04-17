# 🕷️ DarkWeb — FiveM Syndicate Discord Bot

Welcome to **DarkWeb**, the Discord bot built for FiveM roleplay servers that thrive on secrecy, syndicates, and shadows.  
This bot offers a fully interactive darkweb messaging experience — complete with role control, attachments, and approval flows.

> ⚠️ For educational and community server use only. This bot does NOT promote or support illegal behavior.

---

## 🔥 **FiveM Darkweb Discord Bot – Features Overview**

### 💬 **Direct DM-to-Darkweb Communication**
- Users can **DM the bot** directly.
- If the user has an authorized role (`Syndicate`, `Redliners`, or `Blackwaters`), their message gets forwarded to a configured "darkweb" channel.

### 🔐 **Role-Based Access Control**
- Only users with specific roles (defined in `config.json`) can interact with the bot.
- Others are politely denied with a DM reply.

### 🖼️ **Attachment Support**
- Handles **attachments-only messages** (e.g., screenshots, images).
- Displays buttons for **Confirm**, **Cancel**, and **Toggle Ping**.

### 📩 **Embed-Based Messaging**
- Text messages (with or without attachments) are wrapped in a **Discord embed**.
- Auto-includes a thumbnail (either the server icon or bot's avatar).
- Optional image preview if only one image is attached.

### 📢 **Ping Toggle Feature**
- Users can choose to **toggle @everyone ping** when forwarding their message.
- The ping status is reflected on the button (`Ping Enabled` / `Ping Disabled`).
- Default: Ping is disabled.

### ✅ **Approval Flow**
- Before sending, users must explicitly **confirm** their message via buttons.
- They can also cancel the operation.
- Buttons are disabled automatically after timeout (20 seconds).

### 🛡️ **Failsafes & Errors Handled**
- Checks for missing roles, channels, or invalid states.
- Sends **ephemeral replies** for interactions, so responses stay private.
- Logs errors gracefully in the console.

---

## ⚙️ Requirements

- [Node.js v18+](https://nodejs.org/)
- [Discord Bot Token](https://discord.com/developers/applications)
- A Discord bot with intents enabled.

---

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/FluxxyBoi/fivem-darkweb-bot.git
   cd fivem-darkweb-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
4. **Configure your roles and settings**

   Fill out the config.json with the bot's token ([Get Here](https://discord.com/developers/applications)), Role IDs, Guild ID, embed footer and author.

5. **Run the bot**
   ```bash
   node index.js
   ```

6. ✅ **Done!** Your bot should now be online and responding to DMs from users with valid roles.

---

## 💡 Tips

- Make sure your bot has access to read/write messages in the configured darkweb channel.
- Update the embed styling and confirmation flow to match your RP server’s theme.
- You can easily customize button labels, timeouts, and messages in the code.

---

## 📜 License

This project is licensed under the MIT license:

### ✅ **What You Can Do (Permissions)**

- **Use** the software for any purpose (personal, commercial, etc.)
- **Modify** the source code as you like
- **Distribute** the original or your modified version
- **Sublicense** your modified version
- **Include it in closed-source or proprietary software**
- **Use it privately** without any obligation to publish changes

---

### 🛑 **What You Can’t Do (Limitations)**

- You **can’t remove the original license** or copyright notice
- You **can’t hold the original creator liable** if the software causes issues (it's provided *"as-is"* without warranty)
- You **can’t sue** the author for damages, bugs, or losses caused by using the software

---

### 📝 Obligations

- You **must include** the original MIT License and copyright notice:
  > “Copyright [YEAR] [AUTHOR]”
  > 
---

Enjoy the darkness. 🕶️  
Made with ☕ + 💻
