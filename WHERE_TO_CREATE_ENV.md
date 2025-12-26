# Where to Create the .env File

## ✅ Correct Location

The `.env` file must be created in the **`backend`** directory:

```
CipherSQLStudio/
├── backend/
│   ├── .env          ← CREATE IT HERE ✅
│   ├── server.js
│   ├── package.json
│   └── ...
├── frontend/
└── README.md
```

## ❌ Wrong Locations

Do NOT create it here:
- `CipherSQLStudio/.env` ❌ (wrong - too high up)
- `CipherSQLStudio/frontend/.env` ❌ (wrong directory)

## How to Create It

### Option 1: Copy from Template (Recommended)

1. Open your terminal/command prompt
2. Navigate to the backend directory:
   ```powershell
   cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
   ```

3. Copy the template file:
   ```powershell
   Copy-Item env.template .env
   ```

### Option 2: Create Manually

1. Navigate to: `D:\Amritesh Singh\Projects\CipherSQLStudio\backend\`
2. Create a new file named `.env` (note the dot at the beginning)
3. Copy the contents from `env.template` into `.env`
4. Fill in your actual values

### Option 3: Using File Explorer

1. Open File Explorer
2. Navigate to: `D:\Amritesh Singh\Projects\CipherSQLStudio\backend\`
3. Right-click → New → Text Document
4. Rename it to `.env` (you may need to enable "Show file extensions" in Windows)
5. Copy contents from `env.template` and fill in your values

## Verify It's in the Right Place

The file path should be exactly:
```
D:\Amritesh Singh\Projects\CipherSQLStudio\backend\.env
```

You can verify by checking if the file exists:
```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
Test-Path .env
```

Should return: `True`

## Why in the Backend Directory?

The backend server (`server.js`) loads the `.env` file using `dotenv` package, which looks for it in the same directory where the server runs. Since the server is in the `backend` folder, the `.env` file must be there too.

## Next Steps

After creating the `.env` file in the correct location:

1. Open it in a text editor
2. Fill in all the values (see `API_KEYS_SETUP.md` for detailed instructions)
3. Save the file
4. Test by running: `npm start` in the backend directory

