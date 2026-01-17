#!/bin/bash

# Release 打包脚本
# 用法: ./scripts/release.sh [chrome|firefox|all]

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取版本号
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 输出目录
RELEASE_DIR="releases"
mkdir -p "$RELEASE_DIR"

echo -e "${BLUE}开始构建 Release v${VERSION}${NC}"

# 构建类型
BUILD_TARGET=${1:-all}

build_chrome() {
    echo -e "${GREEN}正在构建 Chrome 版本...${NC}"
    pnpm run build
    pnpm run zip
    
    # 移动并重命名压缩包
    if [ -f ".output/chrome-mv3-prod.zip" ]; then
        mv .output/chrome-mv3-prod.zip "$RELEASE_DIR/sketchHtml2Code-chrome-v${VERSION}-${TIMESTAMP}.zip"
        echo -e "${GREEN}✓ Chrome 版本已打包: $RELEASE_DIR/sketchHtml2Code-chrome-v${VERSION}-${TIMESTAMP}.zip${NC}"
    fi
}

build_firefox() {
    echo -e "${GREEN}正在构建 Firefox 版本...${NC}"
    pnpm run build:firefox
    pnpm run zip:firefox
    
    # 移动并重命名压缩包
    if [ -f ".output/firefox-mv2-prod.zip" ]; then
        mv .output/firefox-mv2-prod.zip "$RELEASE_DIR/sketchHtml2Code-firefox-v${VERSION}-${TIMESTAMP}.zip"
        echo -e "${GREEN}✓ Firefox 版本已打包: $RELEASE_DIR/sketchHtml2Code-firefox-v${VERSION}-${TIMESTAMP}.zip${NC}"
    fi
}

# 根据参数执行构建
case $BUILD_TARGET in
    chrome)
        build_chrome
        ;;
    firefox)
        build_firefox
        ;;
    all)
        build_chrome
        build_firefox
        ;;
    *)
        echo "用法: $0 [chrome|firefox|all]"
        exit 1
        ;;
esac

echo -e "${BLUE}Release 打包完成！${NC}"
echo -e "输出目录: ${GREEN}$RELEASE_DIR${NC}"
ls -lh "$RELEASE_DIR" | grep "$VERSION" || ls -lh "$RELEASE_DIR" | tail -2
