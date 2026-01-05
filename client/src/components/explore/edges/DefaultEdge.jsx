import { BaseEdge, getStraightPath } from '@xyflow/react';

export default function DefaultEdge({ id, sourceX, sourceY, targetX, targetY }) {
    const [edgePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{ stroke: 'currentColor', strokeWidth: 1, opacity: 0.1 }}
                className="text-base-content"
            />
        </>
    );
}
