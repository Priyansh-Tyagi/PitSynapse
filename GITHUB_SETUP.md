# Push to GitHub - Step by Step

## Option 1: Create New Repository on GitHub

1. **Go to GitHub.com** and sign in
2. **Click the "+" icon** → "New repository"
3. **Name it:** `PitSynapse` (or any name you like)
4. **Don't initialize** with README, .gitignore, or license (we already have these)
5. **Click "Create repository"**

## Option 2: Push to Existing Repository

If you already have a GitHub repository, use its URL.

## Commands to Run

### Step 1: Add all files
```bash
cd C:\Users\priya\Downloads\PitSynapse\PitSynapse
git add .
```

### Step 2: Commit
```bash
git commit -m "Initial commit: PitSynapse Multi-Agent Race Simulation"
```

### Step 3: Add remote (replace YOUR_USERNAME and REPO_NAME)
```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Step 4: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Quick Copy-Paste (After creating repo on GitHub)

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values:

```bash
cd C:\Users\priya\Downloads\PitSynapse\PitSynapse
git add .
git commit -m "Initial commit: PitSynapse Multi-Agent Race Simulation"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## If You Get Authentication Errors

**Use Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

**Or use GitHub CLI:**
```bash
gh auth login
gh repo create PitSynapse --public --source=. --remote=origin --push
```

## Verify Push

After pushing, check your GitHub repository - you should see all files there!

