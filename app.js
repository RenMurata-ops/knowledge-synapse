// Knowledge Synapse — Geodesic Sphere Network
(function () {
  'use strict';

  // ===== State =====
  let graph = null;
  let currentView = '3d';
  let activeCategories = new Set(Object.keys(CATEGORIES));
  let selectedNode = null;
  let hoveredNode = null;
  let linkCountCache = {};
  let connectedNodeIds = new Set();
  const SPHERE_RADIUS = 180;

  // ===== Caches =====
  function buildCaches() {
    linkCountCache = {};
    GRAPH_DATA.nodes.forEach(n => { linkCountCache[n.id] = 0; });
    GRAPH_DATA.links.forEach(l => {
      linkCountCache[l.source] = (linkCountCache[l.source] || 0) + 1;
      linkCountCache[l.target] = (linkCountCache[l.target] || 0) + 1;
    });
  }

  function updateConnectedSet() {
    connectedNodeIds = new Set();
    if (!selectedNode) return;
    connectedNodeIds.add(selectedNode.id);
    GRAPH_DATA.links.forEach(l => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source;
      const tId = typeof l.target === 'object' ? l.target.id : l.target;
      if (sId === selectedNode.id) connectedNodeIds.add(tId);
      if (tId === selectedNode.id) connectedNodeIds.add(sId);
    });
  }

  function getCategoryColor(category) {
    return CATEGORIES[category]?.color || '#888';
  }

  // ===== Spherical position pre-calculation =====
  // Distribute nodes on a sphere using fibonacci spiral
  function assignSphericalPositions(nodes) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    nodes.forEach((node, i) => {
      const y = 1 - (i / (nodes.length - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      node.fx = SPHERE_RADIUS * radiusAtY * Math.cos(theta);
      node.fy = SPHERE_RADIUS * y;
      node.fz = SPHERE_RADIUS * radiusAtY * Math.sin(theta);
    });
  }

  // ===== Graph Initialization =====
  function initGraph() {
    const container = document.getElementById('graph-container');
    const filteredData = getFilteredData();
    buildCaches();

    // Place nodes on sphere
    assignSphericalPositions(filteredData.nodes);

    graph = ForceGraph3D({ controlType: 'orbit' })(container)
      .graphData(filteredData)
      .backgroundColor('#e8e8ec')
      .width(window.innerWidth)
      .height(window.innerHeight)
      .showNavInfo(false)

      // === Nodes — dark dots on sphere surface ===
      .nodeLabel(n => '')
      .nodeThreeObject(n => {
        const group = new THREE.Group();
        const isSelected = selectedNode && selectedNode.id === n.id;
        const isHovered = hoveredNode && hoveredNode.id === n.id;
        const isNeighbor = selectedNode && connectedNodeIds.has(n.id);
        const isDimmed = selectedNode && !isSelected && !isNeighbor;
        const catColor = getCategoryColor(n.category);

        // Dot size
        const linkCount = linkCountCache[n.id] || 0;
        const base = 1.8 + Math.min(linkCount, 10) * 0.5;
        const size = isSelected ? base * 2.0 : isHovered ? base * 1.6 : base;

        // Main dot — dark gray / black
        const dotGeo = new THREE.SphereGeometry(size, 16, 16);
        const dotColor = isSelected ? catColor : isDimmed ? '#c0c0c0' : '#2a2a2a';
        const dotMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(dotColor),
          transparent: true,
          opacity: isDimmed ? 0.25 : 1.0,
        });
        group.add(new THREE.Mesh(dotGeo, dotMat));

        // Category color ring on hover / select
        if (isSelected || isHovered) {
          const ringGeo = new THREE.RingGeometry(size * 1.6, size * 2.2, 32);
          const ringMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(catColor),
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.lookAt(0, 0, 0); // Face outward from sphere center
          group.add(ring);
        }

        // Label
        const showLabel = isSelected || isHovered || isNeighbor || (!selectedNode && linkCount >= 4);
        if (showLabel && !isDimmed) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 512;
          canvas.height = 64;
          ctx.font = `500 32px "Noto Sans JP", "Inter", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = isSelected ? catColor : '#1a1a1a';
          ctx.globalAlpha = isSelected ? 1.0 : isHovered ? 0.9 : 0.6;
          ctx.fillText(n.label, 256, 42);
          const texture = new THREE.CanvasTexture(canvas);
          texture.minFilter = THREE.LinearFilter;
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture, transparent: true, depthWrite: false,
          }));
          sprite.scale.set(48, 6, 1);
          sprite.position.y = size + 5;
          group.add(sprite);
        }

        return group;
      })

      // === Lines — thin gray wireframe feel ===
      .linkColor(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) {
          return '#1a1a1a';
        }
        if (selectedNode) return '#d5d5d8';
        return '#777';
      })
      .linkOpacity(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) return 0.8;
        if (selectedNode) return 0.08;
        return 0.3 + (link.strength || 0.5) * 0.25;
      })
      .linkWidth(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) return 1.5;
        if (selectedNode) return 0.15;
        return 0.3 + (link.strength || 0.5) * 0.5;
      })
      .linkDirectionalParticles(link => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (selectedNode && (sId === selectedNode.id || tId === selectedNode.id)) return 3;
        return 0;
      })
      .linkDirectionalParticleWidth(1.2)
      .linkDirectionalParticleSpeed(0.006)
      .linkDirectionalParticleColor(() => '#1a1a1a')

      // Interactions
      .onNodeClick(handleNodeClick)
      .onNodeHover(handleNodeHover)
      .onBackgroundClick(handleBackgroundClick)

      // Disable forces — we use fixed positions on sphere
      .d3Force('charge', null)
      .d3Force('link', null)
      .d3Force('center', null)
      .warmupTicks(0)
      .cooldownTicks(0);

    // Camera
    setTimeout(() => {
      graph.cameraPosition({ x: 0, y: 0, z: 450 });
    }, 50);

    // Auto-rotate
    const controls = graph.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    // Lighting
    const scene = graph.scene();
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    // Subtle wireframe sphere guide
    addGuideSphere(scene);

    updateStats(filteredData);
  }

  // ===== Ghost wireframe sphere =====
  function addGuideSphere(scene) {
    const geo = new THREE.SphereGeometry(SPHERE_RADIUS * 0.98, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    scene.add(new THREE.Mesh(geo, mat));
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
    updateConnectedSet();
    showNodeDetail(node);

    // Stop auto-rotate on interaction
    graph.controls().autoRotate = false;

    const distance = 120;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    graph.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node, 1000
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
      document.addEventListener('mousemove', positionTooltip);
    } else {
      container.style.cursor = 'default';
      tooltip.classList.add('hidden');
      document.removeEventListener('mousemove', positionTooltip);
    }
  }

  function positionTooltip(e) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = Math.min(e.clientX + 15, window.innerWidth - 280) + 'px';
    tooltip.style.top = Math.min(e.clientY + 15, window.innerHeight - 120) + 'px';
  }

  function handleBackgroundClick() {
    selectedNode = null;
    updateConnectedSet();
    hideNodeDetail();
    graph.controls().autoRotate = true;
    refreshGraph();
  }

  // ===== Node Detail Panel =====
  function showNodeDetail(node) {
    const panel = document.getElementById('node-detail');
    const color = getCategoryColor(node.category);
    document.getElementById('detail-category').textContent = CATEGORIES[node.category]?.label || '';
    document.getElementById('detail-category').style.background = color + '18';
    document.getElementById('detail-category').style.color = color;
    document.getElementById('detail-title').textContent = node.label;
    document.getElementById('detail-date').textContent = node.date || '';
    document.getElementById('detail-description').textContent = node.description || '';

    const kpList = document.getElementById('detail-keypoints');
    kpList.innerHTML = '';
    (node.keypoints || []).forEach(kp => {
      const li = document.createElement('li');
      li.textContent = kp;
      kpList.appendChild(li);
    });

    const connDiv = document.getElementById('detail-connections');
    connDiv.innerHTML = '';
    const connectedLinks = GRAPH_DATA.links.filter(
      l => l.source === node.id || l.target === node.id ||
        (typeof l.source === 'object' && l.source.id === node.id) ||
        (typeof l.target === 'object' && l.target.id === node.id)
    );
    const connIds = new Set();
    connectedLinks.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      if (sid !== node.id) connIds.add(sid);
      if (tid !== node.id) connIds.add(tid);
    });
    connIds.forEach(id => {
      const n = GRAPH_DATA.nodes.find(x => x.id === id);
      if (!n) return;
      const tag = document.createElement('span');
      tag.className = 'connection-tag';
      tag.textContent = n.label;
      tag.addEventListener('click', () => {
        const gn = graph.graphData().nodes.find(x => x.id === id);
        if (gn) handleNodeClick(gn);
      });
      connDiv.appendChild(tag);
    });

    document.getElementById('detail-source').textContent = node.source || '—';
    panel.classList.remove('hidden');
  }

  function hideNodeDetail() {
    document.getElementById('node-detail').classList.add('hidden');
  }

  // ===== Refresh =====
  function refreshGraph() {
    if (!graph) return;
    const data = getFilteredData();
    assignSphericalPositions(data.nodes);
    graph.graphData(data);
    updateStats(data);
  }

  function updateStats(data) {
    document.getElementById('node-count').textContent = data.nodes.length;
    document.getElementById('link-count').textContent = data.links.length;
  }

  // ===== Side Panel =====
  function initSidePanel() {
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
        if (activeCategories.has(key)) activeCategories.delete(key);
        else activeCategories.add(key);
        refreshGraph();
      });
      filtersDiv.appendChild(div);
    });

    // Timeline
    const timelineDiv = document.getElementById('timeline');
    GRAPH_DATA.nodes
      .filter(n => n.date)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .forEach((node, i, arr) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
          <div class="timeline-dot-container">
            <div class="timeline-dot" style="background: ${getCategoryColor(node.category)}"></div>
            ${i < arr.length - 1 ? '<div class="timeline-line"></div>' : ''}
          </div>
          <div class="timeline-content">
            <div class="timeline-date">${node.date}</div>
            <div class="timeline-title">${node.label}</div>
          </div>
        `;
        item.addEventListener('click', () => {
          const gn = graph.graphData().nodes.find(x => x.id === node.id);
          if (gn) handleNodeClick(gn);
        });
        timelineDiv.appendChild(item);
      });

    // Legend
    document.getElementById('legend').innerHTML = `
      <div class="legend-item">
        <div class="legend-icon"><svg width="12" height="12"><circle cx="6" cy="6" r="4" fill="#2a2a2a"/></svg></div>
        <span>点 = トピック / 人物 / 意思決定</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon"><svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#555" stroke-width="1.5"/></svg></div>
        <span>線 = 関連性</span>
      </div>
    `;

    document.getElementById('panel-toggle').addEventListener('click', () => {
      document.getElementById('side-panel').classList.toggle('collapsed');
    });
  }

  // ===== Search =====
  function initSearch() {
    let timer;
    document.getElementById('search-input').addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        refreshGraph();
        const q = e.target.value.toLowerCase();
        if (q) {
          const m = graph.graphData().nodes.find(n => n.label.toLowerCase().includes(q));
          if (m) {
            graph.controls().autoRotate = false;
            const d = 1 + 120 / Math.hypot(m.x, m.y, m.z);
            graph.cameraPosition({ x: m.x * d, y: m.y * d, z: m.z * d }, m, 800);
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
            // Flatten: override fz to 0
            graph.graphData().nodes.forEach(n => { n.fz = 0; });
            graph.cameraPosition({ x: 0, y: 0, z: 500 }, { x: 0, y: 0, z: 0 }, 1000);
            graph.refresh();
          } else {
            refreshGraph(); // re-assign sphere positions
            graph.cameraPosition({ x: 0, y: 0, z: 450 }, { x: 0, y: 0, z: 0 }, 1000);
          }
        }
      });
    });
  }

  // ===== Close Detail =====
  function initCloseDetail() {
    document.getElementById('close-detail').addEventListener('click', () => {
      selectedNode = null;
      updateConnectedSet();
      hideNodeDetail();
      graph.controls().autoRotate = true;
      refreshGraph();
    });
  }

  // ===== Minimap =====
  function updateMinimap() {
    const canvas = document.getElementById('minimap');
    const ctx = canvas.getContext('2d');
    const nodes = graph?.graphData().nodes || [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(230,230,235,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (nodes.length === 0) { requestAnimationFrame(updateMinimap); return; }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
    });
    const p = 12, rX = maxX - minX || 1, rY = maxY - minY || 1;
    const sc = Math.min((canvas.width - p * 2) / rX, (canvas.height - p * 2) / rY);

    // Links
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 0.5;
    graph.graphData().links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source : nodes.find(n => n.id === l.source);
      const t = typeof l.target === 'object' ? l.target : nodes.find(n => n.id === l.target);
      if (!s || !t) return;
      ctx.beginPath();
      ctx.moveTo(p + (s.x - minX) * sc, p + (s.y - minY) * sc);
      ctx.lineTo(p + (t.x - minX) * sc, p + (t.y - minY) * sc);
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(p + (n.x - minX) * sc, p + (n.y - minY) * sc, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#2a2a2a';
      ctx.fill();
    });

    requestAnimationFrame(updateMinimap);
  }

  // ===== Loading =====
  function hideLoading() {
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('fade-out');
    }, 1200);
  }

  function initResize() {
    window.addEventListener('resize', () => {
      if (graph) graph.width(window.innerWidth).height(window.innerHeight);
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
    setTimeout(updateMinimap, 1500);
    setTimeout(() => {
      document.getElementById('side-panel').classList.remove('collapsed');
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
