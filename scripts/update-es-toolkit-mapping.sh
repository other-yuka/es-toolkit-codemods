#!/bin/bash
set -e

mkdir -p temp
cd temp

VERSION=$(curl https://registry.npmjs.org/es-toolkit/ | jq -r '."dist-tags".latest')
TARBALL_URL=$(curl https://registry.npmjs.org/es-toolkit/ | jq -r ".versions[\"$VERSION\"].dist.tarball")
echo "Found es-toolkit version: $VERSION"
echo "Downloading from $TARBALL_URL"

curl $TARBALL_URL -o es-toolkit.tgz

tar -xzf es-toolkit.tgz

MAPPING_FILE="../es-toolkit.mapping.json"

MAIN_EXPORTS=$(grep -o "exports\.[a-zA-Z0-9_]\+ =" package/dist/index.js | sed 's/exports\.//' | sed 's/ =//' | sort -u)

COMPAT_EXPORTS=$(grep -o "exports\.[a-zA-Z0-9_]\+ =" package/dist/compat/index.js | sed 's/exports\.//' | sed 's/ =//' | sort -u)

CONFIG_FILE="../packages/lodash-to-es-toolkit/src/constant/es-toolkit.mapping.ts"

CONFIG_DIR=$(dirname "$CONFIG_FILE")
mkdir -p "$CONFIG_DIR"

echo "// This file is auto-generated. Do not edit manually.
// Generated from es-toolkit version $VERSION

import type { CompatibilityMapping } from '../types';

export const compatibilityMap = {" > "$CONFIG_FILE"

TEMP_ENTRIES_FILE="temp_entries.txt"
touch $TEMP_ENTRIES_FILE

for export in $MAIN_EXPORTS; do
  if ! grep -q "^$export$" $TEMP_ENTRIES_FILE; then
    echo "  $export: { module: 'es-toolkit', name: '$export' }," >> "$CONFIG_FILE"
    echo "$export" >> $TEMP_ENTRIES_FILE
  fi
done

for export in $COMPAT_EXPORTS; do
  if ! grep -q "^$export$" $TEMP_ENTRIES_FILE; then
    echo "  $export: { module: 'es-toolkit/compat', name: '$export' }," >> "$CONFIG_FILE"
    echo "$export" >> $TEMP_ENTRIES_FILE
  fi
done

rm $TEMP_ENTRIES_FILE

echo "} as CompatibilityMapping;" >> "$CONFIG_FILE"

cd ..
rm -rf temp

echo $VERSION >> "version.txt"

echo "ES-Toolkit mapping updated successfully to version $VERSION"
