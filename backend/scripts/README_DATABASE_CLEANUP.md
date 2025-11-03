# Database Cleanup and Validation Script

## Overview

This script performs comprehensive database cleanup and validation to ensure data integrity and quality across all entities in the MSJ platform.

## What It Does

### 🔍 Validation Checks

1. **Centers (Annexes)**
   - Validates required fields (name, wilaya, address, phone, email)
   - Ensures valid images or assigns default center images
   - Validates admin user references
   - Removes orphaned admin IDs

2. **Clubs**
   - Validates center references
   - Validates creator references
   - Assigns category-appropriate images
   - Cleans member lists (removes non-existent users)
   - Ensures required fields are present

3. **Events**
   - Validates center and club references
   - Validates creator references
   - Assigns images matching event category
   - Cleans participant lists
   - Ensures strong topic-image relationship

4. **Workshops**
   - Validates center and club references
   - Validates creator references
   - Assigns images matching workshop category
   - Ensures required fields are present
   - Maintains topic-image consistency

5. **Startup Ideas (Sparks)**
   - Validates owner references
   - Validates supervisor references
   - Assigns images matching project category
   - Ensures all professional fields are filled
   - Maintains strong category-image relationship

### 🎨 Image Assignment

The script uses category-based image libraries from Unsplash with topic-relevant imagery:

**Sports Categories:**

- Football, Basketball, Volleyball, Chess

**Arts & Culture:**

- Arts, Music, Theatre, Design

**Technology:**

- Coding, Tech, Gaming, AI, Mobile, Web

**Business & Education:**

- Education, Entrepreneurship, Marketing, Business

**Social:**

- Volunteering, Culture, Health, Social Impact

**Innovation:**

- Technology, Innovation, Science, Environment

### 🧹 Cleanup Actions

1. **Deletes Invalid Records:**
   - Records with missing required fields
   - Records referencing non-existent users
   - Records referencing non-existent centers
   - Orphaned relationships

2. **Fixes Invalid Data:**
   - Invalid image URLs replaced with category-appropriate images
   - Invalid references removed or updated
   - Empty arrays cleaned
   - Maintains referential integrity

## Usage

### Run the Script

```bash
# From the backend directory
cd backend

# Run the cleanup script
node scripts/cleanup-and-validate-database.js
```

### Expected Output

```
🚀 Starting Database Cleanup and Validation...

📍 Cleaning Centers...
  ✅ Updated center: Youth Center Algiers
  📊 Centers: 3 updated, 1 deleted

🏛️  Cleaning Clubs (Annexes)...
  ✅ Updated club: Coding Club
  ⚠️  Removing invalid clubId from event: Tech Workshop
  📊 Clubs: 5 updated, 0 deleted

📅 Cleaning Events...
  ✅ Updated event: Football Tournament
  ❌ Deleting event (center not found): Old Event
  📊 Events: 8 updated, 2 deleted

🎓 Cleaning Workshops...
  ✅ Updated workshop: Web Development Basics
  📊 Workshops: 4 updated, 1 deleted

💡 Cleaning Startup Ideas (Sparks)...
  ✅ Updated spark: AI Education Platform
  📊 Sparks: 12 updated, 0 deleted

✨ Database cleanup completed successfully!

📊 Final Database Statistics:
   Centers: 15
   Clubs: 23
   Events: 45
   Workshops: 18
   Sparks: 67
```

## When to Run

### Required:

- After importing data from external sources
- After bulk deletions or updates
- When data integrity issues are suspected
- Before production deployment

### Recommended:

- Weekly as maintenance
- After major feature releases
- After database migrations
- When users report data inconsistencies

## Safety

✅ **Safe to Run Multiple Times**

- Idempotent operations
- No duplicate creation
- Only fixes invalid data

⚠️ **What Gets Deleted:**

- Records with missing required fields
- Records with invalid foreign key references
- Truly orphaned data

💾 **Backup Recommended:**
Before running, especially on production:

```bash
mongodump --uri="your-mongodb-uri" --out=backup-$(date +%Y%m%d)
```

## Configuration

The script uses environment variables from `.env`:

- `MONGODB_URI`: Database connection string

## Image Sources

All default images are from:

- **Unsplash**: Free, high-quality images with proper licensing
- **Topic-Relevant**: Each category has 3+ curated images
- **Professional**: Suitable for production use

## Troubleshooting

### Script Fails to Connect

```
Error: connect ECONNREFUSED
```

**Solution:** Check `MONGODB_URI` in `.env` file

### Too Many Deletions

```
Deleted: 100+ records
```

**Solution:** Review deletion logs, restore from backup if needed

### Image URLs Not Working

```
Invalid image URL warnings
```

**Solution:** Images are replaced automatically with valid URLs

## Related Scripts

- `populate-arabic-data.js` - Populate sample Arabic data
- `create-super-admin.js` - Create admin users
- `create-center-admin-with-center.js` - Create centers with admins

## Support

For issues or questions:

1. Check the script output logs
2. Review the code comments
3. Contact the development team
