#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 BUILD VALIDATION SCRIPT${NC}"
echo "=================================="
echo ""

# Check 1: Node and npm installed
echo -e "${BLUE}1️⃣  Checking Node.js and npm...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found${NC}"
  exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"

if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm not found${NC}"
  exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
echo ""

# Check 2: Dependencies installed
echo -e "${BLUE}2️⃣  Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️  node_modules not found, installing...${NC}"
  npm ci
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check 3: Environment variables
echo -e "${BLUE}3️⃣  Checking environment variables...${NC}"
REQUIRED_VARS=(
  "GOOGLE_CLIENT_ID_WEB"
  "GOOGLE_CLIENT_SECRET"
  "GOOGLE_REDIRECT_URI"
  "GOOGLE_REDIRECT_URI_MOBILE"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING_VARS+=("$var")
  else
    echo -e "${GREEN}✅ $var is set${NC}"
  fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Missing environment variables: ${MISSING_VARS[*]}${NC}"
  echo "   These may be needed for production deployment"
fi
echo ""

# Check 4: TypeScript compilation
echo -e "${BLUE}4️⃣  Checking TypeScript...${NC}"
if npm run check 2>&1 | grep -q "error TS"; then
  echo -e "${YELLOW}⚠️  TypeScript errors found (may not block build)${NC}"
else
  echo -e "${GREEN}✅ TypeScript check passed${NC}"
fi
echo ""

# Check 5: Clean build
echo -e "${BLUE}5️⃣  Building application...${NC}"
rm -rf dist/
npm run build

if [ ! -f "dist/index.js" ]; then
  echo -e "${RED}❌ Build failed: dist/index.js not found${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Check 6: Build size
echo -e "${BLUE}6️⃣  Checking build size...${NC}"
BUILD_SIZE=$(du -sh dist/ | cut -f1)
echo -e "${GREEN}✅ Build size: $BUILD_SIZE${NC}"
echo ""

# Check 7: Build artifacts
echo -e "${BLUE}7️⃣  Checking build artifacts...${NC}"
REQUIRED_FILES=(
  "dist/index.js"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file exists${NC}"
  else
    echo -e "${RED}❌ $file missing${NC}"
    exit 1
  fi
done
echo ""

# Check 8: Test build locally
echo -e "${BLUE}8️⃣  Testing build locally...${NC}"
echo "   Starting server on port 3001 (non-blocking)..."

# Start server in background
NODE_ENV=production PORT=3001 timeout 10 node dist/index.js &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Test health endpoint
if curl -s http://localhost:3001/api/health | grep -q '"ok":true'; then
  echo -e "${GREEN}✅ Health endpoint working${NC}"
else
  echo -e "${RED}❌ Health endpoint failed${NC}"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

# Test OAuth endpoint
if curl -s http://localhost:3001/api/auth/google/url | grep -q '"url"'; then
  echo -e "${GREEN}✅ OAuth endpoint working${NC}"
else
  echo -e "${YELLOW}⚠️  OAuth endpoint returned unexpected response${NC}"
fi

# Kill server
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true
echo ""

# Summary
echo -e "${BLUE}=================================="
echo "✅ BUILD VALIDATION COMPLETE${NC}"
echo ""
echo -e "${GREEN}Summary:${NC}"
echo "  • Node.js: $NODE_VERSION"
echo "  • npm: $NPM_VERSION"
echo "  • Build size: $BUILD_SIZE"
echo "  • Commit: $(git rev-parse --short HEAD)"
echo "  • Branch: $(git rev-parse --abbrev-ref HEAD)"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review build output above"
echo "  2. Test in staging environment"
echo "  3. Deploy to production with: ./scripts/deploy.sh production"
echo ""
