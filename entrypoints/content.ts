import './content/styles.css';

export default defineContentScript({
  matches: ['http://127.0.0.1:5500/*', 'file://*/*'],
  main() {
    console.log('Element Inspector loaded');

    // 创建浮动球容器
    const container = document.createElement('div');
    container.id = 'element-inspector-root';
    document.body.appendChild(container);

    // 创建浮动球
    const floatingBall = document.createElement('div');
    floatingBall.id = 'floating-ball';
    floatingBall.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    `;
    container.appendChild(floatingBall);

    // 创建工具栏面板
    const panel = document.createElement('div');
    panel.id = 'inspector-panel';
    panel.innerHTML = `
      <div class="panel-header" id="panel-drag-handle">
        <span class="panel-title">元素检查器</span>
        <div class="panel-header-actions">
          <button id="panel-close" title="关闭">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="prompt-section" data-field="prompt-section" style="display:none;">
        <div class="prompt-header">
          <span class="prompt-title">AI 提示词</span>
          <button id="copy-prompt" class="prompt-copy-btn" title="复制提示词">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            复制
          </button>
        </div>
        <div class="prompt-content" data-field="prompt-content"></div>
      </div>
      <div class="panel-content">
        <div class="panel-section">
          <div class="section-title">Sketch 信息</div>
          <div class="info-row">
            <span class="info-label">UUID:</span>
            <span class="info-value copyable" data-field="sketch-uuid">-</span>
          </div>
          <div class="info-row">
            <span class="info-label">类型:</span>
            <span class="info-value" data-field="sketch-type">-</span>
          </div>
          <div class="info-row">
            <span class="info-label">索引:</span>
            <span class="info-value" data-field="sketch-index">-</span>
          </div>
        </div>
        <div class="panel-section">
          <div class="section-title">元素信息</div>
          <div class="info-row">
            <span class="info-label">ID:</span>
            <span class="info-value copyable" data-field="element-id">-</span>
          </div>
          <div class="info-row">
            <span class="info-label">Class:</span>
            <span class="info-value copyable" data-field="element-class">-</span>
          </div>
          <div class="info-row">
            <span class="info-label">标签:</span>
            <span class="info-value" data-field="element-tag">-</span>
          </div>
        </div>
        <div class="panel-section">
          <div class="section-title">位置 & 大小</div>
          <div class="position-grid">
            <div class="position-item">
              <span class="position-label">X</span>
              <span class="position-value" data-field="element-x">0px</span>
            </div>
            <div class="position-item">
              <span class="position-label">Y</span>
              <span class="position-value" data-field="element-y">0px</span>
            </div>
            <div class="position-item">
              <span class="position-label">宽度</span>
              <span class="position-value" data-field="element-width">0px</span>
            </div>
            <div class="position-item">
              <span class="position-label">高度</span>
              <span class="position-value" data-field="element-height">0px</span>
            </div>
          </div>
        </div>
        <div class="panel-section">
          <div class="section-title">样式</div>
          <div class="info-row">
            <span class="info-label">背景:</span>
            <span class="info-value copyable" data-field="element-bg">-</span>
          </div>
          <div class="info-row">
            <span class="info-label">颜色:</span>
            <span class="info-value copyable" data-field="element-color">-</span>
          </div>
          <div class="info-row">
            <span class="info-label">字体:</span>
            <span class="info-value" data-field="element-font">-</span>
          </div>
          <div class="info-row">
            <span class="info-label">圆角:</span>
            <span class="info-value" data-field="element-radius">-</span>
          </div>
        </div>
        <div class="panel-section" data-field="slice-preview-section" style="display:none;">
          <div class="section-title">切片预览</div>
          <div class="slice-preview" data-field="slice-preview"></div>
        </div>
        <div class="panel-section" data-field="slice-section" style="display:none;">
          <div class="section-title">关联切片</div>
          <div class="slice-list" data-field="slice-list"></div>
        </div>
        <div class="panel-section">
          <div class="section-title">操作</div>
          <div class="action-buttons">
            <button data-action="pick" class="action-btn active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
              </svg>
              选取
            </button>
            <button data-action="copy-uuid" class="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              复制 UUID
            </button>
            <button data-action="copy-all" class="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              复制全部
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(panel);

    // 创建高亮遮罩
    const highlight = document.createElement('div');
    highlight.id = 'element-highlight';
    container.appendChild(highlight);

    // 缓存 DOM 元素引用
    const fields = {
      sketchUuid: panel.querySelector('[data-field="sketch-uuid"]') as HTMLElement,
      sketchType: panel.querySelector('[data-field="sketch-type"]') as HTMLElement,
      sketchIndex: panel.querySelector('[data-field="sketch-index"]') as HTMLElement,
      id: panel.querySelector('[data-field="element-id"]') as HTMLElement,
      class: panel.querySelector('[data-field="element-class"]') as HTMLElement,
      tag: panel.querySelector('[data-field="element-tag"]') as HTMLElement,
      x: panel.querySelector('[data-field="element-x"]') as HTMLElement,
      y: panel.querySelector('[data-field="element-y"]') as HTMLElement,
      width: panel.querySelector('[data-field="element-width"]') as HTMLElement,
      height: panel.querySelector('[data-field="element-height"]') as HTMLElement,
      bg: panel.querySelector('[data-field="element-bg"]') as HTMLElement,
      color: panel.querySelector('[data-field="element-color"]') as HTMLElement,
      font: panel.querySelector('[data-field="element-font"]') as HTMLElement,
      radius: panel.querySelector('[data-field="element-radius"]') as HTMLElement,
      sliceSection: panel.querySelector('[data-field="slice-section"]') as HTMLElement,
      sliceList: panel.querySelector('[data-field="slice-list"]') as HTMLElement,
      slicePreviewSection: panel.querySelector('[data-field="slice-preview-section"]') as HTMLElement,
      slicePreview: panel.querySelector('[data-field="slice-preview"]') as HTMLElement,
      promptSection: panel.querySelector('[data-field="prompt-section"]') as HTMLElement,
      promptContent: panel.querySelector('[data-field="prompt-content"]') as HTMLElement,
    };

    const btnPick = panel.querySelector('[data-action="pick"]') as HTMLElement;
    const btnCopyUuid = panel.querySelector('[data-action="copy-uuid"]') as HTMLElement;
    const btnCopyAll = panel.querySelector('[data-action="copy-all"]') as HTMLElement;
    const btnClose = panel.querySelector('#panel-close') as HTMLElement;
    const btnCopyPrompt = panel.querySelector('#copy-prompt') as HTMLElement;
    const dragHandle = panel.querySelector('#panel-drag-handle') as HTMLElement;

    // 状态 - 默认打开面板和选取模式
    let isPanelOpen = true;
    let isPickMode = true;
    let selectedElement: Element | null = null;
    let currentElementInfo: ReturnType<typeof getElementInfo> | null = null;

    // 默认显示为激活状态
    floatingBall.classList.add('active');

    // 拖拽相关状态
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let panelWidth = 0;
    let panelHeight = 0;

    // 初始化面板位置
    panel.style.right = '24px';
    panel.style.top = '80px';

    // 拖拽开始
    dragHandle.addEventListener('mousedown', (e) => {
      if ((e.target as Element).closest('#panel-close')) return;

      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      panelWidth = rect.width;
      panelHeight = rect.height;

      panel.style.right = 'auto';
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';

      isDragging = true;
      dragHandle.style.cursor = 'grabbing';
      e.preventDefault();
    });

    // 拖拽中
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      newX = Math.max(0, Math.min(newX, window.innerWidth - panelWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - panelHeight));

      panel.style.left = newX + 'px';
      panel.style.top = newY + 'px';
    });

    // 拖拽结束
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        dragHandle.style.cursor = 'grab';
      }
    });

    // 隐藏高亮
    function hideHighlight() {
      highlight.style.display = 'none';
    }

    // 清除选中状态
    function clearSelection() {
      selectedElement = null;
      currentElementInfo = null;
      hideHighlight();
      fields.promptSection.style.display = 'none';
    }

    // 关闭面板
    function closePanel() {
      isPanelOpen = false;
      isPickMode = false;
      panel.classList.add('hidden');
      floatingBall.classList.remove('active');
      btnPick.classList.remove('active');
      clearSelection();
    }

    // 打开面板
    function openPanel() {
      isPanelOpen = true;
      isPickMode = true;
      panel.classList.remove('hidden');
      floatingBall.classList.add('active');
      btnPick.classList.add('active');
    }

    // 浮动球点击事件
    floatingBall.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPanelOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    // 关闭按钮
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });

    // 选取按钮
    btnPick.addEventListener('click', (e) => {
      e.stopPropagation();
      isPickMode = !isPickMode;
      btnPick.classList.toggle('active', isPickMode);
      if (!isPickMode) {
        clearSelection();
      }
    });

    // 复制 UUID 按钮
    btnCopyUuid.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentElementInfo?.sketchUuid && currentElementInfo.sketchUuid !== '-') {
        navigator.clipboard.writeText(currentElementInfo.sketchUuid);
        showToast('已复制 UUID');
      }
    });

    // 复制全部信息按钮
    btnCopyAll.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentElementInfo) {
        const info = currentElementInfo;
        const text = `Sketch UUID: ${info.sketchUuid}
Type: ${info.sketchType}
Index: ${info.sketchIndex}
ID: ${info.id}
Class: ${info.className}
Tag: ${info.tagName}
Position: (${info.x}, ${info.y})
Size: ${info.width} x ${info.height}
Background: ${info.background}
Color: ${info.color}
Font Size: ${info.fontSize}
Border Radius: ${info.borderRadius}`;
        navigator.clipboard.writeText(text);
        showToast('已复制全部信息');
      }
    });

    // 存储回调
    const pendingCallbacks = new Map<string, (data: any) => void>();

    // 监听返回的数据
    window.addEventListener('__sketch_data_result', ((e: CustomEvent) => {
      const { callbackId, data } = e.detail;
      const callback = pendingCallbacks.get(callbackId);
      if (callback) {
        callback(data);
        pendingCallbacks.delete(callbackId);
      }
    }) as EventListener);

    // 获取原始数据
    function getOriginalDataFromPage(uuid: string): Promise<any> {
      return new Promise((resolve) => {
        const callbackId = `cb_${Date.now()}_${Math.random()}`;
        pendingCallbacks.set(callbackId, resolve);

        // 发送请求给注入的脚本
        window.dispatchEvent(new CustomEvent('__sketch_get_data', {
          detail: { uuid, callbackId }
        }));

        // 超时处理
        setTimeout(() => {
          if (pendingCallbacks.has(callbackId)) {
            pendingCallbacks.delete(callbackId);
            resolve(null);
          }
        }, 500);
      });
    }

    // 当前提示词内容
    let currentPrompt = '';

    // 更新提示词显示
    async function updatePromptContent() {
      if (!currentElementInfo) {
        fields.promptSection.style.display = 'none';
        currentPrompt = '';
        return;
      }

      const info = currentElementInfo;

      // 获取原始数据
      let originalData = null;
      if (info.sketchUuid && info.sketchUuid !== '-') {
        originalData = await getOriginalDataFromPage(info.sketchUuid);
      }

      // 检测是否包含图片或图标
      function hasImage(obj: any): boolean {
        if (!obj) return false;
        const str = JSON.stringify(obj);

        // 明确的图片类型
        if (str.includes('"type":"slice"') ||
            str.includes('"exportable"') ||
            str.includes('"image"') ||
            str.includes('.png"') ||
            str.includes('.jpg"') ||
            str.includes('.svg"')) {
          return true;
        }

        // 检测可能是图标的 shape（小尺寸或名称包含图标关键词）
        function checkForIcon(node: any): boolean {
          if (!node) return false;

          // 检查名称是否像图标
          const iconNames = ['icon', 'Icon', '图标', '路径', 'Vector', 'Image', 'Logo', 'logo'];
          const name = node.name || '';
          if (iconNames.some(n => name.includes(n))) {
            return true;
          }

          // 小尺寸 shape 可能是图标（<=48px）
          if (node.type === 'shape' && node.rect) {
            const { width, height } = node.rect;
            if (width <= 48 && height <= 48 && width > 0 && height > 0) {
              return true;
            }
          }

          // 递归检查子元素
          if (node.children && Array.isArray(node.children)) {
            return node.children.some((child: any) => checkForIcon(child));
          }

          return false;
        }

        return checkForIcon(obj);
      }

      let prompt = `颜色是否使用项目的主题变量，具体以项目规则为准。`;

      // 如果有图片，加上占位图服务说明
      if (hasImage(originalData) || info.relatedSlices.length > 0) {
        prompt += `
如果是图片且没有切图，请使用占位图服务：
- https://placehold.co/宽x高 (如 https://placehold.co/200x100)
- https://picsum.photos/宽/高 (如 https://picsum.photos/200/100)`;
      }

      prompt += `\n\n请根据 UUID: ${info.sketchUuid} 开发界面`;

      // 添加切片信息
      if (info.relatedSlices.length > 0) {
        prompt += `\n切片: `;
        prompt += info.relatedSlices.map(slice =>
          slice.imageUrl || slice.name || slice.uuid
        ).join(', ');
      }

      // 添加原始数据（压缩格式）
      if (originalData) {
        prompt += `\n\n原始数据:\n${JSON.stringify(originalData)}`;
      }

      currentPrompt = prompt;
      fields.promptContent.textContent = prompt;
      fields.promptSection.style.display = 'block';
    }

    // 复制提示词按钮
    btnCopyPrompt.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentPrompt) {
        navigator.clipboard.writeText(currentPrompt);
        showToast('已复制提示词');
      }
    });

    // Toast 提示
    function showToast(message: string) {
      const toast = document.createElement('div');
      toast.className = 'inspector-toast';
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }

    // 从 class 中提取 Sketch UUID
    function extractUuidFromClass(className: string): string | null {
      if (!className) return null;
      // 匹配 layer-UUID 或 slice-UUID 格式
      const match = className.match(/(?:layer|slice)-([A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12})/i);
      return match ? match[1] : null;
    }

    // 从 id 中提取 Sketch UUID
    function extractUuidFromId(id: string): string | null {
      if (!id) return null;
      const match = id.match(/(?:layer|slice|artboard)-([A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12})/i);
      return match ? match[1] : null;
    }

    // 判断元素类型
    function getSketchType(el: Element): string {
      const className = el.className || '';
      const id = el.id || '';

      if (className.includes('layer') || id.startsWith('layer-')) return '图层 (Layer)';
      if (className.includes('slice') || id.startsWith('slice-')) return '切片 (Slice)';
      if (className.includes('artboard') || id.startsWith('artboard-')) return '画板 (Artboard)';
      return el.tagName.toLowerCase();
    }

    // 检查元素是否是切片
    function isSliceElement(el: Element): boolean {
      const className = el.className || '';
      const id = el.id || '';
      return className.includes('slice') || id.startsWith('slice-');
    }

    // 获取切片的图片URL
    function getSliceImageUrl(el: Element): string | null {
      // 1. 检查元素本身是否是 img
      if (el.tagName === 'IMG') {
        return (el as HTMLImageElement).src;
      }

      // 2. 检查背景图片
      const styles = window.getComputedStyle(el);
      const bgImage = styles.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const match = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (match) return match[1];
      }

      // 3. 检查子元素中的 img
      const img = el.querySelector('img');
      if (img) return img.src;

      // 4. 检查 data 属性
      const dataImg = el.getAttribute('data-src') || el.getAttribute('data-image');
      if (dataImg) return dataImg;

      return null;
    }

    // 查找关联的切片（通过 UUID 匹配）
    function findRelatedSlices(el: Element): Array<{id: string, uuid: string, imageUrl: string | null, name: string}> {
      const slices: Array<{id: string, uuid: string, imageUrl: string | null, name: string}> = [];

      // 获取当前元素的 UUID
      const className = typeof el.className === 'string' ? el.className : '';
      const elementUuid = el.getAttribute('data-objectid') ||
                          el.getAttribute('data-id') ||
                          extractUuidFromClass(className) ||
                          extractUuidFromId(el.id);

      if (elementUuid) {
        // 通过 UUID 查找对应的切片
        const sliceSelector = `[id="slice-${elementUuid}"], [data-objectid="${elementUuid}"].slice-layer`;
        const matchedSlice = document.querySelector(sliceSelector);

        if (matchedSlice) {
          const img = matchedSlice.querySelector('img');
          const nameEl = matchedSlice.querySelector('h3');
          slices.push({
            id: matchedSlice.id,
            uuid: elementUuid,
            imageUrl: img?.src || null,
            name: nameEl?.textContent || ''
          });
        }
      }

      // 同时也检查位置重叠的切片（针对页面主体中的切片元素）
      const rect = el.getBoundingClientRect();
      document.querySelectorAll('[id^="slice-"]:not(.slice-layer)').forEach(slice => {
        const sliceRect = slice.getBoundingClientRect();
        if (sliceRect.width > 0 && sliceRect.height > 0) {
          // 检查是否有重叠
          if (!(rect.right < sliceRect.left ||
                rect.left > sliceRect.right ||
                rect.bottom < sliceRect.top ||
                rect.top > sliceRect.bottom)) {
            const uuid = slice.getAttribute('data-objectid') ||
                         extractUuidFromId(slice.id);
            if (uuid && !slices.some(s => s.uuid === uuid)) {
              slices.push({
                id: slice.id,
                uuid,
                imageUrl: getSliceImageUrl(slice),
                name: ''
              });
            }
          }
        }
      });

      return slices;
    }

    // 获取元素信息
    function getElementInfo(el: Element) {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const className = typeof el.className === 'string' ? el.className : '';

      // 提取 Sketch UUID
      const sketchUuid = el.getAttribute('data-objectid') ||
                         el.getAttribute('data-id') ||
                         extractUuidFromClass(className) ||
                         extractUuidFromId(el.id) ||
                         '-';

      // 获取索引
      const sketchIndex = el.getAttribute('data-index') ||
                          (el.id.match(/\d+$/) ? el.id.match(/\d+$/)?.[0] : '-') ||
                          '-';

      return {
        id: el.id || '-',
        className: className || '-',
        tagName: el.tagName.toLowerCase(),
        sketchUuid,
        sketchType: getSketchType(el),
        sketchIndex,
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        background: styles.backgroundColor,
        color: styles.color,
        fontSize: styles.fontSize,
        borderRadius: styles.borderRadius || '0px',
        relatedSlices: findRelatedSlices(el),
        isSlice: isSliceElement(el),
        sliceImageUrl: isSliceElement(el) ? getSliceImageUrl(el) : null,
      };
    }

    // 更新面板信息
    function updatePanel(el: Element) {
      const info = getElementInfo(el);
      currentElementInfo = info;

      fields.sketchUuid.textContent = info.sketchUuid;
      fields.sketchType.textContent = info.sketchType;
      fields.sketchIndex.textContent = info.sketchIndex;
      fields.id.textContent = info.id;
      fields.class.textContent = info.className.split(' ').slice(0, 3).join(' ') || '-';
      fields.tag.textContent = info.tagName;
      fields.x.textContent = info.x + 'px';
      fields.y.textContent = info.y + 'px';
      fields.width.textContent = info.width + 'px';
      fields.height.textContent = info.height + 'px';
      fields.bg.textContent = info.background;
      fields.color.textContent = info.color;
      fields.font.textContent = info.fontSize;
      fields.radius.textContent = info.borderRadius;

      // 更新切片预览（当选中的是切片时）
      if (info.isSlice) {
        fields.slicePreviewSection.style.display = 'block';
        // 获取切片名称
        const sliceName = selectedElement?.querySelector('h3')?.textContent || '';
        if (info.sliceImageUrl) {
          fields.slicePreview.innerHTML = `
            ${sliceName ? `<div class="slice-preview-id">
              <span class="slice-preview-label">名称:</span>
              <span class="slice-preview-value copyable">${sliceName}</span>
            </div>` : ''}
            <div class="slice-preview-image">
              <img src="${info.sliceImageUrl}" alt="切片预览" />
            </div>
            <div class="slice-preview-url">
              <span class="slice-preview-label">图片:</span>
              <span class="slice-preview-value copyable" data-copy="${info.sliceImageUrl}" title="${info.sliceImageUrl}">${info.sliceImageUrl.split('/').pop()}</span>
            </div>
          `;
        } else {
          fields.slicePreview.innerHTML = `
            ${sliceName ? `<div class="slice-preview-id">
              <span class="slice-preview-label">名称:</span>
              <span class="slice-preview-value copyable">${sliceName}</span>
            </div>` : ''}
            <div class="slice-preview-empty">未找到切片图片</div>
          `;
        }
      } else {
        fields.slicePreviewSection.style.display = 'none';
      }

      // 更新关联切片列表（非切片元素时显示）
      if (info.relatedSlices.length > 0 && !info.isSlice) {
        fields.sliceSection.style.display = 'block';
        fields.sliceList.innerHTML = info.relatedSlices.map(slice =>
          `<div class="slice-card">
            ${slice.imageUrl ? `<div class="slice-card-image"><img src="${slice.imageUrl}" alt="切片" /></div>` : ''}
            <div class="slice-card-info">
              ${slice.name ? `<div class="slice-card-row">
                <span class="slice-card-label">名称:</span>
                <span class="slice-card-value copyable">${slice.name}</span>
              </div>` : ''}
              <div class="slice-card-row">
                <span class="slice-card-label">UUID:</span>
                <span class="slice-card-value copyable" data-copy="${slice.uuid}">${slice.uuid.substring(0, 8)}...</span>
              </div>
              ${slice.imageUrl ? `<div class="slice-card-row">
                <span class="slice-card-label">图片:</span>
                <span class="slice-card-value copyable" data-copy="${slice.imageUrl}" title="${slice.imageUrl}">${slice.imageUrl.split('/').pop()}</span>
              </div>` : ''}
            </div>
          </div>`
        ).join('');
      } else {
        fields.sliceSection.style.display = 'none';
      }

      // 更新提示词
      updatePromptContent();
    }

    // 更新高亮位置
    function updateHighlight(el: Element) {
      const rect = el.getBoundingClientRect();
      highlight.style.display = 'block';
      highlight.style.left = rect.left + window.scrollX + 'px';
      highlight.style.top = rect.top + window.scrollY + 'px';
      highlight.style.width = rect.width + 'px';
      highlight.style.height = rect.height + 'px';
    }

    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      if (!isPanelOpen || !isPickMode) return;

      const target = e.target as Element;
      if (container.contains(target)) return;

      updateHighlight(target);
    });

    // 点击选中元素
    document.addEventListener('click', (e) => {
      if (!isPanelOpen || !isPickMode) return;

      const target = e.target as Element;
      if (container.contains(target)) return;

      selectedElement = target;
      updatePanel(target);
      updateHighlight(target);
    });

    // 鼠标离开页面时
    document.addEventListener('mouseleave', () => {
      if (isPickMode && !selectedElement) {
        hideHighlight();
      }
    });

    // 点击可复制元素
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;

      // 复制 UUID
      if (target.classList.contains('slice-uuid')) {
        const uuid = target.getAttribute('data-uuid');
        if (uuid) {
          navigator.clipboard.writeText(uuid);
          showToast('已复制 UUID');
        }
      }

      // 复制可复制字段
      if (target.classList.contains('copyable')) {
        const text = target.getAttribute('data-copy') || target.textContent;
        if (text && text !== '-') {
          navigator.clipboard.writeText(text);
          showToast('已复制');
        }
      }
    });
  },
});
