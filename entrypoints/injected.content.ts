// 运行在页面上下文中 (MAIN world)，可以访问页面的 JS 变量
export default defineContentScript({
  matches: ['http://127.0.0.1:5500/*', 'file://*/*'],
  world: 'MAIN',
  main() {
    // 监听来自 content script 的请求
    window.addEventListener('__sketch_get_data', ((e: CustomEvent) => {
      const uuid = e.detail.uuid;
      const callbackId = e.detail.callbackId;

      // @ts-ignore - data 是页面中的全局变量
      if (typeof data === 'undefined') {
        window.dispatchEvent(new CustomEvent('__sketch_data_result', {
          detail: { callbackId, data: null }
        }));
        return;
      }

      // 在 layers 中查找匹配的对象
      function findLayer(uuid: string): any {
        // @ts-ignore
        for (const artboard of (data.artboards || [])) {
          for (const layer of (artboard.layers || [])) {
            if (layer.objectID === uuid) {
              return { layer, artboard };
            }
          }
        }
        // 在 slices 中查找
        // @ts-ignore
        for (const slice of (data.slices || [])) {
          if (slice.objectID === uuid) {
            return { layer: slice, isSlice: true };
          }
        }
        return null;
      }

      // 检查 rect2 是否在 rect1 内部
      function isRectInside(rect1: any, rect2: any): boolean {
        return rect2.x >= rect1.x &&
               rect2.y >= rect1.y &&
               rect2.x + rect2.width <= rect1.x + rect1.width &&
               rect2.y + rect2.height <= rect1.y + rect1.height;
      }

      // 构建树形结构
      function buildTree(parentRect: any, allLayers: any[], excludeIds: Set<string>): any[] {
        // 找到在 parent rect 内的所有元素
        const candidates = allLayers.filter(layer =>
          !excludeIds.has(layer.objectID) &&
          layer.rect &&
          isRectInside(parentRect, layer.rect)
        );

        // 按面积从大到小排序
        candidates.sort((a, b) => {
          const areaA = a.rect.width * a.rect.height;
          const areaB = b.rect.width * b.rect.height;
          return areaB - areaA;
        });

        const directChildren: any[] = [];
        const usedIds = new Set(excludeIds);

        for (const layer of candidates) {
          // 检查是否被已添加的子元素包含
          const isContainedByChild = directChildren.some(child =>
            isRectInside(child.rect, layer.rect)
          );

          if (!isContainedByChild) {
            usedIds.add(layer.objectID);
            const children = buildTree(layer.rect, allLayers, usedIds);
            const layerWithChildren = { ...layer };
            if (children.length > 0) {
              layerWithChildren.children = children;
            }
            directChildren.push(layerWithChildren);
          }
        }

        return directChildren;
      }

      const found = findLayer(uuid);
      let result = null;

      if (found) {
        const { layer, artboard, isSlice } = found;

        if (isSlice) {
          // 如果是切片，直接返回
          result = layer;
        } else if (artboard && layer.rect) {
          // 对所有类型的元素都构建子元素树
          const excludeIds = new Set([layer.objectID]);
          const children = buildTree(layer.rect, artboard.layers, excludeIds);
          result = { ...layer };
          if (children.length > 0) {
            result.children = children;
          }
        } else {
          result = layer;
        }
      }

      // 返回数据给 content script
      window.dispatchEvent(new CustomEvent('__sketch_data_result', {
        detail: { callbackId, data: result }
      }));
    }) as EventListener);

    console.log('Sketch data bridge ready');
  },
});
