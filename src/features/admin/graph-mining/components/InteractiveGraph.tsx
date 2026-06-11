import React, { useState, useMemo } from 'react'
import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { useTranslation } from 'react-i18next'

// Coordinates and details for Y1-Y4 representative network
const NODES = [
  // Year 1 (Y: 80)
  { id: 'CS111', name: 'Introduction to Computer science', label: 'Intro to CS', x: 120, y: 70, pr: 2.8889, deg: 1, bet: 0 },
  { id: 'CS112', name: 'Programming Language 1', label: 'Programming 1', x: 280, y: 70, pr: 3.2223, deg: 7, bet: 30 },
  { id: 'MA111', name: 'Mathematics 1', label: 'Mathematics 1', x: 440, y: 70, pr: 0.9272, deg: 1, bet: 0 },
  { id: 'ST121', name: 'Probability and Statistics 1', label: 'Probability 1', x: 600, y: 70, pr: 1.7312, deg: 4, bet: 0 },
  { id: 'IS231', name: 'Fundamentals of Information Systems', label: 'Fund of IS', x: 760, y: 70, pr: 1.2806, deg: 5, bet: 0 },

  // Year 2 (Y: 190)
  { id: 'CS214', name: 'Data Structures', label: 'Data Structures', x: 200, y: 180, pr: 1.4394, deg: 2, bet: 26 },
  { id: 'CS221', name: 'Logic Design', label: 'Logic Design', x: 360, y: 180, pr: 1.0581, deg: 3, bet: 0 },
  { id: 'IS211', name: 'Database Systems 1', label: 'Database 1', x: 520, y: 180, pr: 1.7339, deg: 10, bet: 0 },
  { id: 'IT221', name: 'Data Communication', label: 'Data Comm', x: 680, y: 180, pr: 0.9306, deg: 2, bet: 7 },
  { id: 'MA112', name: 'Discrete Mathematics', label: 'Discrete Math', x: 840, y: 180, pr: 0.5325, deg: 3, bet: 0 },

  // Year 3 (Y: 300)
  { id: 'CS316', name: 'Algorithms', label: 'Algorithms', x: 200, y: 290, pr: 1.367, deg: 3, bet: 33 },
  { id: 'CS251', name: 'Software Engineering 1', label: 'Software Eng 1', x: 360, y: 290, pr: 0.5325, deg: 3, bet: 6 },
  { id: 'IT222', name: 'Computer Networks 1', label: 'Networks 1', x: 520, y: 290, pr: 0.7684, deg: 4, bet: 10 },
  { id: 'IT241', name: 'Signals and Systems', label: 'Signals & Sys', x: 680, y: 290, pr: 0.6218, deg: 2, bet: 8 },
  { id: 'IS351', name: 'System Analysis and Design 1', label: 'Sys Analysis 1', x: 840, y: 290, pr: 0.7301, deg: 2, bet: 5 },

  // Year 4 (Y: 410)
  { id: 'AI', name: 'Artificial Intelligence', label: 'Artificial Intel', x: 120, y: 400, pr: 1.1318, deg: 6, bet: 32 },
  { id: 'ML', name: 'Machine Learning', label: 'Machine Learning', x: 280, y: 400, pr: 0.405, deg: 2, bet: 4 },
  { id: 'CA', name: 'Computer Architecture', label: 'Computer Arch', x: 440, y: 400, pr: 0.5325, deg: 3, bet: 3 },
  { id: 'DB2', name: 'Database Systems 2', label: 'Database 2', x: 600, y: 400, pr: 0.5134, deg: 2, bet: 3 },
  { id: 'IP1', name: 'Image Processing 1', label: 'Image Proc 1', x: 760, y: 400, pr: 0.2775, deg: 1, bet: 3 }
]

const EDGES = [
  { from: 'CS112', to: 'CS214' },
  { from: 'CS214', to: 'CS316' },
  { from: 'CS316', to: 'AI' },
  { from: 'ST121', to: 'ML' },
  { from: 'CS221', to: 'CA' },
  { from: 'IS211', to: 'DB2' },
  { from: 'IT221', to: 'IT222' },
  { from: 'IT241', to: 'IP1' },
  { from: 'CS251', to: 'AI' },
  { from: 'IT222', to: 'CA' }
]

export function InteractiveGraph() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  const [pan, setPan] = useState({ x: 40, y: 30 })
  const [zoom, setZoom] = useState(0.85)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const hoveredNode = useMemo(() => {
    return NODES.find((n) => n.id === hoveredNodeId) || null
  }, [hoveredNodeId])

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement
    if (target.closest('.node-element')) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    const scale = e.deltaY < 0 ? 1.05 : 0.95
    setZoom((z) => Math.min(Math.max(z * scale, 0.3), 3))
  }

  const resetView = () => {
    setPan({ x: 40, y: 30 })
    setZoom(0.85)
    setSelectedNode(null)
  }

  // Calculate high priority list for highlighting related nodes
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return new Set<string>()
    const set = new Set<string>([selectedNode])
    EDGES.forEach((edge) => {
      if (edge.from === selectedNode) set.add(edge.to)
      if (edge.to === selectedNode) set.add(edge.from)
    })
    return set
  }, [selectedNode])

  return (
    <Card style={{ marginBottom: '1.5rem', position: 'relative' }}>
      <CardTitle>{t('graphMining.visualizationTitle')}</CardTitle>
      <p style={{ fontSize: '.78rem', color: 'var(--muted2)', margin: '-0.5rem 0 1rem 0', lineHeight: 1.5 }}>
        {t('graphMining.interactiveHelp')}
      </p>

      {/* SVG Container */}
      <div
        style={{
          width: '100%',
          height: 480,
          background: 'rgba(7, 9, 15, 0.45)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <svg
          width="100%"
          height="100%"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Arrow markers definitions */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 255, 255, 0.15)" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
          </defs>

          {/* Group wrapper applying Panning and Zooming */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Draw Prerequisite Edges */}
            {EDGES.map((edge, idx) => {
              const fromNode = NODES.find((n) => n.id === edge.from)
              const toNode = NODES.find((n) => n.id === edge.to)
              if (!fromNode || !toNode) return null

              // Highlight calculation
              let stroke = 'rgba(255, 255, 255, 0.12)'
              let strokeWidth = 1.5
              let marker = 'url(#arrow)'
              let opacity = 1

              if (selectedNode) {
                if (edge.from === selectedNode) {
                  stroke = '#10b981' // green: unlocked path
                  strokeWidth = 2.5
                  marker = 'url(#arrow-green)'
                } else if (edge.to === selectedNode) {
                  stroke = '#ef4444' // red: prerequisite path
                  strokeWidth = 2.5
                  marker = 'url(#arrow-red)'
                } else {
                  opacity = 0.15
                }
              }

              return (
                <line
                  key={`${edge.from}-${edge.to}-${idx}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                  opacity={opacity}
                  style={{ transition: 'stroke .2s, stroke-width .2s, opacity .2s' }}
                />
              )
            })}

            {/* Draw Nodes */}
            {NODES.map((node) => {
              const isSelected = selectedNode === node.id
              const isHighlighted = selectedNode ? connectedNodes.has(node.id) : false
              const opacity = selectedNode && !isHighlighted ? 0.35 : 1

              let strokeColor = 'rgba(255, 255, 255, 0.15)'
              let nodeBg = 'rgba(30, 41, 59, 0.85)'
              let textWeight = 500

              if (isSelected) {
                strokeColor = 'var(--accent)'
                nodeBg = 'rgba(59, 130, 246, 0.15)'
                textWeight = 800
              } else if (isHighlighted) {
                // If it is prerequisite, red; if dependency, green
                const isPrereq = EDGES.some((e) => e.from === node.id && e.to === selectedNode)
                strokeColor = isPrereq ? '#ef4444' : '#10b981'
                nodeBg = isPrereq ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)'
              }

              return (
                <g
                  key={node.id}
                  className="node-element"
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{ cursor: 'pointer', opacity, transition: 'opacity .25s' }}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  onMouseEnter={(e) => {
                    setHoveredNodeId(node.id)
                    setTooltipPos({ x: node.x, y: node.y })
                  }}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle
                    r="15"
                    fill={nodeBg}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3 : 1.5}
                    style={{ transition: 'fill .2s, stroke .2s, stroke-width .2s' }}
                  />
                  <text
                    y="32"
                    textAnchor="middle"
                    fill="var(--text)"
                    fontSize="11"
                    fontWeight={textWeight}
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {node.label}
                  </text>
                  <text
                    y="-2"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--muted2)"
                    fontSize="7.5"
                    style={{
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {node.id}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Toolbar Controls Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: isRtl ? 'auto' : '1rem',
            left: isRtl ? '1rem' : 'auto',
            display: 'flex',
            gap: '.5rem',
            zIndex: 10,
          }}
        >
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(z + 0.15, 3))}>
            {t('graphMining.zoomIn')}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(z - 0.15, 0.3))}>
            {t('graphMining.zoomOut')}
          </Button>
          <Button size="sm" variant="outline" onClick={resetView}>
            🔄 {t('graphMining.reset')}
          </Button>
        </div>

        {/* Hover Tooltip Overlay (coordinates mapped relative to layout scale) */}
        {hoveredNode && (
          <div
            style={{
              position: 'absolute',
              top: 15,
              left: isRtl ? '15px' : 'auto',
              right: isRtl ? 'auto' : '15px',
              background: 'rgba(7, 9, 15, 0.92)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '.75rem .9rem',
              maxWidth: 240,
              pointerEvents: 'none',
              boxShadow: '0 4px 25px rgba(0,0,0,0.5)',
              zIndex: 20,
              fontSize: '.78rem',
              animation: 'fadeIn .15s ease',
            }}
          >
            <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '.35rem', fontFamily: 'Tajawal, sans-serif' }}>
              {hoveredNode.name}
            </div>
            <div style={{ color: 'var(--muted2)', fontSize: '.72rem', marginBottom: '.4rem', fontFamily: 'monospace' }}>
              ID: {hoveredNode.id}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '.4rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted2)' }}>{t('graphMining.pagerank')}:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent2)' }}>{hoveredNode.pr.toFixed(4)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted2)' }}>{t('graphMining.degreeScore')}:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{hoveredNode.deg}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted2)' }}>{t('graphMining.betweenness')}:</span>
                <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{hoveredNode.bet.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
