// Knowledge Synapse — Main Application
(function () {
  'use strict';

  // ===== State =====
  let graph = null;
  let currentView = '3d';
  let activeCategories = new Set(Object.keys(CATEGORIES));
  let selectedNode = null;
  let hoveredNode = null;

  // ===== Color Utilities =====
  function getCategoryColor(category) {
    return CATEGORIES[category]?.color || '#666';
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // ===== Graph Initialization =====
  function initGraph() {
    const container = document.getElementById('graph-container');
    const filteredData = getFilteredData();

    graph = ForceGraph3D({ controlType: 'orbit' })(container)
      .graphData(filteredData)
      .backgroundColor('#0a0a0f')
      .width(window.innerWidth)
      .height(window.innerHeight)

      // Node appearance — clean dots
      .nodeLabel(n => '')
      .nodeThreeObject(n => {
        const group = new THREE.Group();
        const color = getCategoryColor(n.category);
        const isSelected = selectedNode && selectedNode.id === n.id;
        const isHovered = hoveredNode && hoveredNode.id === n.id;

        // Connection count affects dot size
        const linkCount = GRAPH_DATA.links.filter(
          l => l.source === n.id || l.target === n.id
        ).length;
        const baseSize = 3 + Math.min(linkCount, 10) * 0.8;
        const size = isSelected ? baseSize * 1.4 : isHovered ? baseSize * 1.2 : baseSize;

        // Core dot — clean, solid circle
        const dotGeo = new THREE.SphereGeometry(size, 32, 32);
        const dotMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0xffffff : new THREE.Color(color),
          transparent: true,
          opacity: isSelected ? 1.0 : isHovered ? 1.0 : 0.85,
        });
        group.add(new THREE.Mesh(dotGeo, dotMat));

        // Subtle glow around dot
        const glowGeo = new THREE.SphereGeometry(size * 2.0, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0xffffff : new THREE.Color(color),
          transparent: true,
          opacity: isSelected ? 0.12 : isHovered ? 0.08 : 0.03,
        });
        group.add(new THREE.Mesh(glowGeo, glowMat));

        // Label — only show on hover or select, or for large nodes
        if (isSelected || isHovered || linkCount >= 4) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const text = n.label;
          const fontSize = 36;
          canvas.width = 512;
          canvas.height = 64;
          ctx.font = `400 ${fontSize}px "Noto Sans JP", "Inter", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = isSelected ? '#ffffff' : color;
          ctx.globalAlpha = isSelected ? 1.0 : isHovered ? 0.95 : 0.55;
          ctx.fillText(text, 256, 45);

          const texture = new THREE.CanvasTexture(canvas);
          texture.minFilter = THREE.LinearFilter;
          const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
          });
          const sprite = new THREE.Sprite(spriteMat);
          sprite.scale.set(55, 7, 1);
          sprite.position.y = size + 6;
          group.add(sprite);
        }

        return group;
      })

      // Link appearance — visible, clean lines
      .linkColor(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        // Highlight links connected to selected node
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) {
          return '#ffffff';
        }
        const sourceColor = getCategoryColor(
          filteredData.nodes.find(n => n.id === sId)?.category
        );
        return sourceColor || '#334';
      })
      .linkOpacity(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) {
          return 0.6;
        }
        return 0.15 + (link.strength || 0.5) * 0.15;
      })
      .linkWidth(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) {
          return 1.5;
        }
        return 0.4 + (link.strength || 0.5) * 0.6;
      })
      .linkDirectionalParticles(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) {
          return 3;
        }
        return 1;
      })
      .linkDirectionalParticleWidth(0.8)
      .linkDirectionalParticleSpeed(0.003)
      .linkDirectionalParticleColor(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        if (selectedNode) {
          const tId = typeof link.target === 'object' ? link.target.id : link.target;
          if (sId === selectedNode.id || tId === selectedNode.id) return '#ffffff';
        }
        const sourceNode = filteredData.nodes.find(n => n.id === sId);
        return getCategoryColor(sourceNode?.category);
      })

      // Interactions
      .onNodeClick(handleNodeClick)
      .onNodeHover(handleNodeHover)
      .onBackgroundClick(handleBackgroundClick)

      // Force configuration — spread nodes out for clearer lines
      .d3Force('charge', d3.forceManyBody().strength(-300))
      .d3Force('link', d3.forceLink().distance(link => 100 / (link.strength || 0.5)).strength(link => (link.strength || 0.5) * 0.25))
      .d3Force('center', d3.forceCenter())
      .d3Force('collision', d3.forceCollide(n => 12))
      .warmupTicks(80)
      .cooldownTicks(200);

    // Camera position
    setTimeout(() => {
      graph.cameraPosition({ x: 200, y: 150, z: 400 });
    }, 100);

    // Add ambient light
    const scene = graph.scene();
    const ambientLight = new THREE.AmbientLight(0x444466, 1.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(100, 200, 100);
    scene.add(dirLight);

    // Add star-like background
    addBackgroundParticles(scene);

    updateStats(filteredData);
  }

  // ===== Background Particles =====
  function addBackgroundParticles(scene) {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      const brightness = 0.1 + Math.random() * 0.3;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness + Math.random() * 0.1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    scene.add(new THREE.Points(geo, mat));
  }

  // ===== Data Filtering =====
  function getFilteredData() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    const nodes = GRAPH_DATA.nodes.filter(n => {
      if (!activeCategories.has(n.category)) return false;
      if (searchQuery && !n.label.toLowerCase().includes(searchQuery) &&
        !n.description?.toLowerCase().includes(searchQuery)) return false;
      return true;
    });

    const nodeIds = new Set(nodes.map(n => n.id));
    const links = GRAPH_DATA.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    return { nodes, links };
  }

  // ===== Event Handlers =====
  function handleNodeClick(node) {
    if (!node) return;
    selectedNode = node;
    showNodeDetail(node);

    // Focus camera on node
    const distance = 180;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    graph.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      1200
    );

    refreshGraph();
  }

  function handleNodeHover(node) {
    hoveredNode = node;
    const tooltip = document.getElementById('tooltip');
    const container = document.getElementById('graph-container');

    if (node) {
      container.style.cursor = 'pointer';
      tooltip.innerHTML = `
        <div class="tooltip-category" style="color: ${getCategoryColor(node.category)}">${CATEGORIES[node.category]?.label || ''}</div>
        <div class="tooltip-title">${node.label}</div>
        <div class="tooltip-desc">${(node.description || '').substring(0, 80)}${node.description?.length > 80 ? '...' : ''}</div>
      `;
      tooltip.classList.remove('hidden');

      // Position tooltip near cursor
      const rect = container.getBoundingClientRect();
      const event = graph.renderer().domElement;
      document.addEventListener('mousemove', positionTooltip);
    } else {
      container.style.cursor = 'default';
      tooltip.classList.add('hidden');
      document.removeEventListener('mousemove', positionTooltip);
    }
  }

  function positionTooltip(e) {
    const tooltip = document.getElementById('tooltip');
    const x = e.clientX + 15;
    const y = e.clientY + 15;
    tooltip.style.left = Math.min(x, window.innerWidth - 280) + 'px';
    tooltip.style.top = Math.min(y, window.innerHeight - 120) + 'px';
  }

  function handleBackgroundClick() {
    selectedNode = null;
    hideNodeDetail();
    refreshGraph();
  }

  // ===== Node Detail Panel =====
  function showNodeDetail(node) {
    const panel = document.getElementById('node-detail');
    const color = getCategoryColor(node.category);

    document.getElementById('detail-category').textContent = CATEGORIES[node.category]?.label || '';
    document.getElementById('detail-category').style.background = color + '20';
    document.getElementById('detail-category').style.color = color;
    document.getElementById('detail-title').textContent = node.label;
    document.getElementById('detail-date').textContent = node.date || '';
    document.getElementById('detail-description').textContent = node.description || '';

    // Keypoints
    const kpList = document.getElementById('detail-keypoints');
    kpList.innerHTML = '';
    (node.keypoints || []).forEach(kp => {
      const li = document.createElement('li');
      li.textContent = kp;
      kpList.appendChild(li);
    });

    // Connections
    const connDiv = document.getElementById('detail-connections');
    connDiv.innerHTML = '';
    const connectedLinks = GRAPH_DATA.links.filter(
      l => l.source === node.id || l.target === node.id ||
        (typeof l.source === 'object' && l.source.id === node.id) ||
        (typeof l.target === 'object' && l.target.id === node.id)
    );
    const connectedIds = new Set();
    connectedLinks.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      if (sid !== node.id) connectedIds.add(sid);
      if (tid !== node.id) connectedIds.add(tid);
    });
    connectedIds.forEach(id => {
      const n = GRAPH_DATA.nodes.find(x => x.id === id);
      if (!n) return;
      const tag = document.createElement('span');
      tag.className = 'connection-tag';
      tag.textContent = n.label;
      tag.style.borderColor = getCategoryColor(n.category) + '40';
      tag.addEventListener('click', () => {
        const graphNode = graph.graphData().nodes.find(gn => gn.id === id);
        if (graphNode) handleNodeClick(graphNode);
      });
      connDiv.appendChild(tag);
    });

    // Source
    document.getElementById('detail-source').textContent = node.source || '—';

    panel.classList.remove('hidden');
  }

  function hideNodeDetail() {
    document.getElementById('node-detail').classList.add('hidden');
  }

  // ===== Refresh Graph =====
  function refreshGraph() {
    if (!graph) return;
    const data = getFilteredData();
    graph.graphData(data);
    updateStats(data);
  }

  function updateStats(data) {
    document.getElementById('node-count').textContent = data.nodes.length;
    document.getElementById('link-count').textContent = data.links.length;
  }

  // ===== Side Panel =====
  function initSidePanel() {
    // Category filters
    const filtersDiv = document.getElementById('category-filters');
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      const count = GRAPH_DATA.nodes.filter(n => n.category === key).length;
      const div = document.createElement('div');
      div.className = 'category-filter active';
      div.dataset.category = key;
      div.innerHTML = `
        <span class="category-dot" style="background: ${cat.color}"></span>
        <span class="category-label">${cat.label}</span>
        <span class="category-count">${count}</span>
      `;
      div.addEventListener('click', () => {
        div.classList.toggle('active');
        if (activeCategories.has(key)) {
          activeCategories.delete(key);
        } else {
          activeCategories.add(key);
        }
        refreshGraph();
      });
      filtersDiv.appendChild(div);
    });

    // Timeline
    const timelineDiv = document.getElementById('timeline');
    const datedNodes = GRAPH_DATA.nodes
      .filter(n => n.date)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    datedNodes.forEach((node, i) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-dot-container">
          <div class="timeline-dot" style="background: ${getCategoryColor(node.category)}"></div>
          ${i < datedNodes.length - 1 ? '<div class="timeline-line"></div>' : ''}
        </div>
        <div class="timeline-content">
          <div class="timeline-date">${node.date}</div>
          <div class="timeline-title">${node.label}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        const graphNode = graph.graphData().nodes.find(gn => gn.id === node.id);
        if (graphNode) handleNodeClick(graphNode);
      });
      timelineDiv.appendChild(item);
    });

    // Legend
    const legendDiv = document.getElementById('legend');
    legendDiv.innerHTML = `
      <div class="legend-item">
        <div class="legend-icon"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#00f0ff" opacity="0.6"/></svg></div>
        <span>ノード = トピック / 人物 / 決定事項</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon"><svg width="12" height="2"><line x1="0" y1="1" x2="12" y2="1" stroke="#00f0ff" stroke-width="1.5"/></svg></div>
        <span>リンク = 関連性（太さ=強さ）</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon"><svg width="12" height="12"><circle cx="6" cy="6" r="2" fill="#fff"/></svg></div>
        <span>パーティクル = 情報の流れ</span>
      </div>
    `;

    // Toggle
    document.getElementById('panel-toggle').addEventListener('click', () => {
      document.getElementById('side-panel').classList.toggle('collapsed');
    });
  }

  // ===== Search =====
  function initSearch() {
    let debounceTimer;
    document.getElementById('search-input').addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        refreshGraph();
        const query = e.target.value.toLowerCase();
        if (query) {
          const match = graph.graphData().nodes.find(n =>
            n.label.toLowerCase().includes(query)
          );
          if (match) {
            graph.cameraPosition(
              { x: match.x + 150, y: match.y + 80, z: match.z + 150 },
              match,
              800
            );
          }
        }
      }, 300);
    });
  }

  // ===== View Toggle =====
  function initViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        if (view !== currentView) {
          currentView = view;
          if (view === '2d') {
            // Flatten to 2D by constraining z
            graph.d3Force('z', d3.forceZ(0).strength(0.5));
            graph.cameraPosition({ x: 0, y: 0, z: 600 }, { x: 0, y: 0, z: 0 }, 1000);
          } else {
            graph.d3Force('z', null);
            graph.cameraPosition({ x: 200, y: 150, z: 400 }, { x: 0, y: 0, z: 0 }, 1000);
          }
          graph.numDimensions(view === '2d' ? 2 : 3);
        }
      });
    });
  }

  // ===== Close Detail =====
  function initCloseDetail() {
    document.getElementById('close-detail').addEventListener('click', () => {
      selectedNode = null;
      hideNodeDetail();
      refreshGraph();
    });
  }

  // ===== Minimap =====
  function updateMinimap() {
    const canvas = document.getElementById('minimap');
    const ctx = canvas.getContext('2d');
    const nodes = graph?.graphData().nodes || [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(10, 10, 15, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (nodes.length === 0) return;

    // Find bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });

    const padding = 15;
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scaleX = (canvas.width - padding * 2) / rangeX;
    const scaleY = (canvas.height - padding * 2) / rangeY;
    const scale = Math.min(scaleX, scaleY);

    // Draw links
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    const links = graph.graphData().links;
    links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source : nodes.find(n => n.id === l.source);
      const t = typeof l.target === 'object' ? l.target : nodes.find(n => n.id === l.target);
      if (!s || !t) return;
      ctx.beginPath();
      ctx.moveTo(padding + (s.x - minX) * scale, padding + (s.y - minY) * scale);
      ctx.lineTo(padding + (t.x - minX) * scale, padding + (t.y - minY) * scale);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      const x = padding + (n.x - minX) * scale;
      const y = padding + (n.y - minY) * scale;
      const color = getCategoryColor(n.category);

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(updateMinimap);
  }

  // ===== Loading =====
  function hideLoading() {
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('fade-out');
    }, 1500);
  }

  // ===== Window Resize =====
  function initResize() {
    window.addEventListener('resize', () => {
      if (graph) {
        graph.width(window.innerWidth).height(window.innerHeight);
      }
    });
  }

  // ===== Init =====
  function init() {
    initGraph();
    initSidePanel();
    initSearch();
    initViewToggle();
    initCloseDetail();
    initResize();
    hideLoading();

    // Start minimap after graph settles
    setTimeout(updateMinimap, 2000);

    // Open side panel after a moment
    setTimeout(() => {
      document.getElementById('side-panel').classList.remove('collapsed');
    }, 2500);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
