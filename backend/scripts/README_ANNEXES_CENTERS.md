# Annexes Centers Script

This script adds annex centers (Maisons des Jeunes) across all regions of Algeria, including the Sahara.

## Features

✅ **Comprehensive Coverage**: Centers across all Algerian wilayas
✅ **Virtual Tour**: Sétif center includes `hasTour: true`
✅ **Sahara Inclusion**: Multiple centers in Sahara region (Ouargla, Ghardaïa, Tamanrasset, Béchar, Adrar, Laghouat, Biskra, El Oued, Illizi, Tindouf)
✅ **Geographic Data**: Includes latitude/longitude for all centers
✅ **Duplicate Check**: Prevents duplicate center creation

## Centers Included

### Northern Algeria

- Sétif ⭐ (hasTour: true)
- Constantine
- Annaba
- Batna
- Blida
- Tizi Ouzou
- Béjaïa
- Tlemcen
- Mostaganem
- Skikda
- Jijel
- Bouira
- Chlef

### High Plateaus

- Médéa
- M'Sila
- Bordj Bou Arréridj
- Djelfa
- Tiaret
- Saïda
- Relizane

### Sahara Region 🏜️

- Ouargla
- Ghardaïa
- Tamanrasset
- Béchar
- Adrar
- Laghouat
- Biskra
- El Oued
- Illizi
- Tindouf

## Usage

### Run the script

```bash
cd backend
node scripts/add-annexes-centers.js
```

### Using npm (if you have a script defined)

```bash
npm run add-annexes
```

## Requirements

- Node.js
- MongoDB connection
- Environment variables configured (.env file)

## What it does

1. Connects to MongoDB
2. Finds or creates an admin user
3. Creates 35 new annex centers across Algeria
4. Assigns admin user to all centers
5. Checks for duplicates before creation
6. Provides detailed statistics and summary

## Output

The script will display:

- Creation progress for each center
- Total centers created
- Centers with virtual tour
- Regional breakdown (Sahara vs Northern regions)

## Notes

- Sétif is the only center with `hasTour: true` as requested
- All other centers have `hasTour: false`
- Each center includes realistic addresses and contact information
- Geographic coordinates are accurate for map integration
- Duplicate prevention ensures script can be run multiple times safely
