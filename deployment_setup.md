# Deployment Setup Guide

Your application needs specific Environment Variables to send emails and save files effectively.

## 1. Email Configuration (Gmail)
To send booking confirmations, the system needs your Gmail credentials. Since you use 2-Step Verification (recommended), you must use an **App Password**, not your regular password.

### How to get an App Password:
1.  Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2.  Under "How you sign in to Google", select **2-Step Verification**.
3.  Scroll to the bottom and select **App passwords**.
4.  Enter a name (e.g., "Blue Lagoon Hotel") and click **Create**.
5.  Copy the 16-character password generated.

### Variables to Set:
| Variable Name | Value |
| :--- | :--- |
| `MAIL_PASSWORD` | `your-16-char-app-password` |

---

## 2. Storage Configuration (Supabase)
To ensure photos stay visible after deployments, you should use Supabase Storage.

### Variables to Set:
| Variable Name | Value |
| :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL (e.g., `https://xyz...supabase.co`) |
| `SUPABASE_KEY` | Your Supabase "service_role" or "anon" Key |

---

## How to Apply on Render / Vercel
1.  Go to your Dashboard -> Select your Project.
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Click **Add Environment Variable**.
4.  Enter the Name and Value for each variable above.
5.  **Redeploy** your application for changes to take effect.
