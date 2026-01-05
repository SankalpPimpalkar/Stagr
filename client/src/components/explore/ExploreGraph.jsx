import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StoryNode from './nodes/StoryNode';
import TagNode from './nodes/TagNode';
import TopicNode from './nodes/TopicNode';
import DefaultEdge from './edges/DefaultEdge';
import { getExploreGraphData } from './dummyData';

const { nodes: initialNodes, edges: initialEdges } = getExploreGraphData();

const nodeTypes = {
    story: StoryNode,
    tag: TagNode,
    topic: TopicNode,
};

const edgeTypes = {
    default: DefaultEdge,
};

export default function ExploreGraph() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div style={{ width: '100%', height: '100vh', background: '#000' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
                attributionPosition="bottom-left"
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
            >
                <Background color="#333" gap={50} size={1} style={{ opacity: 0.2 }} />
                <Controls showInteractive={false} className="bg-base-100 border-base-content/10 fill-base-content" />
            </ReactFlow>

            {/* Overlay Title */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                <h1 className="text-4xl font-black text-white tracking-tighter opacity-80 mix-blend-difference">
                    EXPLORE
                </h1>
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase mt-2">
                    Network Visualization
                </p>
            </div>
        </div>
    );
}
